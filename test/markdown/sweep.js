import { load } from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import { backgroundImage } from '../../src/markdown/background_image'
import { comment } from '../../src/markdown/comment'
import applyDirectives from '../../src/markdown/directives/apply'
import parseDirectives from '../../src/markdown/directives/parse'
import { image } from '../../src/markdown/image'
import { inlineSVG } from '../../src/markdown/inline_svg'
import { slide } from '../../src/markdown/slide'
import { sweep } from '../../src/markdown/sweep'

describe('Marpit sweep plugin', () => {
  const md = (mdOpts = {}, marpitInstance = { options: {} }) => {
    const instance = new MarkdownIt('commonmark', mdOpts)
    instance.marpit = marpitInstance

    return instance.use(sweep)
  }

  it('does not sweep whitespace in #renderInline', () =>
    expect(md().renderInline(' ')).toBe(' '))

  it('sweeps blank paragraph made by background image plugin', () => {
    const marpitStub = {
      customDirectives: { global: {}, local: {} },
      themeSet: new Map(),
      options: { inlineSVG: false },
    }

    const markdown = md({ breaks: true }, marpitStub)
      .use(slide)
      .use(parseDirectives)
      .use(applyDirectives)
      .use(inlineSVG)
      .use(image)
      .use(backgroundImage)

    const $ = load(
      markdown.render(dedent`
        ![bg](sweepA)

        ![bg](sweepB) ![bg](sweepC)

        ![bg](sweepD)
        ![bg](sweepE)

        ![notBg](keep)

        ![bg](keep) with contents
      `)
    )

    expect($('p')).toHaveLength(2)
    expect($('br')).toHaveLength(0)
  })

  const htmlOptions = [true, false]

  htmlOptions.forEach((html) => {
    context(`with html option as ${html}`, () => {
      it('sweeps blank paragraph made by comment plugin', () => {
        // First paragraph remains a whitespace after striped comments.
        const text = '<!-- parsed --> <!-- comment -->\n\ncontent'
        const markdown = md({ html }).use(comment)
        const $ = load(markdown.render(text))

        expect($('p')).toHaveLength(1)
      })
    })
  })
})
