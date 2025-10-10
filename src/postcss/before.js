/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

/**
 * Marpit PostCSS before plugin.
 *
 * Prepend specific style into before current style.
 *
 * @function before
 */
export const before = postcssPlugin(
  'marpit-pack-before',
  (beforeStyle) => (css) => css.first.before(beforeStyle),
)

export default before
