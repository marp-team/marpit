/** @module */
import postcss from 'postcss'

const marpitPrintContainerStyle = `
html, body {
  background-color: #fff;
  margin: 0;
  page-break-inside: avoid;
}
`.trim()

/**
 * Marpit PostCSS printable plugin.
 *
 * Make printable slide deck as PDF.
 *
 * @param {Object} opts
 * @param {string} opts.width
 * @param {string} opts.height
 * @alias module:postcss/printable
 */
const plugin = postcss.plugin('marpit-postcss-printable', opts => css => {
  css.walkAtRules('media', rule => {
    if (rule.params === 'marpit-print') rule.remove()
  })

  css.first.before(
    `
@page {
  size: ${opts.width} ${opts.height};
  margin: 0;
}

@media marpit-print {
  section {
    page-break-before: always;
  }

  section, section * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  :marpit-container > svg[data-marpit-svg] {
    display: block;
    height: 100vh;
    width: 100vw;
  }
}
`.trim()
  )
})

/**
 * The post-process PostCSS plugin of Marpit printable plugin.
 *
 * @alias module:postcss/printable.postprocess
 */
export const postprocess = postcss.plugin(
  'marpit-postcss-printable-postprocess',
  () => css =>
    css.walkAtRules('media', rule => {
      if (rule.params !== 'marpit-print') return

      rule.params = 'print'
      rule.first.before(marpitPrintContainerStyle)
    })
)

export default plugin
