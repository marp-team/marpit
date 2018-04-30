import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import backgroundImage from '../../src/markdown/background_image'
import comment from '../../src/markdown/comment'
import inlineSVG from '../../src/markdown/inline_svg'
import parseDirectives from '../../src/markdown/directives/parse'
import parseImage from '../../src/markdown/parse_image'
import slide from '../../src/markdown/slide'
import sweep from '../../src/markdown/sweep'

describe('Marpit sweep plugin', () => {
  const md = (opts = {}) => new MarkdownIt('commonmark', opts).use(sweep)

  it('does not sweep whitespace in #renderInline', () =>
    assert(md().renderInline(' ') === ' '))

  it('sweeps blank paragraph made by background image plugin', () => {
    const marpitStub = {
      themeSet: new Map(),
      options: { inlineSVG: false },
    }

    const markdown = md()
      .use(slide)
      .use(parseDirectives, marpitStub)
      .use(inlineSVG, marpitStub)
      .use(parseImage)
      .use(backgroundImage)

    const $ = cheerio.load(
      markdown.render(dedent`
        ![bg](sweepA)

        ![bg](sweepB) ![bg](sweepC)

        ![bg](sweepD)
        ![bg](sweepE)

        ![notBg](keep)

        ![bg](keep) with contents
      `)
    )

    assert($('p').length === 2)
  })

  const htmlOptions = [true, false]

  htmlOptions.forEach(html => {
    context(`with html option as ${html}`, () => {
      it('sweeps blank paragraph made by comment plugin', () => {
        // First paragraph remains a whitespace after striped comments.
        const text = '<!-- parsed --> <!-- comment -->\n\ncontent'
        const markdown = md({ html }).use(comment)
        const $ = cheerio.load(markdown.render(text))

        assert($('p').length === 1)
      })
    })
  })
})
