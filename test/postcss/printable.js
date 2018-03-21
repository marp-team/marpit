import assert from 'assert'
import postcss from 'postcss'
import printable from '../../src/postcss/printable'

describe('Marpit PostCSS printable plugin', () => {
  const run = (input, opts) =>
    postcss([printable(opts)]).process(input, { from: undefined })

  it('prepends style for printing', () => {
    const css = 'section.theme { background: #fff; }'
    const opts = { width: '640px', height: '480px' }

    return run(css, opts).then(result => {
      const rules = []
      result.root.walk(node => {
        if (
          node.type === 'atrule' ||
          (node.type === 'rule' && node.selector === 'section.theme')
        )
          rules.push(node)
      })

      assert(rules[0].type === 'atrule' && rules[0].name === 'page')
      assert(rules[1].type === 'atrule' && rules[1].name === 'media')
      assert(rules[2].type === 'rule' && rules[2].selector === 'section.theme')

      let sizeDecl
      result.root.walkDecls('size', rule => {
        sizeDecl = rule
      })

      assert(sizeDecl.value === '640px 480px')
    })
  })
})
