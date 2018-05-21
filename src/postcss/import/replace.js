/** @module */
import postcss from 'postcss'
import postcssImportParse from './parse'

/**
 * Marpit PostCSS import replace plugin.
 *
 * Replace parsed `@import` / `@import-theme` rules.
 *
 * @alias module:postcss/import/replace
 * @param {ThemeSet} themeSet ThemeSet instance.
 */
const plugin = postcss.plugin(
  'marpit-postcss-import-replace',
  (themeSet, importedThemes = []) =>
    postcss([
      postcssImportParse,
      css => {
        css.walk(node => {
          const name = node.marpitImportParse

          if (name) {
            const theme = themeSet.get(name)

            if (theme) {
              if (importedThemes.includes(name))
                throw new Error(`Circular "${name}" theme import is detected.`)

              node.replaceWith(
                postcss([plugin(themeSet, [...importedThemes, name])]).process(
                  theme.css
                ).root || ''
              )
            }
          }
        })
      },
    ])
)

export default plugin
