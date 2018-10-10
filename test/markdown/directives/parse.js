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
          expect(t.meta.marpitDirectives).toStrictEqual({})
      })
    })

    it('parses front-matter when option is true', () => {
      const parsed = md({ frontMatter: true }).parse(text)
      const slideTokens = parsed.filter(t => t.type === 'marpit_slide_open')

      expect(slideTokens).toHaveLength(2)
      expect(slideTokens[0].meta.marpitDirectives).toStrictEqual({
        theme: 'test_theme',
        class: 'first',
      })
      expect(slideTokens[1].meta.marpitDirectives).toStrictEqual({
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
        Inline<!-- theme: test_theme -->comment
        ***
        <!-- theme: undefined_theme -->
      `

      it('applies meta to all slides', () => {
        const parsed = md().parse(text)
        parsed.forEach(t => {
          if (t.type === 'marpit_slide_open')
            expect(t.meta.marpitDirectives).toStrictEqual(expected)
        })
      })

      it('applies global directives to Marpit instance', () => {
        md().parse(text)
        expect(marpitStub.lastGlobalDirectives).toStrictEqual(expected)

        md().parse('<!-- class: test -->')
        expect(marpitStub.lastGlobalDirectives).toStrictEqual({})
      })

      it('allows global directive name prefixed "$"', () => {
        md().parse('<!-- $theme: test_theme -->')
        expect(marpitStub.lastGlobalDirectives).toStrictEqual(expected)
      })

      it('marks directive comments as parsed', () => {
        const findToken = tk => tk.find(t => t.type === 'marpit_comment')

        const regularTheme = findToken(md().parse('<!-- theme: test_theme -->'))
        expect(regularTheme.meta.marpitCommentParsed).toBe('directive')

        const invalidTheme = findToken(md().parse('<!-- theme: test -->'))
        expect(invalidTheme.meta.marpitCommentParsed).toBe('directive')

        const regularComment = findToken(md().parse('<!-- regular comment -->'))
        expect(regularComment.meta.marpitCommentParsed).toBeUndefined()
      })
    })
  })

  describe('Local directives', () => {
    it('applies meta to the defined slide and followed slides', () => {
      const text = dedent`
        ***
        Inline<!-- class: test -->comment
        ***
        <!-- notDefined: directive -->
        <!-- @invalid_yaml@ -->
      `

      const parsed = md().parse(text)
      const [first, second, third] = parsed.reduce(
        (arr, t) => (t.type === 'marpit_slide_open' ? [...arr, t] : arr),
        []
      )

      expect(first.meta.marpitDirectives).toStrictEqual({})
      expect(second.meta.marpitDirectives).toStrictEqual({ class: 'test' })
      expect(third.meta.marpitDirectives).toStrictEqual({ class: 'test' })
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

          expect(first.meta.marpitDirectives).toStrictEqual({})
          expect(second.meta.marpitDirectives).toStrictEqual({ class: 'test' })
          expect(third.meta.marpitDirectives).toStrictEqual({})
        })
      }
    )

    context('with class directive', () => {
      const expected = { class: 'one two three' }

      it('supports class definition by array', () => {
        const flatParsed = md().parse('<!-- class: ["one", "two", "three"] -->')
        const [flatOpen] = flatParsed.filter(
          t => t.type === 'marpit_slide_open'
        )
        expect(flatOpen.meta.marpitDirectives).toMatchObject(expected)

        const multilineParsed = md().parse(dedent`
          ---
          class:
            - one
            - two
            - three
          ---
        `)
        const [multilineOpen] = multilineParsed.filter(
          t => t.type === 'marpit_slide_open'
        )
        expect(multilineOpen.meta.marpitDirectives).toMatchObject(expected)
      })
    })
  })
})
