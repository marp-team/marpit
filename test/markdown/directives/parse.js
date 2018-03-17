import assert from 'assert'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import comment from '../../../src/markdown/comment'
import parseDirectives from '../../../src/markdown/directives/parse'
import slide from '../../../src/markdown/slide'

describe('Marpit directives parse plugin', () => {
  const themeSetStub = new Map()
  const marpitStub = { themeSet: themeSetStub }
  themeSetStub.set('test_theme', true)

  const md = (...args) =>
    new MarkdownIt('commonmark')
      .use(comment)
      .use(slide)
      .use(parseDirectives, marpitStub, ...args)

  context('with frontMatter option', () => {
    const text = dedent`
      ---
      theme: test_theme
      class: all
      _class: first
      ---
      ***
    `

    it('does not parse front-matter when option is false', () => {
      const parsed = md({ frontMatter: false }).parse(text)

      parsed.forEach(t => {
        if (t.type === 'marpit_slide_open')
          assert.deepStrictEqual(t.meta.marpitDirectives, {})
      })
    })

    it('parses front-matter when option is true', () => {
      const parsed = md({ frontMatter: true }).parse(text)
      const slideTokens = parsed.filter(t => t.type === 'marpit_slide_open')

      assert(slideTokens.length === 2)
      assert.deepStrictEqual(slideTokens[0].meta.marpitDirectives, {
        theme: 'test_theme',
        class: 'first',
      })
      assert.deepStrictEqual(slideTokens[1].meta.marpitDirectives, {
        theme: 'test_theme',
        class: 'all',
      })
    })
  })

  describe('Global directives', () => {
    const expected = { theme: 'test_theme' }

    context('with theme directive', () => {
      const text = dedent`
        <!-- Theme accepts that only defined in Marpit#themeSet -->
        ***
        <!-- theme: test_theme -->
        ***
        <!-- theme: undefined_theme -->
      `

      it('applies meta to all slides', () => {
        const parsed = md().parse(text)
        parsed.forEach(t => {
          if (t.type === 'marpit_slide_open')
            assert.deepStrictEqual(t.meta.marpitDirectives, expected)
        })
      })

      it('applies global directives to Marpit instance', () => {
        md().parse(text)
        assert.deepStrictEqual(marpitStub.lastGlobalDirectives, expected)

        md().parse('<!-- class: test -->')
        assert.deepStrictEqual(marpitStub.lastGlobalDirectives, {})
      })

      it('allows global directive name prefixed "$"', () => {
        md().parse('<!-- $theme: test_theme -->')
        assert.deepStrictEqual(marpitStub.lastGlobalDirectives, expected)
      })
    })
  })

  describe('Local directives', () => {
    it('applies meta to the defined slide and followed slides', () => {
      const text = dedent`
        ***
        <!-- class: test -->
        ***
        <!-- notDefined: directive -->
        <!-- @invalid_yaml@ -->
      `

      const parsed = md().parse(text)
      const [first, second, third] = parsed.reduce(
        (arr, t) => (t.type === 'marpit_slide_open' ? [...arr, t] : arr),
        []
      )

      assert.deepStrictEqual(first.meta.marpitDirectives, {})
      assert.deepStrictEqual(second.meta.marpitDirectives, { class: 'test' })
      assert.deepStrictEqual(third.meta.marpitDirectives, { class: 'test' })
    })

    context(
      'when the name of local directive starts with underscore (Spot directives)',
      () => {
        const text = dedent`
          ***
          <!-- _class: test -->
          ***
          <!-- _notDefined: directive -->
        `

        it('applies meta to the defined slide only', () => {
          const parsed = md().parse(text)
          const [first, second, third] = parsed.reduce(
            (arr, t) => (t.type === 'marpit_slide_open' ? [...arr, t] : arr),
            []
          )

          assert.deepStrictEqual(first.meta.marpitDirectives, {})
          assert.deepStrictEqual(second.meta.marpitDirectives, {
            class: 'test',
          })
          assert.deepStrictEqual(third.meta.marpitDirectives, {})
        })
      }
    )
  })
})
