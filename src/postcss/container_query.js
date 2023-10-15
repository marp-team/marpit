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

const marpitContainerQueryPseudoMatcher = /\bsection:marpit-container-query\b/g

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

      const style = `
section:marpit-container-query {
  container-type: size;${containerNameDeclaration}
}
`.trim()

      if (css.first) {
        css.first.before(style)
      } else {
        css.append(style)
      }
    },
)

export const postprocess = postcssPlugin(
  'marpit-postcss-container-query-postprocess',
  () => (css) =>
    css.walkRules(marpitContainerQueryPseudoMatcher, (rule) => {
      rule.selectors = rule.selectors.map((selector) =>
        selector.replace(marpitContainerQueryPseudoMatcher, ':where(section)'),
      )
    }),
)

export default containerQuery
