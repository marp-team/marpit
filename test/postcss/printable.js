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

      expect(rules).toStrictEqual([
        expect.objectContaining({ type: 'atrule', name: 'page' }),
        expect.objectContaining({ type: 'atrule', name: 'media' }),
        expect.objectContaining({ type: 'rule', selector: 'section.theme' }),
      ])

      let sizeDecl
      result.root.walkDecls('size', rule => {
        sizeDecl = rule
      })

      expect(sizeDecl.value).toBe('640px 480px')
    })
  })
})
