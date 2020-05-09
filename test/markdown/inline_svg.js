import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import { Theme, ThemeSet } from '../../src/index'
import inlineSVG from '../../src/markdown/inline_svg'
import slide from '../../src/markdown/slide'
import skipThemeValidationSymbol from '../../src/theme/symbol'

describe('Marpit inline SVG plugin', () => {
  const marpitStub = (props = {}) => ({
    customDirectives: { global: {}, local: {} },
    themeSet: new ThemeSet(),
    lastGlobalDirectives: {},
    options: { inlineSVG: true },
    ...props,
  })

  const md = (marpitInstance = marpitStub()) => {
    const instance = new MarkdownIt('commonmark')
    instance.marpit = marpitInstance

    return instance
      .use(slide)
      .use((pluginMd) =>
        pluginMd.core.ruler.push('marpit_directives_parse', () => {})
      )
      .use(inlineSVG)
  }

  const render = (markdownIt, text, inline = false) => {
    const method = inline ? markdownIt.renderInline : markdownIt.render

    return cheerio.load(method.call(markdownIt, text), {
      lowerCaseAttributeNames: false,
      lowerCaseTags: false,
    })
  }

  it('wraps each section elements with inline SVG', () => {
    const $ = render(md(), '# test\n\n---\n\n# test')

    expect(
      $(
        'svg[viewBox][data-marpit-svg] > foreignObject[width][height] > section'
      )
    ).toHaveLength(2)
  })

  it('ignores in #renderInline', () => {
    const $ = render(md(), '# test\n\n---\n\n# test', true)
    expect($('svg')).toHaveLength(0)
  })

  it('ignores when Marpit inlineSVG option is false', () => {
    const marpitStubInstance = marpitStub({ options: { inlineSVG: false } })
    const $ = render(md(marpitStubInstance), '# test\n\n---\n\n# test')
    expect($('svg')).toHaveLength(0)
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
      expect($(expectedSelector)).toHaveLength(2)
    })

    context('when specified theme is not found', () => {
      it('does not assign defined slide size', () => {
        const $ = render(md(marpitInstance('foo')), '# test\n\n---\n\n# test')
        expect($(expectedSelector)).toHaveLength(0)
      })

      context('with specified default theme', () => {
        const defaultTheme = Theme.fromCSS(
          'section { width: 160px; height: 90px; }',
          { [skipThemeValidationSymbol]: true }
        )

        const defaultThemeSelector = [
          'svg[viewBox="0 0 160 90"]',
          'foreignObject[width="160"][height="90"]',
          'section',
        ].join(' > ')

        beforeEach(() => {
          themeSet.default = defaultTheme
        })

        afterEach(() => {
          themeSet.default = undefined
        })

        it('assigns defined slide size in default theme', () => {
          const $ = render(md(marpitInstance('foo')), '# test\n\n---\n\n# test')
          expect($(defaultThemeSelector)).toHaveLength(2)
        })
      })
    })
  })
})
