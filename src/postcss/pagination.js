/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

/**
 * Marpit PostCSS pagination plugin.
 *
 * Marpit uses `section::after` to show the pagination on each slide. It defines
 * in the scaffold theme.
 *
 * This plugin will comment out a `content` declaration defined in any
 * `section::after` of the root, to prevent override the defined attribute for
 * paginating.
 *
 * @function pagination
 */
export const pagination = postcssPlugin(
  'marpit-postcss-pagination',
  () => (css) => {
    css.walkRules((rule) => {
      if (
        rule.selectors.some((selector) =>
          /^section(?![\w-])[^\s>+~]*::?after$/.test(
            selector.replace(/\[.*?\]/g, '')
          )
        )
      )
        rule.walkDecls('content', (decl) => {
          if (!decl.value.includes('attr(data-marpit-pagination)'))
            decl.replaceWith(`${decl.raw('before')}/* ${decl.toString()}; */`)
        })
    })
  }
)

export default pagination
