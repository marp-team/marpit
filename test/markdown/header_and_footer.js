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

        expect(firstChild.get(0).tagName).toBe('header')
        expect(firstChild.html()).toBe('text')
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

        expect(header.find('strong')).toHaveLength(1)
        expect(header.find('em')).toHaveLength(1)
        expect(img).toHaveLength(1)
        expect(img.attr('src')).toBe('https://example.com/image.jpg')
      })
    })

    it('ignores invalid directives like defined as object', () => {
      const $ = cheerio.load(md().render('<!-- header: ["test"] -->'))
      expect($('header')).toHaveLength(0)
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

        expect(lastChild.get(0).tagName).toBe('footer')
        expect(lastChild.html()).toBe('text')
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

        expect(footer.find('strong')).toHaveLength(1)
        expect(footer.find('em')).toHaveLength(1)
        expect(img).toHaveLength(1)
        expect(img.attr('src')).toBe('https://example.com/image.jpg')
      })
    })

    it('ignores invalid directives like defined as object', () => {
      const $ = cheerio.load(md().render('<!-- footer: ["test"] -->'))
      expect($('footer')).toHaveLength(0)
    })
  })
})
