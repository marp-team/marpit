const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcss = require('postcss')
const sass = require('sass')

const from = path.join(__dirname, './docsify.scss')
const to = path.join(__dirname, '../docs/style/docsify.css')

;(async () => {
  const { css: cssBuf } = await promisify(sass.render)({
    file: from,
    outFile: to,
    sourceMap: true,
    sourceMapEmbed: true,
  })

  const { css } = await postcss([
    autoprefixer,
    cssnano({ preset: ['default', { mergeLonghand: false }] }),
  ]).process(cssBuf, { from, to, map: { annotation: false, inline: false } })

  await promisify(fs.mkdir)(path.dirname(to), { recursive: true })
  await promisify(fs.writeFile)(to, css)
})()
