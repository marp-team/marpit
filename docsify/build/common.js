const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const fs = require('fs')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const path = require('path')
const sass = require('node-sass')

const plugins = [
  autoprefixer,
  cssnano({ preset: ['default', { mergeLonghand: false }] }),
]

const from = path.join(__dirname, '../docsify.scss')
const to = path.join(__dirname, '../../docs/style/docsify.css')

module.exports = {
  from,
  to,
  build: () =>
    new Promise((resolve, reject) =>
      sass.render(
        { file: from, outFile: to, sourceMap: true, sourceMapEmbed: true },
        (err, sassResult) =>
          err
            ? reject(new Error(err.message))
            : postcss(plugins)
                .process(sassResult.css, {
                  from,
                  to,
                  map: { annotation: false, inline: false },
                })
                .then(ret => {
                  mkdirp(
                    path.dirname(to),
                    mkdirpErr =>
                      mkdirpErr
                        ? reject(mkdirpErr)
                        : fs.writeFile(
                            to,
                            ret.css,
                            e => (e ? reject(e) : resolve(sassResult))
                          )
                  )
                })
                .catch(e => reject(e))
      )
    ),
}
