/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

/**
 * Marpit PostCSS import hoisting plugin.
 *
 * Hoist `@charset` and `@import` at-rule to the beginning of CSS. Marpit is
 * manipulating CSS with many PostCSS plugins, so sometimes a few at-rules
 * cannot keep specification.
 *
 * This plugin takes care of hoisting for invalid at-rules.
 *
 * @function importHoisting
 */
export const importHoisting = postcssPlugin(
  'marpit-postcss-import-hoisting',
  () => (css) => {
    const hoisted = {
      charset: undefined,
      imports: [],
    }

    css.walkAtRules((rule) => {
      if (rule.name === 'charset') {
        rule.remove()
        if (!hoisted.charset) hoisted.charset = rule
      } else if (rule.name === 'import') {
        hoisted.imports.push(rule.remove())
      }
    })

    const { first } = css

    // Hoist at-rules
    ;[hoisted.charset, ...hoisted.imports]
      .filter((r) => r)
      .forEach((rule, idx) => {
        // Strip whitespace from the beginning of first at-rule
        const prependRule =
          idx === 0 ? rule.clone({ raws: { before: undefined } }) : rule

        first.before(prependRule)
      })
  },
)

export default importHoisting
