import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../src/markdown/directives/apply'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'
import marginals from '../../src/markdown/marginals'

describe('Marpit marginals plugin', () => {
  const themeSet = new Map()
  themeSet.set('test_theme', true)

  const marpitStub = (props = {}) => ({
    themeSet,
    lastGlobalDirectives: {},
    ...props,
  })

  const md = (marpitInstance = marpitStub()) =>
    new MarkdownIt('commonmark')
      .use(slide)
      .use(parseDirectives, { themeSet: marpitInstance.themeSet })
      .use(applyDirectives)
      .use(marginals)

  describe('Header local directive', () => {
    const markdown = '<!-- header: text -->\n# Page 1\n\n---\n\n# Page 2'

    it('appends <header> element to each slide', () => {
      const $ = cheerio.load(md().render(markdown))

      $('section').each((i, elm) => {
        const children = $(elm).children()

        assert(children.first().tagName === 'header')
        assert(children.first().html() === 'text')
      })
    })
  })

  describe('Footer local directive', () => {
    const markdown = '<!-- footer: text -->\n# Page 1\n\n---\n\n# Page 2'

    it('prepends <footer> element to each slide', () => {
      const $ = cheerio.load(md().render(markdown))

      $('section').each((i, elm) => {
        const children = $(elm).children()

        assert(children.last().tagName === 'footer')
        assert(children.last().html() === 'text')
      })
    })
  })
})
