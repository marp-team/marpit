/** @module */
import postcss from 'postcss'

export const rootFontSizeCustomProp = '--marpit-root-font-size'

/**
 * Marpit PostCSS root replace plugin.
 *
 * Replace `:root` pseudo-class selector into `section`, and inject CSS variable
 * for correct calculation of rem unit in `font-size` declaration.
 *
 * @alias module:postcss/root/replace
 */
const plugin = postcss.plugin('marpit-postcss-root-replace', () => (css) =>
  css.walkRules((rule) => {
    const injectSelector = new Set()

    rule.selectors = rule.selectors.map((selector) => {
      // Replace `:root` pseudo-class selectors into `section`
      const replaced = selector.replace(
        /(^|[\s>+~(])(?:section)?:root\b/g,
        (_, s) => `${s}section`
      )

      // Detect whether the selector is targeted to section
      const parentSelectors = replaced.split(/(\s+|\s*[>~+]\s*)/)
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
          ].join('')
        )
      }

      return replaced
    })

    if (injectSelector.size === 0) return

    // Inject CSS variable
    const injectRule = postcss.rule({ selectors: [...injectSelector.values()] })

    rule.walkDecls('font-size', (decl) => {
      injectRule.append(decl.clone({ prop: rootFontSizeCustomProp }))
    })

    if (injectRule.nodes.length > 0) rule.parent.insertAfter(rule, injectRule)
  })
)

export default plugin
