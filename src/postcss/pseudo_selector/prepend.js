/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS pseudo selector prepending plugin.
 *
 * Prepend `:marpit-container > :marpit-slide` pseudo selector to each selector
 * of Marpit theme CSS for modulized styling.
 *
 * @alias module:postcss/pseudo_selector/prepend
 */
const plugin = postcss.plugin(
  'marpit-postcss-pseudo-selector-prepend',
  () => css =>
    css.walkRules(rule => {
      rule.selectors = rule.selectors.map(selector => {
        if (/^section(?![\w-])/.test(selector)) {
          return `:marpit-container > :marpit-slide${selector.slice(7)}`
        } else if (/^(:marpit-container|html|body)(?![\w-])/.test(selector)) {
          return selector
        }
        return `:marpit-container > :marpit-slide ${selector}`
      })
    })
)

export default plugin
