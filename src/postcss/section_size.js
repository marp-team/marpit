/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

/**
 * Marpit PostCSS section size plugin.
 *
 * Parse width and height declartaion on `section` selector.
 *
 * @alias module:postcss/section_size
 */
const plugin = postcssPlugin(
  'marpit-postcss-section-size',
  ({ pseudoClass } = {}) => {
    const rootSectionMatcher = new RegExp(
      `^(?:section|\\*?:root)${pseudoClass ? `(?:${pseudoClass})?` : ''}$`
    )

    return (css, { result }) => {
      result.marpitSectionSize = result.marpitSectionSize || {}

      css.walkRules((rule) => {
        if (rule.selectors.some((s) => rootSectionMatcher.test(s))) {
          rule.walkDecls(/^(width|height)$/, (decl) => {
            const { prop } = decl
            const value = decl.value.trim()

            result.marpitSectionSize[prop] = value
          })
        }
      })
    }
  }
)

export default plugin
