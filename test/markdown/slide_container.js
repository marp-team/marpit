import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import { Element } from '../../src/index'
import slide from '../../src/markdown/slide'
import slideContainer from '../../src/markdown/slide_container'

describe('Marpit slide container plugin', () => {
  const md = (containers) => {
    const instance = new MarkdownIt('commonmark')
    instance.marpit = { options: { slideContainer: containers } }

    return instance.use(slide).use(slideContainer)
  }

  context('with empty', () => {
    it('has no effect on rendered HTML', () => {
      const $undefined = cheerio.load(md().render('test'))
      expect($undefined('body > section > p').text()).toBe('test')

      const $emptyArray = cheerio.load(md([]).render('test'))
      expect($emptyArray('body > section > p').text()).toBe('test')
    })
  })

  context('with single element', () => {
    const elm = new Element('div', { class: 'wrapper' })

    it('wraps each sections by specified element', () => {
      const $ = cheerio.load(md([elm]).render('test'))
      expect($('body > div.wrapper > section > p').text()).toBe('test')

      const $multi = cheerio.load(md([elm]).render('foo\n\n---\n\nbar'))
      expect($multi('body > div.wrapper > section > p')).toHaveLength(2)
    })

    it('ignores in #renderInline', () => {
      const $ = cheerio.load(md([elm]).renderInline(''))
      expect($('div.wrapper')).toHaveLength(0)
    })
  })

  context('with multiple elements', () => {
    const div = new Element('div', { id: 'one' })
    const span = new Element('span', { id: 'two' })
    const markdown = md([div, span])

    it('wraps each sections HTML by each elements', () => {
      const $ = cheerio.load(markdown.render('foo\n\n---\n\nbar'))
      expect($('body > div#one > span#two > section > p')).toHaveLength(2)
    })
  })
})
