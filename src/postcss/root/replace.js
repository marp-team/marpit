/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS root replace plugin.
 *
 * Replace `:root` pseudo-class selector into `section`.
 *
 * @alias module:postcss/root/replace
 */
const plugin = postcss.plugin('marpit-postcss-root-replace', () => (css) =>
  css.walkRules((rule) => {
    // Replace `:root` pseudo-class selectors into `section`
    rule.selectors = rule.selectors.map((selector) =>
      selector.replace(
        /(^|[\s>+~(])(?:section)?:root\b/g,
        (_, s) => `${s}section`
      )
    )
  })
)

export default plugin
