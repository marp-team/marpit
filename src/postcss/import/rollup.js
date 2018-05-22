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
  // TODO: Implement rollup plugin
})

export default plugin
