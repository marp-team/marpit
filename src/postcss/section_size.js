/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS section size plugin.
 *
 * Parse width and height declartaion on section selector.
 *
 * @alias module:postcss/section_size
 */
const plugin = postcss.plugin(
  'marpit-postcss-section-size',
  () => (css, ret) => {
    ret.marpitSectionSize = ret.marpitSectionSize || {}

    css.walkRules((rule) => {
      if (rule.selectors.includes('section')) {
        rule.walkDecls(/^(width|height)$/, (decl) => {
          const { prop } = decl
          const value = decl.value.trim()

          ret.marpitSectionSize[prop] = value
        })
      }
    })
  }
)

export default plugin
