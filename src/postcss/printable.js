/** @module */
import postcss from 'postcss'

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
const plugin = postcss.plugin('marpit-postcss-printable', opts => css =>
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
  }

  section, section * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  :marpit-container > svg {
    display: block;
    height: 100vh;
    page-break-before: always;
    width: 100vw;
  }
}
`.trim()
  )
)

export default plugin
