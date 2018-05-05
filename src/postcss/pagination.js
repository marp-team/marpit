/** @module */
import postcss from 'postcss'

const paginateStyle = postcss.parse(
  `
section::after {
  bottom: 0;
  content: attr(data-marpit-pagination);
  padding: inherit;
  pointer-events: none;
  position: absolute;
  right: 0;
}
`.trim()
)

/**
 * Marpit PostCSS pagination plugin.
 *
 * Append style to paginate each section by using `::after` pseudo selector.
 *
 * @alias module:postcss/pagination
 */
const plugin = postcss.plugin('marpit-postcss-pagination', () => css => {
  const sectionAfters = [paginateStyle.clone()]

  css.walkRules(rule => {
    const sectionAfterSelectors = []
    const filtered = rule.selectors.filter(selector => {
      const isSectionAfter = /^section(?![\w-])[^\s>+~]*::?after$/.test(
        selector.replace(/\[.*?\]/g, '')
      )

      if (isSectionAfter) sectionAfterSelectors.push(selector)
      return !isSectionAfter
    })

    if (sectionAfterSelectors.length > 0) {
      let newRule = rule.clone({ selectors: sectionAfterSelectors })
      let targetRule = rule

      while (targetRule.parent) {
        targetRule = targetRule.parent

        if (
          targetRule.type === 'atrule' &&
          !targetRule.name.endsWith('keyframes')
        )
          newRule = targetRule.clone({ nodes: [newRule] })
      }

      sectionAfters.push(newRule)
    }

    if (filtered.length === 0) {
      rule.remove()
    } else {
      rule.selectors = filtered
    }
  })

  sectionAfters.forEach(rule => css.last.after(rule))
})

export default plugin
