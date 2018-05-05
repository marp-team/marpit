/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS advanced background plugin.
 *
 * Append style to suport the advanced background.
 *
 * @alias module:postcss/advanced_background
 */
const plugin = postcss.plugin(
  'marpit-postcss-advanced-background',
  () => css => {
    css.last.after(
      `
section[data-marpit-advanced-background="background"] {
  padding: 0 !important;
}

section[data-marpit-advanced-background="background"] > div[data-marpit-advanced-background-container] {
  all: initial;
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  width: 100%;
}

section[data-marpit-advanced-background="background"][data-marpit-advanced-background-split] > div[data-marpit-advanced-background-container] {
  width: 50%;
}

section[data-marpit-advanced-background="background"][data-marpit-advanced-background-split="right"] > div[data-marpit-advanced-background-container] {
  margin-left: 50%;
}

section[data-marpit-advanced-background="background"] > div[data-marpit-advanced-background-container] > figure {
  all: initial;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  flex: auto;
}

section[data-marpit-advanced-background="content"] {
  background: transparent !important;
}

section[data-marpit-advanced-background-split] {
  width: 100%;
  height: 100%;
}
`.trim()
    )
  }
)

export default plugin
