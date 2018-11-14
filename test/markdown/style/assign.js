import cheerio from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../../src/markdown/directives/apply'
import comment from '../../../src/markdown/comment'
import parseDirectives from '../../../src/markdown/directives/parse'
import slide from '../../../src/markdown/slide'
import styleAssign from '../../../src/markdown/style/assign'
import styleParse from '../../../src/markdown/style/parse'

describe('Marpit style assign plugin', () => {
  const marpitStub = (...opts) => ({
    options: { inlineStyle: true },
    themeSet: new Map(),
    ...opts,
  })

  context('with inline style elements', () => {
    const md = (marpit, opts = {}) =>
      new MarkdownIt('commonmark')
        .use(slide)
        .use(styleParse, marpit)
        .use(styleAssign, marpit, opts)

    it('assigns parsed styles to Marpit lastStyles property', () => {
      const marpit = marpitStub()
      md(marpit).render('<style>b { color: red; }</style>')

      expect(marpit.lastStyles).toStrictEqual(['b { color: red; }'])
    })

    it('ignores parsing style in #renderInline', () => {
      const marpit = marpitStub()
      const text = '<style>b { color: red; }</style>'

      expect(md(marpit).renderInline(text)).toBe(text)
      expect(marpit.lastStyles).toBeUndefined()
    })

    context('with scoped attribute', () => {
      it('assigns parsed styles to Marpit lastStyles property with scoped', () => {
        const marpit = marpitStub()
        const $ = cheerio.load(
          md(marpit).render('<style scoped>b { color: red; }</style>')
        )

        const [style] = marpit.lastStyles
        expect(style).toEqual(expect.stringContaining('b { color: red; }'))

        const scopeMatcher = style.match(/^section\[(data-marpit-scope-.{8})\]/)
        expect(scopeMatcher).toBeTruthy()
        expect($('section#1').is(`[${scopeMatcher[1]}]`)).toBe(true)
      })

      context('when style has selectors for section elements', () => {
        it('keeps original selectors and adds attribute selector for scoping', () => {
          const marpit = marpitStub()
          md(marpit).render(dedent`
            <style scoped>
              section.class, section#id, section[attr], section::before { color: red; }
            </style>
          `)

          const [style] = marpit.lastStyles
          expect(style).toMatch(/section\[(data-marpit-scope-.{8})\].class/)
          expect(style).toMatch(/section\[(data-marpit-scope-.{8})\]#id/)
          expect(style).toMatch(/section\[(data-marpit-scope-.{8})\]\[attr\]/)
          expect(style).toMatch(/section\[(data-marpit-scope-.{8})\]::before/)
        })
      })

      context('when multiple scoped styles are written in a same page', () => {
        it('uses the same unique attribute selector', () => {
          const marpit = marpitStub()
          md(marpit).render(dedent`
            <style scoped>b { color: red; }</style>
            <style scoped>i { color: blue; }</style>
          `)

          const matcher = /^section\[(data-marpit-scope-.{8})\]/
          const attrs = marpit.lastStyles.map(s => s.match(matcher)[1])
          expect(attrs[0]).toBe(attrs[1])
        })
      })

      context('when the invalid CSS is passed', () => {
        it('ignores adding style to Marpit lastStyles property', () => {
          const marpit = marpitStub()
          md(marpit).render('<style scoped>b { invalid }</style>')

          expect(marpit.lastStyles).toHaveLength(0)
        })
      })

      context('when supportScoped option is setting as false', () => {
        const marpit = marpitStub()
        const opts = { supportScoped: false }
        md(marpit, opts).render('<style scoped>b { color: red; }</style>')

        const [style] = marpit.lastStyles
        expect(style).not.toContain('data-marpit-scope')
      })
    })
  })

  context('with style global directive', () => {
    const md = marpit =>
      new MarkdownIt('commonmark')
        .use(comment)
        .use(slide)
        .use(parseDirectives, marpit)
        .use(applyDirectives)
        .use(styleAssign, marpit)

    it('assigns parsed style global directive to Marpit lastStyles property', () => {
      const marpit = marpitStub()
      md(marpit).render(dedent`
        <!--
        style: "b { color: red; }"
        -->
      `)

      expect(marpit.lastStyles).toStrictEqual(['b { color: red; }'])
    })
  })

  context('with muiltiple style elements and a style directive', () => {
    const md = marpit =>
      new MarkdownIt('commonmark')
        .use(comment)
        .use(styleParse, marpit)
        .use(slide)
        .use(parseDirectives, marpit)
        .use(applyDirectives)
        .use(styleAssign, marpit)

    it('assigns inline styles prior to directive style', () => {
      const marpit = marpitStub()
      md(marpit).render(dedent`
        <style>
          h2 { font-size: 2em; }
        </style>

        <style>
          h3 { font-size: 1em; }
        </style>

        <!--
        style: |-
          h1 { font-size: 3em; }
        -->
      `)

      expect(marpit.lastStyles).toStrictEqual([
        'h1 { font-size: 3em; }',
        'h2 { font-size: 2em; }',
        'h3 { font-size: 1em; }',
      ])
    })
  })
})
