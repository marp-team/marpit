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
        const styles = parsed.reduce(
          (arr, token) =>
            token.meta && token.meta.marpitInlineStyleElements
              ? [...arr, ...token.meta.marpitInlineStyleElements]
              : arr,
          []
        )

        assert(styles.includes('strong { color: red; }'))
        assert(styles.includes('a { color: blue; }'))
      })

      it('strips style element in rendering', () => {
        const $ = cheerio.load(markdown.render(text))
        assert($('style').length === 0)
      })

      const ignoreCases = {
        'inline code': '`<style>b { color: red; }</style>`',
        'code block': '\t<style>b { color: red; }</style>',
        fence: '```\n<style>b { color: red; }</style>\n```',
      }

      Object.keys(ignoreCases).forEach(elementType => {
        context(`when ${elementType} has <style> HTML tag`, () => {
          it('keeps HTML', () => {
            const $ = cheerio.load(markdown.render(ignoreCases[elementType]))
            const code = $('code').text()

            assert($('style').length === 0)
            assert(code.trim() === '<style>b { color: red; }</style>')
          })
        })
      })
    })
  })
})
