import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../../src/markdown/directives/apply'
import parseDirectives from '../../../src/markdown/directives/parse'
import slide from '../../../src/markdown/slide'

describe('Marpit directives apply plugin', () => {
  const themeSetStub = new Map()
  themeSetStub.set('test_theme', true)

  const md = (...args) =>
    new MarkdownIt('commonmark')
      .use(slide)
      .use(parseDirectives, { themeSet: themeSetStub })
      .use(applyDirectives, ...args)

  const mdForTest = (...args) =>
    md(...args).use(mdInstance => {
      mdInstance.core.ruler.before(
        'marpit_directives_apply',
        'marpit_directives_apply_test',
        state => {
          state.tokens.forEach(token => {
            if (token.meta && token.meta.marpitDirectives) {
              // Internal directive
              token.meta.marpitDirectives.unknownDir = 'directive'
            }
          })
        }
      )
    })

  const text = dedent`
    ---
    class: test
    theme: test_theme
    ---
  `

  it('applies directives to slide node', () => {
    const $ = cheerio.load(mdForTest().render(text))
    const section = $('section').first()

    assert(section.is('.test'))
    assert(section.attr('data-class') === 'test')
    assert(section.attr('data-theme') === 'test_theme')
    assert(!section.attr('data-unknown-dir'))
    assert(section.attr('style').includes('--class:test;'))
    assert(section.attr('style').includes('--theme:test_theme;'))
    assert(!section.attr('style').includes('--unknown-dir:directive;'))
  })

  context('with dataset option as false', () => {
    const opts = { dataset: false }

    it('does not apply directives to data attributes', () => {
      const $ = cheerio.load(mdForTest(opts).render(text))
      const section = $('section').first()

      assert(!section.attr('data-class'))
      assert(!section.attr('data-theme'))
    })
  })

  context('with css option as false', () => {
    const opts = { css: false }

    it('does not apply directives to CSS custom properties', () => {
      const $ = cheerio.load(mdForTest(opts).render(text))
      const section = $('section').first()

      assert(!section.attr('style'))
    })
  })

  context('with includeInternal option as true', () => {
    const opts = { includeInternal: true }

    it('it applies together with unknown (internal) directive', () => {
      const $ = cheerio.load(mdForTest(opts).render(text))
      const section = $('section').first()

      assert(section.attr('data-unknown-dir') === 'directive')
      assert(section.attr('style').includes('--unknown-dir:directive;'))
    })
  })
})
