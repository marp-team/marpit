/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS printable plugin.
 *
 * Make printable slide deck as PDF.
 *
 * @param {Object} [opts]
 * @param {string} opts.width
 * @param {string} opts.height
 * @alias module:postcss/printable
 */
const plugin = postcss.plugin('marpit-postcss-printable', (opts = {}) => css =>
  css.first.before(
    `
@page {
  size: ${opts.width} ${opts.height};
  margin: 0;
}

@media print {
  html, body {
    margin: 0;
    page-break-inside: avoid;
  }

  section {
    page-break-before: always;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  :marpit-container > svg {
    display: block;
    width: 100vw;
    height: 100vh;
  }
}
`.trim()
  )
)

export default plugin
