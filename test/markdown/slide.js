import assert from 'assert'
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
      assert($('section#1').length === 1)

      // Multi page
      const $multi = cheerio.load(markdown.render('# foo\n\n---\n\n## bar'))
      assert($multi('section').length === 2)
      assert($multi('section#1 > h1').text() === 'foo')
      assert($multi('section#2 > h2').text() === 'bar')
    })

    it('ignores in #renderInline', () => {
      const $ = cheerio.load(md().renderInline(''))
      assert($('section').length === 0)
    })
  })

  context('with attributes option', () => {
    const markdown = md({ attributes: { class: 'page', tabindex: -1 } })

    it('renders <section> tag with specified attributes', () => {
      const $ = cheerio.load(markdown.render(''))
      assert($('section.page#1[tabindex=-1]').length === 1)

      const $multi = cheerio.load(markdown.render('# foo\n\n---\n\n## bar'))
      assert($multi('section.page#1[tabindex=-1] > h1').text() === 'foo')
      assert($multi('section.page#2[tabindex=-1] > h2').text() === 'bar')
    })
  })

  context('with anchor option', () => {
    context('with false', () => {
      const markdown = md({ anchor: false })

      it('renders <section> tag without id attribute', () => {
        const $ = cheerio.load(markdown.render(''))
        assert($('section:not([id])').length === 1)
      })
    })

    context('with function', () => {
      const markdown = func => md({ anchor: func })

      it('renders <section> tag with id provided by custom function', () => {
        const $ = cheerio.load(markdown(i => `page${i + 1}`).render(''))
        assert($('section#page1').length === 1)

        const $multi = cheerio.load(
          markdown(i => (i + 1) * 2).render('# foo\n\n---\n\n## bar')
        )
        assert($multi('section#2 > h1').text() === 'foo')
        assert($multi('section#4 > h2').text() === 'bar')
      })
    })
  })
})
