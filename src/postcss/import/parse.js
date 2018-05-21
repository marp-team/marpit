/* eslint consistent-return: 0 */
/** @module */
import postcss from 'postcss'

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
 * @alias module:postcss/import/parse
 */
const plugin = postcss.plugin(
  'marpit-postcss-import-parse',
  () => (css, ret) => {
    ret.marpitImport = ret.marpitImport || []

    css.walk(node => {
      if (node.type === 'atrule') {
        if (node.name === 'import' || node.name === 'import-theme') {
          const [quote] = node.params
          if (quote !== '"' && quote !== "'") return

          const splitedValue = node.params.slice(1).split(quote)
          let value = ''

          splitedValue.every(v => {
            if (v.endsWith('\\')) {
              value = `${value}${v.slice(0, -1)}${quote}`
              return true
            }
            value = `${value}${v}`
            return false
          })

          node.marpitImportParse = value
          ret.marpitImport.push({ node, value })
        } else if (node.name !== 'charset') {
          return false
        }
      } else if (node.type !== 'comment') {
        return false
      }
    })
  }
)

export default plugin
