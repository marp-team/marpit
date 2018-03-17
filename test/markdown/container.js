import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import { Element } from '../../src/index'
import container from '../../src/markdown/container'

describe('Marpit container plugin', () => {
  const md = (...args) => new MarkdownIt('commonmark').use(container, ...args)

  context('with empty', () => {
    it('has no effect on rendered HTML', () => {
      const $undefined = cheerio.load(md().render('test'))
      assert($undefined('body > p').text() === 'test')

      const $emptyArray = cheerio.load(md([]).render('test'))
      assert($emptyArray('body > p').text() === 'test')
    })
  })

  context('with single element', () => {
    const elm = new Element('div', { class: 'wrapper' })
    const obj = { tag: 'span', id: 'wrapper' }

    it('wraps rendered HTML by specified element', () => {
      const $element = cheerio.load(md([elm]).render('test'))
      assert($element('body > div.wrapper > p').text() === 'test')

      const $object = cheerio.load(md([obj]).render('test'))
      assert($object('body > span#wrapper > p').text() === 'test')
    })

    it('ignores in #renderInline', () => {
      const $ = cheerio.load(md([elm]).renderInline(''))
      assert($('div.wrapper').length === 0)
    })
  })

  context('with multiple elements', () => {
    const div = new Element('div', { id: 'one' })
    const span = new Element('span', { id: 'two' })
    const markdown = md([div, span])

    it('wraps rendered HTML by each elements', () => {
      const $ = cheerio.load(markdown.render('test'))
      assert($('body > div#one > span#two > p').text() === 'test')
    })
  })
})
