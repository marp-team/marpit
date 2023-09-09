const fs = require('fs')
const http = require('http')
const path = require('path')
const stream = require('stream')
const chokidar = require('chokidar')
const handler = require('serve-handler')
const WebSocket = require('ws')
const build = require('./modules/build')

const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, wait)
  }
}

// Serve WebSocket server for live reload
const wsPort = process.env.WS_PORT || 3001
const wss = new WebSocket.Server({ port: wsPort })
const reload = () => wss.clients.forEach((client) => client.send('reload'))

const wsScript = `
(function() {
  const ws = new WebSocket('ws://' + location.hostname + ':${wsPort}/')

  ws.addEventListener('message', (e) => {
    if (e.data === 'reload') location.reload()
  })
})()
`

// Build docisfy style and watch changes
chokidar.watch('**/*.scss', { cwd: __dirname }).on('all', debounce(build, 250))

// Watch change of docs directory
chokidar
  .watch('**/*', { cwd: path.resolve(__dirname, '../docs') })
  .on('all', debounce(reload, 250))

// Serve documentation
const port = process.env.PORT || 3000
const server = http.createServer((req, res) => {
  const { writeHead } = res
  const overriddenHeaders = { 'Cache-Control': 'no-store' }

  res.writeHead = function overriddenWriteHead(status, headers) {
    return writeHead.call(this, status, {
      ...(headers || {}),
      ...overriddenHeaders,
    })
  }

  const createReadStream = (absolutePath, opts) =>
    new Promise((resolve) => {
      const readStream = fs.createReadStream(absolutePath, opts)
      if (path.extname(absolutePath) !== '.html') {
        resolve(readStream)
      } else {
        let queue = Buffer.from([])

        readStream.pipe(
          new stream.Transform({
            transform: (chunk, _, callback) => {
              queue = Buffer.concat([queue, chunk])
              callback()
            },
            final(callback) {
              let html = queue.toString()
              const endBodyIdx = html.lastIndexOf('</body>')

              if (endBodyIdx >= 0) {
                html = `${html.slice(
                  0,
                  endBodyIdx,
                )}<script>${wsScript}</script></body>${html.slice(
                  endBodyIdx + 7,
                )}`
              }

              this.push(html)
              callback()

              overriddenHeaders['Content-Length'] = html.length.toString()
              resolve(this)
            },
          }),
        )
      }
    })

  return handler(
    req,
    res,
    {
      public: path.resolve(__dirname, '../docs'),
      rewrites: [{ source: '**', destination: '/index.html' }],
    },
    { createReadStream },
  )
})

server.listen(port, () =>
  console.log(
    `Listening Marpit documentation on http://127.0.0.1:${port}/ ...`,
  ),
)
