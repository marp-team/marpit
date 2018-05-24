import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import styleElements from '../../src/markdown/style_elements'

describe('Marpit style elements plugin', () => {
  const md = (mdOption = {}) =>
    new MarkdownIt('commonmark', mdOption).use(styleElements)

  const text = dedent`
    <style>strong { color: red; }</style>

    **Inline style**

    <style-like></style-like>

    <style
      type="text/css">
      a { color: blue; }
    </style>
  `

  const ignoreCases = {
    'inline code': '`<style>b { color: red; }</style>`',
    'code block': '\t<style>b { color: red; }</style>',
    fence: '```\n<style>b { color: red; }</style>\n```',
  }

  it('ignores in #renderInline', () =>
    assert(md().renderInline('<!-- test -->') === '<!-- test -->'))

  const htmls = [true, false]

  htmls.forEach(html => {
    context(`with html option as ${html}`, () => {
      const markdown = md({ html })
      const pickStyles = tokens =>
        tokens.reduce(
          (arr, token) =>
            token.type === 'marpit_style' ? [...arr, token.content] : arr,
          []
        )

      it('extracts style and stores to "marpit_style" token', () =>
        assert.deepStrictEqual(pickStyles(markdown.parse(text)), [
          'strong { color: red; }',
          'a { color: blue; }',
        ]))

      it('strips style element in rendering', () => {
        const $ = cheerio.load(markdown.render(text))
        assert($('style').length === 0)
      })

      Object.keys(ignoreCases).forEach(elementType => {
        context(`when ${elementType} has <style> HTML tag`, () => {
          it('keeps HTML', () => {
            const tokens = markdown.parse(ignoreCases[elementType])
            assert(pickStyles(tokens).length === 0)

            const rendered = markdown.renderer.render(tokens, markdown.options)
            const $ = cheerio.load(rendered)
            const code = $('code').text()

            assert($('style').length === 0)
            assert(code.trim() === '<style>b { color: red; }</style>')
          })
        })
      })
    })
  })
})
