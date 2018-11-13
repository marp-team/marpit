const chokidar = require('chokidar')
const { build } = require('./common')

const buildAsync = async (rejectable = false) => {
  try {
    return await build()
  } catch (e) {
    if (rejectable) throw e

    console.error(e)
    return undefined
  }
}

buildAsync(true)
  .then(({ stats }) => {
    const watch = paths => {
      const watcher = chokidar.watch(paths)

      watcher.on('change', () => {
        ;(async () => {
          const built = await buildAsync()

          if (built) {
            watcher.close()
            watch(built.stats.includedFiles)
          }
        })()
      })
    }

    watch(stats.includedFiles)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
