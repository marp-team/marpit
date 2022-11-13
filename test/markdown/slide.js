import { load } from 'cheerio'
import MarkdownIt from 'markdown-it'
import { slide } from '../../src/markdown/slide'

describe('Marpit slide plugin', () => {
  const md = (...args) => {
    const instance = new MarkdownIt('commonmark')
    instance.marpit = {}

    return instance.use(slide, ...args)
  }
  const multiMd = '# foo\n\n---\n\n## bar'

  context('with default options', () => {
    const markdown = md()

    it('renders <section> tag with number anchor', () => {
      // Empty content
      const $ = load(markdown.render(''))
      expect($('section#1')).toHaveLength(1)

      // Multi page
      const $multi = load(markdown.render(multiMd))
      expect($multi('section')).toHaveLength(2)
      expect($multi('section#1 > h1').text()).toBe('foo')
      expect($multi('section#2 > h2').text()).toBe('bar')
    })

    it('maps corresponded line of slide', () => {
      const [open] = markdown.parse('')
      expect(open.map).toStrictEqual([0, 1])

      const [first, second] = markdown
        .parse(multiMd)
        .filter((t) => t.type === 'marpit_slide_open')

      expect(first.map).toStrictEqual([0, 1])
      expect(second.map).toStrictEqual([2, 3])
    })

    it('ignores in #renderInline', () => {
      const $ = load(md().renderInline(''))
      expect($('section')).toHaveLength(0)
    })

    it('does not parse rulers that have in children of contents', () => {
      const $list = load(markdown.render('* ---'))
      expect($list('section')).toHaveLength(1)

      const $quote = load(markdown.render('> ---'))
      expect($quote('section')).toHaveLength(1)
    })
  })

  context('with attributes option', () => {
    const markdown = md({ attributes: { class: 'page', tabindex: -1 } })

    it('renders <section> tag with specified attributes', () => {
      const $ = load(markdown.render(''))
      expect($('section.page#1[tabindex=-1]')).toHaveLength(1)

      const $multi = load(markdown.render(multiMd))
      expect($multi('section.page#1[tabindex=-1] > h1').text()).toBe('foo')
      expect($multi('section.page#2[tabindex=-1] > h2').text()).toBe('bar')
    })
  })

  context('with anchor option', () => {
    context('with false', () => {
      const markdown = md({ anchor: false })

      it('renders <section> tag without id attribute', () => {
        const $ = load(markdown.render(''))
        expect($('section:not([id])')).toHaveLength(1)
      })
    })

    context('with function', () => {
      const markdown = (func) => md({ anchor: func })

      it('renders <section> tag with id provided by custom function', () => {
        const $ = load(markdown((i) => `page${i + 1}`).render(''))
        expect($('section#page1')).toHaveLength(1)

        const $multi = load(markdown((i) => (i + 1) * 2).render(multiMd))
        expect($multi('section#2 > h1').text()).toBe('foo')
        expect($multi('section#4 > h2').text()).toBe('bar')
      })
    })
  })
})
