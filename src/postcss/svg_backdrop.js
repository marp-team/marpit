/** @module */
import postcssPlugin from '../helpers/postcss_plugin'

const backdropMatcher = /(?:\b|^)::backdrop$/

/**
 * Marpit PostCSS SVG backdrop plugin.
 *
 * Retarget `::backdrop` and `section::backdrop` selector to
 * `@media screen { :marpit-container > svg[data-marpit-svg] { .. } }`. It means
 * `::backdrop` targets the SVG container in inline SVG mode.
 *
 * It's useful for setting style of the letterbox and pillarbox in the SVG
 * scaled slide.
 *
 * ```css
 * ::backdrop {
 *   background-color: #448;
 * }
 * ```
 *
 * The original definition will remain to support an original usage of
 * `::backdrop`.
 *
 * The important differences from an original `::backdrop` are following:
 *
 * - In original spec, `::backdrop` creates a separated layer from the target
 *   element, but Marpit's `::backdrop` does not. The slide elements still
 *   become the child of `::backdrop` so setting some properties that are
 *   inherited may make broken slide rendering.
 * - Even if the browser is not fullscreen, `::backdrop` will match to SVG
 *   container whenever matched to `@media screen` media query.
 *
 * If concerned to conflict with the style provided by the app, consider to
 * disable the selector support by `inlineSVG: { backdropSelector: false }`.
 *
 * @see https://developer.mozilla.org/docs/Web/CSS/::backdrop
 * @function svgBackdrop
 */
export const svgBackdrop = postcssPlugin(
  'marpit-postcss-svg-backdrop',
  () => (css, postcss) => {
    css.walkRules((rule) => {
      const injectSelectors = new Set()

      for (const selector of rule.selectors) {
        // Detect pseudo-element (must appear after the simple selectors)
        if (!selector.match(backdropMatcher)) continue

        // Detect whether the selector is targeted to section
        const delimiterMatched = selector.match(/[.:#[]/) // must match
        const target = selector.slice(0, delimiterMatched.index)

        if (target === 'section' || target === '') {
          const delimiter = selector.slice(delimiterMatched.index, -10)
          injectSelectors.add(
            `:marpit-container > svg[data-marpit-svg]${delimiter}`,
          )
        }
      }

      if (injectSelectors.size > 0 && rule.nodes.length > 0) {
        rule.parent.insertAfter(
          rule,
          postcss.atRule({
            name: 'media',
            params: 'screen',
            nodes: [
              postcss.rule({
                selectors: [...injectSelectors.values()],
                nodes: rule.nodes,
              }),
            ],
          }),
        )
      }
    })
  },
)

export default svgBackdrop
