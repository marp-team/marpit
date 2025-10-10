/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

/**
 * Marpit PostCSS after plugin.
 *
 * Append specific style after current style.
 *
 * @function after
 */
export const after = postcssPlugin(
  'marpit-pack-after',
  (afterStyle) => (css) => css.last.after(afterStyle),
)

export default after
