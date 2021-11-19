import postcss from 'postcss'
import svgBackdrop from '../../src/postcss/svg_backdrop'

describe('Marpit PostCSS SVG backdrop plugin', () => {
  const run = (input) =>
    postcss([svgBackdrop()]).process(input, { from: undefined })

  it('appends redirected style for SVG in the container', () =>
    run('::backdrop { background: white; }').then(({ root }) => {
      const [backdrop, redirected] = root.nodes
      expect(backdrop.selector).toBe('::backdrop')

      expect(redirected.type).toBe('atrule')
      expect(redirected.name).toBe('media')
      expect(redirected.params).toBe('screen')
      expect(redirected.nodes.toString()).toMatchInlineSnapshot(
        `":marpit-container > svg[data-marpit-svg] { background: white; }"`
      )
    }))
})
