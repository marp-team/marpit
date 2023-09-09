/** @module */
import postcssPlugin from '../../helpers/postcss_plugin'

export const rootFontSizeCustomProp = '--marpit-root-font-size'

/**
 * Marpit PostCSS root font size plugin.
 *
 * Inject CSS variable based on the root slide container `section` for correct
 * calculation of `rem` unit in the context of Marpit.
 *
 * @function rootFontSize
 */
export const rootFontSize = postcssPlugin(
  'marpit-postcss-root-font-size',
  () => (css, postcss) =>
    css.walkRules((rule) => {
      const injectSelector = new Set()

      for (const selector of rule.selectors) {
        // Detect whether the selector is targeted to section
        const parentSelectors = selector.split(/(\s+|\s*[>~+]\s*)/)
        const targetSelector = parentSelectors.pop()
        const delimiterMatched = targetSelector.match(/[.:#[]/)
        const target = delimiterMatched
          ? targetSelector.slice(0, delimiterMatched.index)
          : targetSelector

        if (target === 'section' || target.endsWith('*') || target === '') {
          // Generate selector for injection
          injectSelector.add(
            [
              ...parentSelectors,
              target === 'section'
                ? 'section'
                : ':marpit-container > :marpit-slide section', // Universal selector is targeted to the children `section` of root `section`
              delimiterMatched
                ? targetSelector.slice(delimiterMatched.index)
                : '',
            ].join(''),
          )
        }
      }

      if (injectSelector.size === 0) return

      // Inject CSS variable
      const injectRule = postcss.rule({
        selectors: [...injectSelector.values()],
      })

      rule.walkDecls('font-size', (decl) => {
        injectRule.append(decl.clone({ prop: rootFontSizeCustomProp }))
      })

      if (injectRule.nodes.length > 0) rule.parent.insertAfter(rule, injectRule)
    }),
)

export default rootFontSize
