/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

export const pseudoClass = ':marpit-root'

const matcher = new RegExp(`\\b${pseudoClass}\\b`, 'g')

/**
 * Marpit PostCSS root increasing specificity plugin.
 *
 * Replace specific pseudo-class selector to `:where(section):not([\20 root])`,
 * to increase specificity. `:marpit-root` is always added to `section` selector
 * by root replace plugin so `:where(section):not([\20 root])` must always match
 * too (HTML does not allow U+0020 SPACE in the attribute name.).
 *
 * @alias module:postcss/root/increasing_specificity
 */
const plugin = postcssPlugin(
  'marpit-postcss-root-increasing-specificity',
  () => (css) =>
    css.walkRules((rule) => {
      rule.selectors = rule.selectors.map((selector) =>
        selector.replace(matcher, ':where(section):not([\\20 root])')
      )
    })
)

export default plugin
