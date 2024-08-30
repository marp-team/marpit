import postcss from 'postcss'
import parser from 'postcss-selector-parser'

const selectorProcessor = parser()

/**
 * @param {string} selector Selector string.
 */
export const selectorNormalizer = (selector) =>
  selectorProcessor.processSync(selector, { lossless: false })

const cssNormalizer = (css) => {
  const processor = postcss([
    {
      postcssPlugin: 'css-normalizer',
      Rule(rule) {
        rule.selectors = rule.selectors.map(selectorNormalizer)
      },
    },
  ])

  return processor.process(css, { from: undefined })
}

export const normalizeSelectorsInCss = (css) => cssNormalizer(css).css
