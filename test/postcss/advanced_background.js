import postcss from 'postcss'
import { advancedBackground } from '../../src/postcss/advanced_background'

describe('Marpit PostCSS advanced background plugin', () => {
  const run = (input) =>
    postcss([advancedBackground()]).process(input, { from: undefined })

  const baseCss = 'body { background: #fff; }'

  it('appends style to suport the advanced background', () =>
    run(baseCss).then(({ root }) => {
      expect(root.nodes[0].selector).toBe('body')

      root.nodes.slice(1).forEach((node) => {
        node.selectors.forEach((selector) => {
          expect(selector).toContain('data-marpit-advanced-background')
        })
      })
    }))
})
