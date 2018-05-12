import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../../src/markdown/directives/apply'
import comment from '../../../src/markdown/comment'
import parseDirectives from '../../../src/markdown/directives/parse'
import slide from '../../../src/markdown/slide'

describe('Marpit directives apply plugin', () => {
  const themeSetStub = new Map()
  themeSetStub.set('test_theme', true)

  const md = (...args) =>
    new MarkdownIt('commonmark')
      .use(comment)
      .use(slide)
      .use(parseDirectives, { themeSet: themeSetStub })
      .use(applyDirectives, ...args)

  const mdForTest = (...args) =>
    md(...args).use(mdInstance => {
      mdInstance.core.ruler.before(
        'marpit_directives_apply',
        'marpit_directives_apply_test',
        state => {
          state.tokens.forEach(token => {
            if (token.meta && token.meta.marpitDirectives) {
              // Internal directive
              token.meta.marpitDirectives.unknownDir = 'directive'
            }
          })
        }
      )
    })

  const basicDirs = dedent`
    ---
    class: test
    theme: test_theme
    ---
  `

  const toObjStyle = style =>
    (style || '').split(';').reduce((obj, text) => {
      const splited = text.trim().split(':')
      if (splited.length !== 2) return obj

      const [key, val] = splited
      return { ...obj, [key.trim()]: val.trim() }
    }, {})

  it('applies directives to slide node', () => {
    const $ = cheerio.load(mdForTest().render(basicDirs))
    const section = $('section').first()
    const style = toObjStyle(section.attr('style'))

    assert(section.is('.test'))
    assert(section.attr('data-class') === 'test')
    assert(section.attr('data-theme') === 'test_theme')
    assert(!section.attr('data-unknown-dir'))
    assert(style['--class'] === 'test')
    assert(style['--theme'] === 'test_theme')
    assert(style['--unknown-dir'] !== 'directive')
  })

  context('with dataset option as false', () => {
    const opts = { dataset: false }

    it('does not apply directives to data attributes', () => {
      const $ = cheerio.load(mdForTest(opts).render(basicDirs))
      const section = $('section').first()

      assert(!section.attr('data-class'))
      assert(!section.attr('data-theme'))
    })
  })

  context('with css option as false', () => {
    const opts = { css: false }

    it('does not apply directives to CSS custom properties', () => {
      const $ = cheerio.load(mdForTest(opts).render(basicDirs))
      const section = $('section').first()

      assert(!section.attr('style'))
    })
  })

  context('with includeInternal option as true', () => {
    const opts = { includeInternal: true }

    it('applies together with unknown (internal) directive', () => {
      const $ = cheerio.load(mdForTest(opts).render(basicDirs))
      const section = $('section').first()
      const style = toObjStyle(section.attr('style'))

      assert(section.attr('data-unknown-dir') === 'directive')
      assert(style['--unknown-dir'] === 'directive')
    })
  })

  describe('Local directives', () => {
    describe('Background image', () => {
      const bgDirs = dedent`
        ---
        backgroundImage: url(//example.com/a.jpg)
        backgroundPosition: left top
        backgroundRepeat: repeat-y
        backgroundSize: 25%
        ---
      `

      it('applies corresponding style to section element', () => {
        const $ = cheerio.load(mdForTest().render(bgDirs))
        const section = $('section').first()
        const style = toObjStyle(section.attr('style'))

        assert(style['background-image'] === 'url(//example.com/a.jpg)')
        assert(style['background-position'] === 'left top')
        assert(style['background-repeat'] === 'repeat-y')
        assert(style['background-size'] === '25%')
      })

      context('when directives of image options are not defined', () => {
        const bgDefaultDirs =
          '<!-- backgroundImage: "linear-gradient(to bottom, #fff, #000)" -->'

        it('assigns background image option as default value', () => {
          const $ = cheerio.load(mdForTest().render(bgDefaultDirs))
          const section = $('section').first()
          const style = toObjStyle(section.attr('style'))

          assert(style['background-position'] === 'center')
          assert(style['background-repeat'] === 'no-repeat')
          assert(style['background-size'] === 'cover')
        })
      })

      context('when backgroundImage directive is not defined', () => {
        const bgOptionDirs = dedent`
          ---
          backgroundPosition: "top"
          backgroundRepeat: "repeat"
          backgroundSize: "150px"
          ---

          # Slide 1

          ---
          <!-- backgroundImage: "url(//example.com/specified.png)" -->

          ## Slide 2

          ---
          <!-- backgroundImage: -->

          ### Slide 3
        `

        it('ignores background option directives', () => {
          const $ = cheerio.load(mdForTest().render(bgOptionDirs))
          const [styleOne, styleTwo, styleThree] = [
            toObjStyle($('section#1').attr('style')),
            toObjStyle($('section#2').attr('style')),
            toObjStyle($('section#3').attr('style')),
          ]

          assert(styleOne['background-position'] === undefined)
          assert(styleOne['background-repeat'] === undefined)
          assert(styleOne['background-size'] === undefined)
          assert(styleTwo['background-position'] === 'top')
          assert(styleTwo['background-repeat'] === 'repeat')
          assert(styleTwo['background-size'] === '150px')
          assert(styleThree['background-position'] === undefined)
          assert(styleThree['background-repeat'] === undefined)
          assert(styleThree['background-size'] === undefined)
        })
      })

      context('when directives about images has a style injection', () => {
        const bgInjectionDirs = dedent`
          ---
          backgroundImage: "none;--injection1:injection1"
          backgroundPosition: "left;--injection2:injection2"
          backgroundRepeat: "no-repeat;--injection3:injection3"
          backgroundSize: "auto;--injection4:injection4"
          ---
        `

        it('sanitizes injected styles', () => {
          const $ = cheerio.load(mdForTest().render(bgInjectionDirs))
          const section = $('section').first()
          const style = toObjStyle(section.attr('style'))

          assert(style['background-image'] === 'none')
          assert(style['background-position'] === 'left')
          assert(style['background-repeat'] === 'no-repeat')
          assert(style['background-size'] === 'auto')
          assert(style['--injection1'] === undefined)
          assert(style['--injection2'] === undefined)
          assert(style['--injection3'] === undefined)
          assert(style['--injection4'] === undefined)
        })
      })
    })

    describe('Paginate', () => {
      it('applies data-marpit-pagination attribute', () => {
        const paginateDirs = dedent`
          ---
          paginate: true
          _paginate:
          ---

          # Slide 1

          ---

          ## Slide 2
        `

        const $ = cheerio.load(mdForTest().render(paginateDirs))
        const sections = $('section')

        assert(!sections.eq(0).data('marpit-pagination'))
        assert(sections.eq(1).data('marpit-pagination'))
      })
    })
  })
})
