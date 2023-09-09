/* eslint consistent-return: 0 */
/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

/**
 * @typedef {object} ImportMeta
 * @prop {AtRule} node The at-rule node parsed by PostCSS.
 * @prop {string} value The specified value.
 */

/**
 * Marpit PostCSS import parse plugin.
 *
 * Parse `@import` and `@import-theme` rules that specify a plain string.
 *
 * The `@import` rule for Marpit theme follows CSS spec. It must precede all
 * other statements. (excepted `@charset`)
 *
 * When you are using CSS preprocessors like Sass, `@import` would resolve path
 * in compiling and would be lost definition. So you can use `@import-theme`
 * rule alternatively.
 *
 * A specification of `@import-theme` has a bit different from `@import`. You
 * can place `@import-theme` rule at any in the CSS root, and the content of
 * imported theme will always append to the beginning of CSS.
 *
 * @function importParse
 */
export const importParse = postcssPlugin(
  'marpit-postcss-import-parse',
  () =>
    (css, { result }) => {
      const imports = { import: [], importTheme: [] }
      let allowImport = true

      css.walk((node) => {
        if (node.type === 'atrule') {
          const push = (target) => {
            const [quote] = node.params
            if (quote !== '"' && quote !== "'") return

            const splitedValue = node.params.slice(1).split(quote)
            let value = ''

            splitedValue.every((v) => {
              if (v.endsWith('\\')) {
                value = `${value}${v.slice(0, -1)}${quote}`
                return true
              }
              value = `${value}${v}`
              return false
            })

            node.marpitImportParse = value
            target.push({ node, value })
          }

          if (allowImport) {
            if (node.name === 'import') {
              push(imports.import)
            } else if (node.name !== 'charset') {
              allowImport = false
            }
          }

          if (node.name === 'import-theme' && node.parent.type === 'root') {
            push(imports.importTheme)
          }
        } else if (node.type !== 'comment') {
          allowImport = false
        }
      })

      result.marpitImport = [...imports.importTheme, ...imports.import]
    },
)

export default importParse
