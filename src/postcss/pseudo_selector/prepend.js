/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

/**
 * Marpit PostCSS pseudo selector prepending plugin.
 *
 * Prepend `:marpit-container > :marpit-slide` pseudo selector to each selector
 * of Marpit theme CSS for modulized styling.
 *
 * @function pseudoSelectorPrepend
 */
export const pseudoSelectorPrepend = postcssPlugin(
  'marpit-postcss-pseudo-selector-prepend',
  () => (css) =>
    css.walkRules((rule) => {
      const { type, name } = rule.parent || {}
      if (type === 'atrule' && name === 'keyframes') return

      rule.selectors = rule.selectors.map((selector) => {
        if (/^section(?![\w-])/.test(selector))
          return `:marpit-container > :marpit-slide${selector.slice(7)}`

        if (selector.startsWith(':marpit-container')) return selector

        return `:marpit-container > :marpit-slide ${selector}`
      })
    })
)

export default pseudoSelectorPrepend
