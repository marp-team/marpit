/** @module */
import postcss from 'postcss'
import postcssImportParse from './parse'

/**
 * Marpit PostCSS import replace plugin.
 *
 * Replace parsed `@import` / `@import-theme` rules.
 *
 * Please see {@link module:postcss/import/parse} about the specification of
 * each syntax.
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
        const prepends = []

        css.walk(node => {
          const name = node.marpitImportParse

          if (name) {
            const theme = themeSet.get(name)

            if (theme) {
              if (importedThemes.includes(name))
                throw new Error(`Circular "${name}" theme import is detected.`)

              const processed = postcss([
                plugin(themeSet, [...importedThemes, name]),
              ]).process(theme.css)

              if (node.name === 'import') {
                node.replaceWith(processed.root || '')
              } else if (node.name === 'import-theme') {
                node.remove()
                prepends.push(processed.root)
              }
            }
          }
        })

        if (prepends.length > 0)
          [...prepends].reverse().forEach(root => css.first.before(root))
      },
    ])
)

export default plugin
