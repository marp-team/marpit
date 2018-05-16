import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import inlineStyleElements from '../../src/markdown/inline_style_elements'

describe('Marpit inline style elements plugin', () => {
  const md = (mdOption = {}) =>
    new MarkdownIt('commonmark', mdOption).use(inlineStyleElements)

  const text = dedent`
    <style>strong { color: red; }</style>

    **Inline style**

    <style type="text/css">
      a { color: blue; }
    </style>
  `

  it('ignores in #renderInline', () => {
    assert(md().renderInline('<!-- test -->') === '<!-- test -->')
  })

  const htmls = [true, false]

  htmls.forEach(html => {
    context(`with html option as ${html}`, () => {
      const markdown = md({ html })

      it('extracts style and stores to token meta', () => {
        const parsed = markdown.parse(text)
        const styles = parsed.reduce((arr, token) => {
          if (token.meta && token.meta.marpitInlineStyleElements)
            return [...arr, ...token.meta.marpitInlineStyleElements]

          return arr
        }, [])

        assert(styles.includes('strong { color: red; }'))
        assert(styles.includes('a { color: blue; }'))
      })

      it('strips comment in rendering', () => {
        const $ = cheerio.load(markdown.render(text))
        assert($('style').length === 0)
      })
    })
  })
})
