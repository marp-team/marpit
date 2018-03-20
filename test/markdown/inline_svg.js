import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../src/markdown/directives/apply'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'
import inlineSVG from '../../src/markdown/inline_svg'
import { Theme, ThemeSet } from '../../src/index'

describe('Marpit inline SVG plugin', () => {
  const marpitStub = (props = {}) => ({
    themeSet: new ThemeSet(),
    lastGlobalDirectives: {},
    ...props,
  })

  const md = (marpitInstance = marpitStub()) =>
    new MarkdownIt('commonmark')
      .use(slide)
      .use(parseDirectives, { themeSet: marpitInstance.themeSet })
      .use(applyDirectives)
      .use(inlineSVG, marpitInstance)

  const render = (markdownIt, text) =>
    cheerio.load(markdownIt.render(text), {
      lowerCaseAttributeNames: false,
      lowerCaseTags: false,
    })

  it('wraps each section elements with inline SVG', () => {
    const $ = render(md(), '# test\n\n---\n\n# test')

    assert(
      $('svg[viewBox] > foreignObject[width][height] > section').length === 2
    )
  })

  context('with specified theme directive', () => {
    const themeSet = new ThemeSet()
    themeSet.add('/* @theme test */ section { width: 400px; height: 300px; }')

    const marpitInstance = (theme = 'test') =>
      marpitStub({
        themeSet,
        lastGlobalDirectives: { theme },
      })

    const expectedSelector = [
      'svg[viewBox="0 0 400 300"]',
      'foreignObject[width="400"][height="300"]',
      'section',
    ].join(' > ')

    it('assigns defined slide size as attributes', () => {
      const $ = render(md(marpitInstance()), '# test\n\n---\n\n# test')
      assert($(expectedSelector).length === 2)
    })

    context('when specified theme is not found', () => {
      it('does not assign defined slide size', () => {
        const $ = render(md(marpitInstance('foo')), '# test\n\n---\n\n# test')
        assert($(expectedSelector).length === 0)
      })

      context('with specified default theme', () => {
        const defaultTheme = Theme.fromCSS(
          'section { width: 160px; height: 90px; }',
          false
        )

        const defaultThemeSelector = [
          'svg[viewBox="0 0 160 90"]',
          'foreignObject[width="160"][height="90"]',
          'section',
        ].join(' > ')

        before(() => {
          themeSet.default = defaultTheme
        })

        after(() => {
          themeSet.default = undefined
        })

        it('assigns defined slide size in default theme', () => {
          const $ = render(md(marpitInstance('foo')), '# test\n\n---\n\n# test')
          assert($(defaultThemeSelector).length === 2)
        })
      })
    })
  })
})
