/** @module */
import postcss from 'postcss'

export const pseudoClass = ':marpit-root'

/**
 * Marpit PostCSS root increasing specificity plugin.
 *
 * Replace `:marpit-root` pseudo-class selector into `:not(\9)`, to increase
 * specificity.
 *
 * @alias module:postcss/root/increasing_specificity
 */
const plugin = postcss.plugin(
  'marpit-postcss-root-increasing-specificity',
  () => {
    const matcher = new RegExp(`\\b${pseudoClass}\\b`, 'g')

    return (css) =>
      css.walkRules((rule) => {
        rule.selectors = rule.selectors.map((selector) =>
          selector.replace(matcher, ':not(\\9)')
        )
      })
  }
)

export default plugin
