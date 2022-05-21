import { load } from 'cheerio'
import MarkdownIt from 'markdown-it'
import { Element } from '../../src/index'
import container from '../../src/markdown/container'

describe('Marpit container plugin', () => {
  const md = (containers) => {
    const instance = new MarkdownIt('commonmark')
    instance.marpit = { options: { container: containers } }

    return instance.use(container)
  }

  context('with empty', () => {
    it('has no effect on rendered HTML', () => {
      const $undefined = load(md().render('test'))
      expect($undefined('body > p').text()).toBe('test')

      const $emptyArray = load(md([]).render('test'))
      expect($emptyArray('body > p').text()).toBe('test')
    })
  })

  context('with single element', () => {
    const elm = new Element('div', { class: 'wrapper' })
    const obj = { tag: 'span', id: 'wrapper' }

    it('wraps rendered HTML by specified element', () => {
      const $element = load(md([elm]).render('test'))
      expect($element('body > div.wrapper > p').text()).toBe('test')

      const $object = load(md([obj]).render('test'))
      expect($object('body > span#wrapper > p').text()).toBe('test')
    })

    it('ignores in #renderInline', () => {
      const $ = load(md([elm]).renderInline(''))
      expect($('div.wrapper')).toHaveLength(0)
    })
  })

  context('with multiple elements', () => {
    const div = new Element('div', { id: 'one' })
    const span = new Element('span', { id: 'two' })
    const markdown = md([div, span])

    it('wraps rendered HTML by each elements', () => {
      const $ = load(markdown.render('test'))
      expect($('body > div#one > span#two > p').text()).toBe('test')
    })
  })
})
