/** @module */
import postcss from 'postcss'
import postcssImportParse from './parse'

/**
 * Marpit PostCSS import suppress plugin.
 *
 * Comment out `@import` / `@import-theme` rules that have imported theme.
 *
 * This plugin is useful to prevent the inline style's rolled-up theme import by
 * unexpected order.
 *
 * @alias module:postcss/import/suppress
 * @param {ThemeSet} themeSet ThemeSet instance.
 */
const plugin = postcss.plugin('marpit-postcss-import-suppress', (themeSet) =>
  postcss([
    postcssImportParse,
    (css) => {
      css.walk((node) => {
        if (node.marpitImportParse && themeSet.has(node.marpitImportParse))
          node.replaceWith(`${node.raw('before')}/* ${node.toString()}; */`)
      })
    },
  ])
)

export default plugin
