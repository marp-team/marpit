import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../src/markdown/directives/apply'
import backgroundImage from '../../src/markdown/background_image'
import comment from '../../src/markdown/comment'
import inlineSVG from '../../src/markdown/inline_svg'
import parseDirectives from '../../src/markdown/directives/parse'
import parseImage from '../../src/markdown/parse_image'
import slide from '../../src/markdown/slide'

describe('Marpit background image plugin', () => {
  const marpitStub = svg => ({
    lastGlobalDirectives: {},
    themeSet: { getThemeProp: () => 100 },
    options: { inlineSVG: svg },
  })

  const md = (svg = false) =>
    new MarkdownIt()
      .use(comment)
      .use(slide)
      .use(parseDirectives, marpitStub(svg))
      .use(applyDirectives)
      .use(inlineSVG, marpitStub(svg))
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
      const mdText = '<!-- backgroundImage: url(A) --> ![bg]()'
      const [firstSlide] = md().parse(mdText)

      assert(firstSlide.meta.marpitDirectives.backgroundImage === 'url(A)')
    })
  })

  context('with resizing keyword / scale', () => {
    const directives = markdown => {
      const [parsed] = md().parse(markdown)
      return parsed.meta.marpitDirectives
    }

    it('assigns corresponded backgroundSize spot directive', () => {
      assert(directives('![bg auto](img)').backgroundSize === 'auto')
      assert(directives('![bg contain](img)').backgroundSize === 'contain')
      assert(directives('![bg cover](img)').backgroundSize === 'cover')
      assert(directives('![bg fit](img)').backgroundSize === 'contain')
    })

    it('assigns specified scale to backgroundSize spot directive', () => {
      assert(directives('![bg 50%](img)').backgroundSize === '50%')
      assert(directives('![bg 123.45%](img)').backgroundSize === '123.45%')
      assert(directives('![bg .25%](img)').backgroundSize === '.25%')

      // The percentage scale is prior to the background keyword.
      assert(directives('![bg 100% contain](img)').backgroundSize === '100%')
    })

    it('ignores invalid scale', () => {
      assert(directives('![bg %](img)').backgroundSize !== '%')
      assert(directives('![bg .%](img)').backgroundSize !== '.%')
      assert(directives('![bg 25](img)').backgroundSize !== '25')
    })
  })

  context('with inline SVG (Advanced background mode)', () => {
    const mdSVG = md(true)
    const $load = html =>
      cheerio.load(html, {
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
      })

    it('renders the structure for advanced background to another foreignObject', () => {
      const $ = $load(mdSVG.render('![bg](image)'))
      assert($('svg[viewBox="0 0 100 100"] > foreignObject').length === 2)

      const bg = $('svg > foreignObject:first-child')
      const bgSection = bg.find(
        'section[data-marpit-advanced-background="background"]'
      )
      assert(bgSection.length === 1)

      const figure = bgSection.find('figure')
      assert(figure.length === 1)
      assert(figure.attr('style') === 'background-image:url("image");')
    })

    it('escapes doublequote to disallow XSS', () => {
      const $ = $load(mdSVG.render('![bg](img"\\);color:#f00;--xss:url\\(")'))
      const style = $('figure').attr('style')

      assert(style !== 'background-image:("img");color:#f00;--xss:url("");')
    })

    it('assigns data attribute to section element of the slide content', () => {
      const $ = $load(mdSVG.render('![bg](image)\n\n# test'))
      const slideSection = $('svg > foreignObject:last-child > section')

      assert(slideSection.find('h1').length === 1)
      assert(slideSection.attr('data-marpit-advanced-background') === 'content')
    })

    it("inherits slide section's style assigned by directive", () => {
      const $ = $load(mdSVG.render('<!-- backgroundImage: url(A) --> ![bg](B)'))
      const bgSection = $(
        'section[data-marpit-advanced-background="background"]'
      )

      assert(bgSection.attr('style').includes('background-image:url(A);'))
    })

    it('renders multiple images', () => {
      const $ = $load(mdSVG.render('![bg](A) ![bg](B)'))
      const figures = $('figure')

      assert(figures.length === 2)
      assert(figures.eq(0).attr('style') === 'background-image:url("A");')
      assert(figures.eq(1).attr('style') === 'background-image:url("B");')
    })

    it('assigns background-size style with resizing keyword / scale', () => {
      const $ = $load(mdSVG.render('![bg fit](A) ![bg 50%](B)'))
      const styleA = $('figure:first-child').attr('style')
      const styleB = $('figure:last-child').attr('style')

      assert(styleA.includes('background-image:url("A");'))
      assert(styleA.includes('background-size:contain;'))
      assert(styleB.includes('background-image:url("B");'))
      assert(styleB.includes('background-size:50%;'))
    })
  })
})
