/** @module */
import postcss from 'postcss'

/**
 * Marpit PostCSS import rollup plugin.
 *
 * Rollup `@charset` and `@import` at-rule to the beginning of CSS. Marpit is
 * manipulating CSS with many PostCSS plugins, so sometimes a few at-rules
 * cannot keep specification.
 *
 * This plugin takes care of rolling up invalid at-rules.
 *
 * @alias module:postcss/import/rollup
 */
const plugin = postcss.plugin('marpit-postcss-import-rollup', () => css => {
  const rolluped = {
    charset: undefined,
    imports: [],
  }

  css.walkAtRules(rule => {
    if (rule.name === 'charset') {
      rule.remove()
      if (!rolluped.charset) rolluped.charset = rule
    } else if (rule.name === 'import') {
      rolluped.imports.push(rule.remove())
    }
  })

  const { first } = css

  // Rollup at-rules
  ;[rolluped.charset, ...rolluped.imports]
    .filter(r => r)
    .forEach((rule, idx) => {
      // Strip whitespace from the beginning of first at-rule
      const prependRule =
        idx === 0 ? rule.clone({ raws: { before: undefined } }) : rule

      first.before(prependRule)
    })
})

export default plugin
