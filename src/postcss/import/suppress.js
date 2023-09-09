/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'
import postcssImportParse from './parse'

/**
 * Marpit PostCSS import suppress plugin.
 *
 * Comment out `@import` / `@import-theme` rules that have imported theme.
 *
 * This plugin is useful to prevent the inline style's rolled-up theme import by
 * unexpected order.
 *
 * @function importSuppress
 * @param {ThemeSet} themeSet ThemeSet instance.
 */
export const importSuppress = postcssPlugin(
  'marpit-postcss-import-suppress',
  (themeSet) => ({
    plugins: [
      postcssImportParse(),
      postcssPlugin('marpit-postcss-import-suppress', () => (css) => {
        css.walk((node) => {
          if (node.marpitImportParse && themeSet.has(node.marpitImportParse))
            node.replaceWith(`${node.raw('before')}/* ${node.toString()}; */`)
        })
      })(),
    ],
  }),
)

export default importSuppress
