/** @module */
import Theme from '../theme'

const emojiFonts = [
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Noto Color Emoji',
  'Segoe UI Symbol',
  'Android Emoji',
  'Twitter Color Emoji',
  'EmojiOne Color',
  'Symbola',
  'EmojiSymbols',
]

const css = `
section {
  width: 1280px;
  height: 720px;

  box-sizing: border-box;
  overflow: hidden;
  position: relative;

  scroll-snap-align: center center;
}

section::after {
  bottom: 0;
  content: attr(data-marpit-pagination);
  padding: inherit;
  pointer-events: none;
  position: absolute;
  right: 0;
}

[data-marpit-emoji] {
  font-family: ${emojiFonts.map(f => `'${f}'`).join(',')};
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
 * - Set unicode emoji style for using system emoji fonts.
 * - Normalize `<h1>` heading style.
 *
 * @alias module:theme/scaffold
 * @type {Theme}
 */
const scaffoldTheme = Theme.fromCSS(css, false)

export default scaffoldTheme
