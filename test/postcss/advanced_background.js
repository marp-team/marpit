import assert from 'assert'
import postcss from 'postcss'
import advancedBackground from '../../src/postcss/advanced_background'

describe('Marpit PostCSS advanced background plugin', () => {
  const run = input =>
    postcss([advancedBackground()]).process(input, { from: undefined })

  const baseCss = 'body { background: #fff; }'

  it('appends style to suport the advanced background', () =>
    run(baseCss).then(({ root }) => {
      assert(root.nodes[0].selector === 'body')

      root.nodes.slice(1).forEach(node => {
        node.selectors.forEach(selector => {
          assert(selector.includes('data-marpit-advanced-background'))
        })
      })
    }))
})
