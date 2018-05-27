import assert from 'assert'
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
    const md = marpit =>
      new MarkdownIt('commonmark')
        .use(styleParse, marpit)
        .use(styleAssign, marpit)

    it('assigns parsed styles to Marpit lastStyles property', () => {
      const marpit = marpitStub()
      md(marpit).render('<style>b { color: red; }</style>')

      assert.deepStrictEqual(marpit.lastStyles, ['b { color: red; }'])
    })

    it('ignores parsing style in #renderInline', () => {
      const marpit = marpitStub()
      const text = '<style>b { color: red; }</style>'

      assert(md(marpit).renderInline(text) === text)
      assert(!marpit.lastStyles)
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

      assert.deepStrictEqual(marpit.lastStyles, ['b { color: red; }'])
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

      assert.deepStrictEqual(marpit.lastStyles, [
        'h1 { font-size: 3em; }',
        'h2 { font-size: 2em; }',
        'h3 { font-size: 1em; }',
      ])
    })
  })
})
