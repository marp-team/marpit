import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../src/markdown/directives/apply'
import comment from '../../src/markdown/comment'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'
import headerAndFooter from '../../src/markdown/header_and_footer'

describe('Marpit header and footer plugin', () => {
  const themeSet = new Map()
  themeSet.set('test_theme', true)

  const marpitStub = (props = {}) => ({
    themeSet,
    lastGlobalDirectives: {},
    ...props,
  })

  const md = (marpitInstance = marpitStub()) =>
    new MarkdownIt('commonmark')
      .use(comment)
      .use(slide)
      .use(parseDirectives, { themeSet: marpitInstance.themeSet })
      .use(applyDirectives)
      .use(headerAndFooter)

  describe('Header local directive', () => {
    const markdown = header =>
      `<!-- header: "${header}" -->\n# Page 1\n\n---\n\n# Page 2`

    it('appends <header> element to each slide', () => {
      const $ = cheerio.load(md().render(markdown('text')))

      $('section').each((i, elm) => {
        const children = $(elm).children()
        const firstChild = children.first()

        assert(firstChild.get(0).tagName === 'header')
        assert(firstChild.html() === 'text')
      })
    })

    it('renders tags when it includes inline markdown syntax', () => {
      const mdText = '**bold** _italic_ ![image](https://example.com/image.jpg)'
      const $ = cheerio.load(md().render(markdown(mdText)))

      $('section').each((i, elm) => {
        const header = $(elm)
          .children()
          .first()

        const img = header.find('img')

        assert(header.find('strong').length === 1)
        assert(header.find('em').length === 1)
        assert(img.length === 1)
        assert(img.attr('src') === 'https://example.com/image.jpg')
      })
    })
  })

  describe('Footer local directive', () => {
    const markdown = footer =>
      `<!-- footer: "${footer}" -->\n# Page 1\n\n---\n\n# Page 2`

    it('prepends <footer> element to each slide', () => {
      const $ = cheerio.load(md().render(markdown('text')))

      $('section').each((i, elm) => {
        const children = $(elm).children()
        const lastChild = children.last()

        assert(lastChild.get(0).tagName === 'footer')
        assert(lastChild.html() === 'text')
      })
    })

    it('renders tags when it includes inline markdown syntax', () => {
      const mdText = '**bold** _italic_ ![image](https://example.com/image.jpg)'
      const $ = cheerio.load(md().render(markdown(mdText)))

      $('section').each((i, elm) => {
        const footer = $(elm)
          .children()
          .last()

        const img = footer.find('img')

        assert(footer.find('strong').length === 1)
        assert(footer.find('em').length === 1)
        assert(img.length === 1)
        assert(img.attr('src') === 'https://example.com/image.jpg')
      })
    })
  })
})
