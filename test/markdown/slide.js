import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import slide from '../../src/markdown/slide'

describe('Marpit slide plugin', () => {
  const md = (...args) => new MarkdownIt('commonmark').use(slide, ...args)

  context('with default options', () => {
    const markdown = md()

    it('renders <section> tag with number anchor', () => {
      // Empty content
      const $ = cheerio.load(markdown.render(''))
      expect($('section#1')).toHaveLength(1)

      // Multi page
      const $multi = cheerio.load(markdown.render('# foo\n\n---\n\n## bar'))
      expect($multi('section')).toHaveLength(2)
      expect($multi('section#1 > h1').text()).toBe('foo')
      expect($multi('section#2 > h2').text()).toBe('bar')
    })

    it('ignores in #renderInline', () => {
      const $ = cheerio.load(md().renderInline(''))
      expect($('section')).toHaveLength(0)
    })
  })

  context('with attributes option', () => {
    const markdown = md({ attributes: { class: 'page', tabindex: -1 } })

    it('renders <section> tag with specified attributes', () => {
      const $ = cheerio.load(markdown.render(''))
      expect($('section.page#1[tabindex=-1]')).toHaveLength(1)

      const $multi = cheerio.load(markdown.render('# foo\n\n---\n\n## bar'))
      expect($multi('section.page#1[tabindex=-1] > h1').text()).toBe('foo')
      expect($multi('section.page#2[tabindex=-1] > h2').text()).toBe('bar')
    })
  })

  context('with anchor option', () => {
    context('with false', () => {
      const markdown = md({ anchor: false })

      it('renders <section> tag without id attribute', () => {
        const $ = cheerio.load(markdown.render(''))
        expect($('section:not([id])')).toHaveLength(1)
      })
    })

    context('with function', () => {
      const markdown = func => md({ anchor: func })

      it('renders <section> tag with id provided by custom function', () => {
        const $ = cheerio.load(markdown(i => `page${i + 1}`).render(''))
        expect($('section#page1')).toHaveLength(1)

        const $multi = cheerio.load(
          markdown(i => (i + 1) * 2).render('# foo\n\n---\n\n## bar')
        )
        expect($multi('section#2 > h1').text()).toBe('foo')
        expect($multi('section#4 > h2').text()).toBe('bar')
      })
    })
  })
})
