/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

export const pseudoClass = ':marpit-root'

const matcher = new RegExp(`\\b${pseudoClass}\\b`, 'g')

/**
 * Marpit PostCSS root increasing specificity plugin.
 *
 * Replace `:marpit-root` pseudo-class selector into `:not(a)`, to increase
 * specificity. `:marpit-root` is always added to `section` selector so
 * `:not(a)` must always match too.
 *
 * @alias module:postcss/root/increasing_specificity
 */
const plugin = postcssPlugin(
  'marpit-postcss-root-increasing-specificity',
  () => (css) =>
    css.walkRules((rule) => {
      rule.selectors = rule.selectors.map((selector) =>
        selector.replace(matcher, ':not(a)')
      )
    })
)

export default plugin
