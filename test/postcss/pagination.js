import assert from 'assert'
import dedent from 'dedent'
import postcss from 'postcss'
import pagination from '../../src/postcss/pagination'

describe('Marpit PostCSS pagination plugin', () => {
  const run = input =>
    postcss([pagination()]).process(input, { from: undefined })

  it('appends changes the order of section::after rule', () =>
    run(dedent`
      section::after { background: red; }
      body { background: white; }
    `).then(({ root }) => {
      assert(root.nodes.length === 3)
      assert(root.nodes[0].selector === 'body')
      assert(root.nodes[2].selector === 'section::after')
    }))
})
