import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import comment from '../../src/markdown/comment'
import parseImage from '../../src/markdown/parse_image'
import backgroundImage from '../../src/markdown/background_image'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'

describe('Marpit background image plugin', () => {
  const marpitStub = { themeSet: new Map() }

  const md = () =>
    new MarkdownIt()
      .use(comment)
      .use(slide)
      .use(parseDirectives, marpitStub)
      .use(parseImage)
      .use(backgroundImage)

  const bgDirective = (url, mdInstance) => {
    const [first, second] = mdInstance.parse(`![bg](${url})\n\n---`)
    const secondDirectives = second.meta.marpitDirectives || {}

    assert(secondDirectives.backgroundImage === undefined)
    return first.meta.marpitDirectives.backgroundImage
  }

  it('assigns specified image to backgroundImage spot directive', () => {
    const url = 'https://example.com/bg.jpg'
    assert(bgDirective(url, md()) === `url("${url}")`)
  })

  it('escapes doublequote and backslash', () =>
    assert(bgDirective('"md\\Abg"', md()) === 'url("%22md%5CAbg%22")'))

  it('overrides an already assigned directive', () => {
    const mdText = `<!-- backgroundImage: url(A) --> ![bg](B)`
    const [firstSlide] = md().parse(mdText)

    assert(firstSlide.meta.marpitDirectives.backgroundImage === 'url("B")')
  })

  it('does not render the image syntax with bg description as <img>', () => {
    const $ = cheerio.load(md().render('![bg](bgImage) ![notbg](notBgImage)'))

    assert($('img').length === 1)
    assert($('img').attr('alt') === 'notbg')
    assert($('img').attr('src') === 'notBgImage')
  })

  context('when empty string is specified', () => {
    it('ignores assign if empty string is specified', () =>
      assert(bgDirective('', md()) === undefined))

    it('fallbacks to an already assigned directive', () => {
      const mdText = `<!-- backgroundImage: url(A) --> ![bg]()`
      const [firstSlide] = md().parse(mdText)

      assert(firstSlide.meta.marpitDirectives.backgroundImage === 'url(A)')
    })
  })
})
