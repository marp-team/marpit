import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import comment from '../../src/markdown/comment'
import sweep from '../../src/markdown/sweep'

describe('Marpit sweep plugin', () => {
  const md = (opts = {}) =>
    new MarkdownIt('commonmark', opts).use(comment).use(sweep)

  it('does not sweep whitespace in #renderInline', () =>
    assert(md().renderInline(' ') === ' '))

  const htmlOptions = [true, false]

  htmlOptions.forEach(html => {
    context(`with html option as ${html}`, () => {
      it('hides the paragraph that has only includes whitespace', () => {
        // First paragraph remains a whitespace after striped comments.
        const text = '<!-- parsed --> <!-- comment -->\n\ncontent'
        const $ = cheerio.load(md({ html }).render(text))

        assert($('p').length === 1)
      })
    })
  })
})
