import assert from 'assert'
import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import { Element } from '../../src/index'
import slide from '../../src/markdown/slide'
import slideContainer from '../../src/markdown/slide_container'

describe('Marpit slide container plugin', () => {
  const md = (...args) =>
    new MarkdownIt('commonmark').use(slide).use(slideContainer, ...args)

  context('with empty', () => {
    it('has no effect on rendered HTML', () => {
      const $undefined = cheerio.load(md().render('test'))
      assert($undefined('body > section > p').text() === 'test')

      const $emptyArray = cheerio.load(md([]).render('test'))
      assert($emptyArray('body > section > p').text() === 'test')
    })
  })

  context('with single element', () => {
    const elm = new Element('div', { class: 'wrapper' })

    it('wraps each sections by specified element', () => {
      const $ = cheerio.load(md([elm]).render('test'))
      assert($('body > div.wrapper > section > p').text() === 'test')

      const $multi = cheerio.load(md([elm]).render('foo\n\n---\n\nbar'))
      assert($multi('body > div.wrapper > section > p').length === 2)
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

    it('wraps each sections HTML by each elements', () => {
      const $ = cheerio.load(markdown.render('foo\n\n---\n\nbar'))
      assert($('body > div#one > span#two > section > p').length === 2)
    })
  })
})
