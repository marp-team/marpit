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
import assignStyle from '../../src/markdown/style/assign'
import parseStyle from '../../src/markdown/style/parse'

const splitBackgroundKeywords = ['left', 'right']

describe('Marpit background image plugin', () => {
  const marpitStub = (svg) => ({
    customDirectives: { global: {}, local: {} },
    lastGlobalDirectives: {},
    themeSet: { getThemeProp: () => 100 },
    options: {},
    inlineSVGOptions: { enabled: svg },
  })

  const md = (svg = false) => {
    const instance = new MarkdownIt()
    instance.marpit = marpitStub(svg)

    return instance
      .use(comment)
      .use(parseStyle)
      .use(slide)
      .use(parseDirectives)
      .use(applyDirectives)
      .use(inlineSVG)
      .use(image)
      .use(backgroundImage)
      .use(assignStyle)
  }

  const bgDirective = (url, mdInstance) => {
    const [first, second] = mdInstance.parse(`![bg](${url})\n\n---`)
    const secondDirectives = (second.meta && second.meta.marpitDirectives) || {}

    expect(secondDirectives.backgroundImage).toBeUndefined()
    return first.meta.marpitDirectives.backgroundImage
  }

  it('assigns specified image to backgroundImage spot directive', () => {
    const url = 'https://example.com/bg.jpg'
    expect(bgDirective(url, md())).toBe(`url("${url}")`)
  })

  it('escapes doublequote and backslash', () =>
    expect(bgDirective('"md\\Abg"', md())).toBe('url("%22md%5CAbg%22")'))

  it('overrides an already assigned directive', () => {
    const mdText = `<!-- backgroundImage: url(A) -->\n\n![bg](B)`
    const [firstSlide] = md().parse(mdText)

    expect(firstSlide.meta.marpitDirectives.backgroundImage).toBe('url("B")')
  })

  it('does not render the image syntax with bg description as <img>', () => {
    const $ = load(md().render('![bg](bgImage) ![notbg](notBgImage)'))

    expect($('img')).toHaveLength(1)
    expect($('img').attr('alt')).toBe('notbg')
    expect($('img').attr('src')).toBe('notBgImage')
  })

  context('when empty string is specified', () => {
    it('ignores assign if empty string is specified', () =>
      expect(bgDirective('', md())).toBeUndefined())

    it('fallbacks to an already assigned directive', () => {
      const mdText = '<!-- backgroundImage: url(A) --> ![bg]()'
      const [firstSlide] = md().parse(mdText)

      expect(firstSlide.meta.marpitDirectives.backgroundImage).toBe('url(A)')
    })
  })

  context('with resizing keyword / scale', () => {
    const directives = (markdown) => {
      const [parsed] = md().parse(markdown)
      return parsed.meta.marpitDirectives
    }

    it('assigns corresponded backgroundSize spot directive', () => {
      expect(directives('![bg auto](i)').backgroundSize).toBe('auto')
      expect(directives('![bg contain](i)').backgroundSize).toBe('contain')
      expect(directives('![bg cover](i)').backgroundSize).toBe('cover')
      expect(directives('![bg fit](i)').backgroundSize).toBe('contain')
    })

    it('assigns specified scale to backgroundSize spot directive', () => {
      expect(directives('![bg 50%](i)').backgroundSize).toBe('50%')
      expect(directives('![bg 123.45%](i)').backgroundSize).toBe('123.45%')
      expect(directives('![bg .25%](i)').backgroundSize).toBe('.25%')

      // The percentage scale is prior to the background keyword.
      expect(directives('![bg 100% contain](i)').backgroundSize).toBe('100%')
    })

    it('assigns specified scale per direction', () => {
      expect(directives('![bg w:300](i)').backgroundSize).toBe('300px auto')
      expect(directives('![bg h:25%](i)').backgroundSize).toBe('auto 25%')
      expect(directives('![bg 50% w:100%](i)').backgroundSize).toBe('100% 50%')
      expect(directives('![bg h:10em 30%](i)').backgroundSize).toBe('30% 10em')
      expect(directives('![bg 1% w:auto](i)').backgroundSize).toBe('auto 1%')

      // The background keyword are prior to the width and height scale.
      expect(directives('![bg contain w:50](i)').backgroundSize).toBe('contain')
      expect(directives('![bg fit h:50](i)').backgroundSize).toBe('contain')
    })

    it('ignores invalid scale', () => {
      expect(directives('![bg %](i)').backgroundSize).not.toBe('%')
      expect(directives('![bg .%](i)').backgroundSize).not.toBe('.%')
      expect(directives('![bg 25](i)').backgroundSize).not.toBe('25')
    })
  })

  context('with inline SVG (Advanced background mode)', () => {
    const mdSVG = () => md(true)
    const $load = (html, opts = {}) =>
      load(html, {
        ...opts,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
      })

    it('renders advanced background to another foreignObject', () => {
      const $ = $load(mdSVG().render('![bg](image)'), { xmlMode: true })
      expect($('svg[viewBox="0 0 100 100"] > foreignObject')).toHaveLength(3)

      const bg = $('svg > foreignObject:first-child')
      const bgSection = bg.find(
        '> section[data-marpit-advanced-background="background"]',
      )
      expect(bgSection).toHaveLength(1)

      const figure = bgSection.find(
        '> div[data-marpit-advanced-background-container] > figure',
      )
      expect(figure).toHaveLength(1)
      expect(figure.attr('style')).toBe('background-image:url("image");')
    })

    it('escapes doublequote to disallow XSS', () => {
      const $ = $load(mdSVG().render('![bg](img"\\);color:#f00;--xss:url\\(")'))

      expect($('figure').attr('style')).not.toBe(
        'background-image:("img");color:#f00;--xss:url("");',
      )
    })

    it('assigns data attribute to section element of the slide content', () => {
      const $ = $load(mdSVG().render('![bg](image)\n\n# test'), {
        xmlMode: true,
      })
      const slideSection = $(
        'svg > foreignObject > section[data-marpit-advanced-background="content"]',
      )

      expect(slideSection.find('h1')).toHaveLength(1)
      expect(slideSection.attr('data-marpit-advanced-background')).toBe(
        'content',
      )
    })

    it("inherits slide section's style assigned by directive", () => {
      const $ = $load(
        mdSVG().render('<!-- backgroundImage: url(A) -->\n\n![bg](B)'),
      )
      const bgSection = $(
        'section[data-marpit-advanced-background="background"]',
      )

      expect(bgSection.attr('style')).toContain('background-image:url(A);')
    })

    it('renders multiple images', () => {
      const $ = $load(mdSVG().render('![bg](A) ![bg](B)'))
      const figures = $('figure')

      expect(figures).toHaveLength(2)
      expect(figures.eq(0).attr('style')).toBe('background-image:url("A");')
      expect(figures.eq(1).attr('style')).toBe('background-image:url("B");')
    })

    it('renders alternative text as <figcaption>, without Marpit specific keywords', () => {
      const $ = $load(
        mdSVG().render(dedent`
          ![bg fit  The background image](A)
          ![This is bg 20% w:40% xxxxx](B)
          ![    bg      ](C)
          ![bg <b>should <br /> escape</b>](D)
        `),
      )
      const figures = $('figure')

      expect(figures.eq(0).is(':has(figcaption)')).toBe(true)
      expect(figures.eq(0).find('figcaption').text()).toBe(
        'The background image',
      )
      expect(figures.eq(1).is(':has(figcaption)')).toBe(true)
      expect(figures.eq(1).find('figcaption').text()).toBe('This is xxxxx')

      // Ignore whitespaces
      expect(figures.eq(2).is(':has(figcaption)')).toBe(false)

      // XSS
      expect(figures.eq(3).is(':has(figcaption)')).toBe(true)
      expect(figures.eq(3).is(':has(b)')).toBe(false)
      expect(figures.eq(3).is(':has(br)')).toBe(false)
    })

    it('assigns background-size style with resizing keyword / scale', () => {
      const markdown =
        '![bg fit](A) ![bg 50%](B) ![bg w:40px](C) ![bg 10% h:20%](D)'

      const $ = $load(mdSVG().render(markdown))
      const styleA = $('figure:nth-of-type(1)').attr('style')
      const styleB = $('figure:nth-of-type(2)').attr('style')
      const styleC = $('figure:nth-of-type(3)').attr('style')
      const styleD = $('figure:nth-of-type(4)').attr('style')

      expect(styleA).toContain('background-image:url("A");')
      expect(styleA).toContain('background-size:contain;')
      expect(styleB).toContain('background-image:url("B");')
      expect(styleB).toContain('background-size:50%;')
      expect(styleC).toContain('background-image:url("C");')
      expect(styleC).toContain('background-size:40px auto;')
      expect(styleD).toContain('background-image:url("D");')
      expect(styleD).toContain('background-size:10% 20%;')
    })

    splitBackgroundKeywords.forEach((keyword) => {
      context(`with the ${keyword} keyword for split background`, () => {
        const $ = (attr) =>
          $load(
            mdSVG().render(
              `![bg ${[keyword, attr].filter((v) => v).join(':')}](image)`,
            ),
            { xmlMode: true },
          )

        const section = $()(
          'svg > foreignObject > section[data-marpit-advanced-background="content"]',
        )
        const foreignObject = section.parent()

        it('assigns the width attribute of foreignObject for content as 50%', () =>
          expect(foreignObject.attr('width')).toBe('50%'))

        it('assigns CSS variable to style attribute for split background', () =>
          expect(section.attr('style')).toContain(
            '--marpit-advanced-background-split:50%',
          ))

        it('assigns data attribute of the keyword for split background', () =>
          expect(section.attr('data-marpit-advanced-background-split')).toBe(
            keyword,
          ))

        context('when passed split size for background', () => {
          const ssSection = $('33%')(
            'svg > foreignObject > section[data-marpit-advanced-background="content"]',
          )
          const ssforeignObject = ssSection.parent()

          it('assigns the width attribute of foreignObject for content as remaining size', () =>
            expect(ssforeignObject.attr('width')).toBe('67%'))

          it('assigns CSS variable to style attribute for split background, with specified size', () =>
            expect(ssSection.attr('style')).toContain(
              '--marpit-advanced-background-split:33%',
            ))
        })
      })
    })

    it('assigns x attribute of foreignObject for content as 50% with left keyword', () => {
      const $ = $load(mdSVG().render(`![bg left](image)`), { xmlMode: true })
      const section = $(
        'svg > foreignObject > section[data-marpit-advanced-background="content"]',
      )
      const foreignObject = section.parent()

      expect(foreignObject.attr('x')).toBe('50%')
    })

    context(
      'when multiple keyword for split background defined in a same slide',
      () => {
        const $ = $load(mdSVG().render(`![bg right](a) ![bg left](b)`), {
          xmlMode: true,
        })

        it('uses the last defined keyword', () => {
          const section = $(
            'svg > foreignObject > section[data-marpit-advanced-background="content"]',
          )
          expect(section.attr('data-marpit-advanced-background-split')).toBe(
            'left',
          )
        })
      },
    )

    describe('Direction keyword', () => {
      it('assigns data attribute of the keyword for direction as horizontal by default', () => {
        const $ = $load(mdSVG().render('![bg](img1) ![bg](img2)'))
        const container = $('div[data-marpit-advanced-background-container]')

        expect(
          container.attr('data-marpit-advanced-background-direction'),
        ).toBe('horizontal')
      })

      context('with vertical keyword', () => {
        it('assigns data attribute of the keyword for direction as vertical', () => {
          const $ = $load(mdSVG().render('![bg vertical](img1) ![bg](img2)'))
          const container = $('div[data-marpit-advanced-background-container]')

          expect(
            container.attr('data-marpit-advanced-background-direction'),
          ).toBe('vertical')
        })
      })

      it('uses the last defined direction when defined multiple directions', () => {
        const $ = $load(
          mdSVG().render('![bg vertical](img1) ![bg horizontal](img2)'),
        )
        const container = $('div[data-marpit-advanced-background-container]')

        expect(
          container.attr('data-marpit-advanced-background-direction'),
        ).toBe('horizontal')
      })
    })

    describe('CSS Filters', () => {
      it('assigns filter style with the function of filter', () => {
        const filters = {
          // with default attributes
          blur: 'filter:blur(10px);',
          brightness: 'filter:brightness(1.5);',
          contrast: 'filter:contrast(2);',
          'drop-shadow': 'filter:drop-shadow(0 5px 10px rgba(0,0,0,.4));',
          grayscale: 'filter:grayscale(1);',
          'hue-rotate': 'filter:hue-rotate(180deg);',
          invert: 'filter:invert(1);',
          opacity: 'filter:opacity(.5);',
          saturate: 'filter:saturate(2);',
          sepia: 'filter:sepia(1);',

          // with specified attributes
          'blur:20px': 'filter:blur(20px);',
          'brightness:200%': 'filter:brightness(200%);',
          'contrast:.5': 'filter:contrast(.5);',
          'drop-shadow:1em,1em': 'filter:drop-shadow(1em 1em);',
          'drop-shadow:0,0,10px': 'filter:drop-shadow(0 0 10px);',
          'drop-shadow:0,1px,2px,#f00': 'filter:drop-shadow(0 1px 2px #f00);',
          'drop-shadow:0,0,20px,hsla(0,100%,50%,.5)':
            'filter:drop-shadow(0 0 20px hsla(0,100%,50%,.5));',
          'grayscale:50%': 'filter:grayscale(50%);',
          'hue-rotate:90deg': 'filter:hue-rotate(90deg);',
          'invert:0.25': 'filter:invert(0.25);',
          'opacity:30%': 'filter:opacity(30%);',
          'saturate:123%': 'filter:saturate(123%);',
          'sepia:.5': 'filter:sepia(.5);',

          // with multiple filters
          'brightness:.75 blur': 'filter:brightness(.75) blur(10px);',
        }

        Object.keys(filters).forEach((filter) => {
          const $ = $load(mdSVG().render(`![${filter}](a)\n![bg ${filter}](b)`))
          const inlineImageStyle = $('img').attr('style')
          const bgImageStyle = $('img').attr('style')

          expect(inlineImageStyle).toContain(filters[filter])
          expect(bgImageStyle).toContain(filters[filter])
        })
      })

      it('sanitizes arguments to prevent style injection', () => {
        const injections = [
          'blur',
          'brightness',
          'contrast',
          'grayscale',
          'hue-rotate',
          'invert',
          'opacity',
          'saturate',
          'sepia',
        ].reduce(
          (o, fltr) => ({
            ...o,
            [`${fltr}:1);color:red;--a:(`]: `filter:${fltr}(1\\29 \\3b color\\3a red\\3b --a\\3a \\28 );`,
          }),
          {
            // drop-shadow filter cannot escape in the same way as other.
            // It won't escape the brackets that is wrapping the color syntax.
            'drop-shadow:0,0,0,rgba(0,0,0,1;)':
              'filter:drop-shadow(0 0 0 rgba(0,0,0,1\\3b ));',
          },
        )

        Object.keys(injections).forEach((filter) => {
          const $ = $load(mdSVG().render(`![${filter}](a)`))
          const style = $('img').attr('style')

          expect(style).toBe(injections[filter])
        })
      })
    })

    context('with paginate and class directive', () => {
      const $ = $load(
        mdSVG().render(
          '---\npaginate: true\nclass: pseudo layer\n---\n\n![bg](test)',
        ),
        { xmlMode: true },
      )

      it('assigns pagination attributes to pseudo layer', () => {
        const foreignObjects = $('svg > foreignObject')
        expect(foreignObjects).toHaveLength(3)

        const pseudoFO = foreignObjects.eq(2)
        expect(pseudoFO.is('[data-marpit-advanced-background="pseudo"]')).toBe(
          true,
        )

        const pseudoLayer = pseudoFO.find('> section.pseudo.layer')
        expect(pseudoLayer.is('[data-marpit-pagination="1"]')).toBe(true)
        expect(pseudoLayer.is('[data-marpit-pagination-total="1"]')).toBe(true)
      })
    })

    context('with scoped style', () => {
      const $ = $load(
        mdSVG().render(
          "![bg](test)\n\n<style scoped>section::before { content: 'test'; }</style>",
        ),
        { xmlMode: true },
      )

      it('assigns scoped attribute to the section element in pseudo layer', () => {
        const foreignObjects = $('svg > foreignObject')
        const pseudoFO = foreignObjects.eq(2)
        const pseudoSection = pseudoFO.find('> section')

        expect(Object.keys(pseudoSection.attr())).toContainEqual(
          expect.stringMatching(/^data-marpit-scope-/),
        )
      })
    })

    context('with color directive', () => {
      const $ = $load(mdSVG().render('<!-- color: white -->\n\n![bg](test)'), {
        xmlMode: true,
      })

      it('assigns color style to pseudo layer', () => {
        const pseudoSection = $('svg > foreignObject > section').eq(2)
        expect(pseudoSection.attr('style')).toContain('color:white;')
      })
    })
  })
})
