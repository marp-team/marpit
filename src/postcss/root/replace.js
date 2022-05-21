/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

/**
 * Marpit PostCSS root replace plugin.
 *
 * Replace `:root` pseudo-class selector into `section`. It can add custom
 * pseudo class through `pseudoClass` option to make distinguishable from
 * `section` selector.
 *
 * @alias module:postcss/root/replace
 */
const plugin = postcssPlugin(
  'marpit-postcss-root-replace',
  ({ pseudoClass } = {}) =>
    (css) =>
      css.walkRules((rule) => {
        // Replace `:root` pseudo-class selectors into `section`
        rule.selectors = rule.selectors.map((selector) =>
          selector.replace(
            /(^|[\s>+~(])(?:section)?:root\b/g,
            (_, s) => `${s}section${pseudoClass || ''}`
          )
        )
      })
)

export default plugin
