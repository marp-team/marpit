/** @module */
import cssesc from 'cssesc'
import postcssPlugin from '../helpers/postcss_plugin'

const reservedNames = [
  'none',
  'inherit',
  'initial',
  'revert',
  'revert-layer',
  'unset',
]

/**
 * Marpit PostCSS container query plugin.
 *
 * Add support of container queries for child elements of the `section` element.
 * (`@container` at-rule, and `cqw` `cqh` `cqi` `cqb` `cqmin` `cqmax` units)
 *
 * @function meta
 * @param {string|string[]} [containerName=undefined] Container name
 * @param {boolean} [escape=true] Set whether to escape container name
 */
export const containerQuery = postcssPlugin(
  'marpit-postcss-container-query',
  (containerName = undefined, escape = true) =>
    (css) => {
      const containerNames = (
        Array.isArray(containerName) ? containerName : [containerName]
      ).filter((name) => name && !reservedNames.includes(name))

      const containerNameDeclaration =
        containerNames.length > 0
          ? `\n  container-name: ${containerNames
              .map((name) =>
                escape
                  ? cssesc(name.toString(), { isIdentifier: true })
                  : name.toString(),
              )
              .join(' ')};`
          : ''

      css.first.before(
        `
:where(section) {
  container-type: size;${containerNameDeclaration}
}
`.trim(),
      )
    },
)

export default containerQuery
