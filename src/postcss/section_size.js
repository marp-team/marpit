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
  ({ preferedPseudoClass } = {}) => {
    const rootSectionMatcher = new RegExp(
      `^section${preferedPseudoClass ? `(${preferedPseudoClass})?` : ''}$`
    )

    return (css, { result }) => {
      const originalSize = result.marpitSectionSize || {}
      const detectedSize = {}
      const preferedSize = {}

      let matched

      css.walkRules((rule) => {
        if (
          rule.selectors.some((s) => {
            matched = s.match(rootSectionMatcher)
            return !!matched
          })
        ) {
          rule.walkDecls(/^(width|height)$/, (decl) => {
            const { prop } = decl
            const value = decl.value.trim()

            if (matched[1]) {
              preferedSize[prop] = value
            } else {
              detectedSize[prop] = value
            }
          })
        }
      })

      const width =
        preferedSize.width || detectedSize.width || originalSize.width

      const height =
        preferedSize.height || detectedSize.height || originalSize.height

      result.marpitSectionSize = { ...originalSize }

      if (width) result.marpitSectionSize.width = width
      if (height) result.marpitSectionSize.height = height
    }
  }
)

export default plugin
