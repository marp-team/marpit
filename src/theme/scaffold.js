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

/* Normalization */
h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Advanced background support */
section[data-marpit-advanced-background="background"] {
  display: flex !important;
  flex-direction: row !important;
  margin: 0 !important;
  padding: 0 !important;
}

section[data-marpit-advanced-background="background"] > figure {
  background-position: center;
  background-repeat: no-repeat !important;
  background-size: cover;
  flex: auto !important;
  margin: 0 !important;
  min-height: 0 !important;
  min-width: 0 !important;
  padding: 0 !important;
}

section[data-marpit-advanced-background="content"] {
  background: transparent !important;
}
`.trim()

/**
 * The scaffold theme. It includes these features:
 *
 * - Define the default slide size.
 * - Set default style for `<section>`.
 * - Normalize `<h1>` heading style.
 * - Support advanced background on inline SVG mode.
 *
 * @alias module:theme/scaffold
 * @type {Theme}
 */
const scaffoldTheme = Theme.fromCSS(css, false)

export default scaffoldTheme
