/** @module */
import Theme from '../theme'

const css = `
section {
  width: 1280px;
  height: 720px;

  box-sizing: border-box;
  overflow: hidden;

  scroll-snap-align: center center;
}

section[data-marpit-advanced-background] {
  background: transparent !important;
}

/* Normalization */
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}
`.trim()

/**
 * The scaffold theme. It includes these features:
 *
 * - Define the default slide size.
 * - Set default style for `<section>`.
 * - Normalize `<h1>` heading style.
 *
 * @alias module:theme/scaffold
 * @type {Theme}
 */
const scaffoldTheme = Theme.fromCSS(css, false)

export default scaffoldTheme
