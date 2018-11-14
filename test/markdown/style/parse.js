import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import styleParse from '../../../src/markdown/style/parse'

describe('Marpit style parse plugin', () => {
  const marpitStub = { options: { inlineStyle: true } }
  const md = (marpit = marpitStub, mdOption = {}) =>
    new MarkdownIt('commonmark', mdOption).use(styleParse, marpit)

  it("ignores parse when Marpit's inlineStyle option is false", () => {
    const types = md({ options: { inlineStyle: false } })
      .parse('<style>b { color: #000; }</style>')
      .map(t => t.type)

    expect(types).toStrictEqual(expect.not.arrayContaining(['marpit_style']))
  })

  const text = dedent`
    <style>strong { color: red; }</style>

    **Inline style**

    <style-like></style-like>

    <style
      type="text/css">
      a { color: blue; }
    </style>

    <style scoped>i { color: yellow; }</style>
  `

  const ignoreCases = {
    'inline code': '`<style>b { color: red; }</style>`',
    'code block': '\t<style>b { color: red; }</style>',
    fence: '```\n<style>b { color: red; }</style>\n```',
  }

  for (const html of [true, false]) {
    context(`with html option as ${html}`, () => {
      const markdown = md(marpitStub, { html })
      const pickStyles = tokens => tokens.filter(t => t.type === 'marpit_style')

      it('extracts style with scoped attribute and stores to "marpit_style" token', () => {
        const [strong, a, i] = pickStyles(markdown.parse(text))

        expect(strong.content).toBe('strong { color: red; }')
        expect(strong.meta.marpitStyleScoped).toBe(false)

        expect(a.content).toBe('a { color: blue; }')
        expect(a.meta.marpitStyleScoped).toBe(false)

        expect(i.content).toBe('i { color: yellow; }')
        expect(i.meta.marpitStyleScoped).toBe(true)
      })

      it('strips style element in rendering', () => {
        const $ = cheerio.load(markdown.render(text))
        expect($('style')).toHaveLength(0)
      })

      describe('The scoped attribute', () => {
        it('parses scoped attribute with splitted by hardbreak', () => {
          const [token] = pickStyles(markdown.parse('<style\nscoped></style>'))
          expect(token.meta.marpitStyleScoped).toBe(true)
        })

        it('parses scoped attribute with another attribute', () => {
          const [token] = pickStyles(
            markdown.parse(`<style id="foobar" scoped type='text/css'></style>`)
          )
          expect(token.meta.marpitStyleScoped).toBe(true)
        })
      })

      Object.keys(ignoreCases).forEach(elementType => {
        context(`when ${elementType} has <style> HTML tag`, () => {
          it('keeps HTML', () => {
            const tokens = markdown.parse(ignoreCases[elementType])
            expect(pickStyles(tokens)).toHaveLength(0)

            const rendered = markdown.renderer.render(tokens, markdown.options)
            const $ = cheerio.load(rendered)
            const code = $('code').text()

            expect($('style')).toHaveLength(0)
            expect(code.trim()).toBe('<style>b { color: red; }</style>')
          })
        })
      })
    })
  }
})
