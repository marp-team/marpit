/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

/**
 * Marpit PostCSS advanced background plugin.
 *
 * Append style to support the advanced background.
 *
 * @function advancedBackground
 */
export const advancedBackground = postcssPlugin(
  'marpit-postcss-advanced-background',
  () => (css) => {
    css.last.after(
      `
section[data-marpit-advanced-background="background"] {
  columns: initial !important;
  display: block !important;
  padding: 0 !important;
}

section[data-marpit-advanced-background="background"]::before,
section[data-marpit-advanced-background="background"]::after,
section[data-marpit-advanced-background="content"]::before,
section[data-marpit-advanced-background="content"]::after {
  display: none !important;
}

section[data-marpit-advanced-background="background"] > div[data-marpit-advanced-background-container] {
  all: initial;
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow: hidden;
  width: 100%;
}

section[data-marpit-advanced-background="background"] > div[data-marpit-advanced-background-container][data-marpit-advanced-background-direction="vertical"] {
  flex-direction: column;
}

section[data-marpit-advanced-background="background"][data-marpit-advanced-background-split] > div[data-marpit-advanced-background-container] {
  width: var(--marpit-advanced-background-split, 50%);
}

section[data-marpit-advanced-background="background"][data-marpit-advanced-background-split="right"] > div[data-marpit-advanced-background-container] {
  margin-left: calc(100% - var(--marpit-advanced-background-split, 50%));
}

section[data-marpit-advanced-background="background"] > div[data-marpit-advanced-background-container] > figure {
  all: initial;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  flex: auto;
  margin: 0;
}

section[data-marpit-advanced-background="background"] > div[data-marpit-advanced-background-container] > figure > figcaption {
	position: absolute;
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  white-space: nowrap;
  width: 1px;
}

section[data-marpit-advanced-background="content"],
section[data-marpit-advanced-background="pseudo"] {
  background: transparent !important;
}

section[data-marpit-advanced-background="pseudo"],
:marpit-container > svg[data-marpit-svg] > foreignObject[data-marpit-advanced-background="pseudo"] {
  pointer-events: none !important;
}

section[data-marpit-advanced-background-split] {
  width: 100%;
  height: 100%;
}
`.trim(),
    )
  },
)

export default advancedBackground
