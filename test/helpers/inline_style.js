import InlineStyle from '../../src/helpers/inline_style'

describe('InlineStyle helper class', () => {
  it('sanitizes unexpected declarations', () => {
    const instance = new InlineStyle()

    instance
      .set('color', 'red')
      .set('background', 'url(";");padding:1px')
      .set('margin', '0; b { font-size: 3em;')
      .set('overflow', 'hidden')
      .delete('color')

    expect(instance.toString()).toBe('background:url(";");overflow:hidden;')
  })

  describe('constructor()', () => {
    context('with decls argument in string', () => {
      it('assigns parsed declarations', () =>
        expect(new InlineStyle('font-size: 20px;').toString()).toBe(
          'font-size:20px;',
        ))
    })

    context('with decls argument in object', () => {
      it('assigns the pair of declaration and value', () =>
        expect(new InlineStyle({ border: '1px solid #000' }).toString()).toBe(
          'border:1px solid #000;',
        ))
    })

    context('with decls argument in InlineStyle', () => {
      it('assigns sanitized declarations', () => {
        const base = new InlineStyle({ color: 'red }', background: 'yellow' })
        expect(new InlineStyle(base).toString()).toBe('background:yellow;')
      })
    })
  })
})
