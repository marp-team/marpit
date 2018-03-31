import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import backgroundImage from '../../src/markdown/background_image'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'

describe('Marpit background image plugin', () => {
  const marpitStub = { themeSet: new Map() }

  const md = () =>
    new MarkdownIt()
      .use(slide)
      .use(parseDirectives, marpitStub)
      .use(backgroundImage)

  it('does not render the image syntax with bg description as <img>', () => {
    const $ = cheerio.load(md().render('![bg]() ![notbg]()'))

    assert($('img').length === 1)
    assert(
      $('img')
        .first()
        .attr('alt') === 'notbg'
    )
  })
})
