const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const fs = require('fs')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const path = require('path')
const sass = require('node-sass')

const from = path.join(__dirname, './docsify.scss')
const to = path.join(__dirname, '../docs/style/docsify.css')

sass.render(
  { file: from, outFile: to, sourceMap: true, sourceMapEmbed: true },
  (err, { css }) => {
    if (err) throw err

    postcss([
      autoprefixer,
      cssnano({ preset: ['default', { mergeLonghand: false }] }),
    ])
      .process(css, { from, to, map: { annotation: false, inline: false } })
      .then(ret => {
        mkdirp.sync(path.dirname(to))
        fs.writeFileSync(to, ret.css)
      })
  }
)
