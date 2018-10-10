import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import applyDirectives from '../../src/markdown/directives/apply'
import collectComment from '../../src/markdown/collect_comment'
import comment from '../../src/markdown/comment'
import parseDirectives from '../../src/markdown/directives/parse'
import slide from '../../src/markdown/slide'

describe('Marpit collect comment plugin', () => {
  const themeSet = new Map()
  themeSet.set('default', true)

  const marpitStub = () => ({
    themeSet,
    lastGlobalDirectives: {},
  })

  const md = marpitInstance =>
    new MarkdownIt('commonmark')
      .use(comment)
      .use(slide)
      .use(parseDirectives, { themeSet: marpitInstance.themeSet })
      .use(applyDirectives)
      .use(collectComment, marpitInstance)

  const text = dedent`
    ---
    frontMatter: would not correct
    ---

    # First page

    <!-- This is comment -->
    <!--
    multiline
    comment
    -->

    ---

    # Second page

    <!-- theme: default -->
    <!--
    color: white
    note: Comment would not collect if yaml has included correct directive.
    -->
    <!--
    note: "Comment would collect if yaml has only invalid directive."
    -->

    ---

    # Third page

    <!-- theme: is-invalid-theme-but-not-collect-because-theme-iss-correct-directive -->

    ---

    # Fourth <!-- inline comment --> page
  `

  it('ignores in #renderInline', () => {
    const marpit = marpitStub()
    md(marpit).renderInline(text)

    expect(marpit.lastComments).toBeUndefined()
  })

  it("collects comments and store to Marpit's lastComments member", () => {
    const marpit = marpitStub()
    md(marpit).render(text)

    const { lastComments } = marpit

    expect(lastComments).toHaveLength(4)
    expect(lastComments[0]).toStrictEqual([
      'This is comment',
      'multiline\ncomment',
    ])
    expect(lastComments[1]).toStrictEqual([
      expect.stringContaining(
        'Comment would collect if yaml has only invalid directive'
      ),
    ])
    expect(lastComments[2]).toHaveLength(0)
    expect(lastComments[3]).toStrictEqual(['inline comment'])
  })

  context(
    'when comment token is marked marpitCommentParsed meta in other plugin',
    () => {
      it('ignores collecting comment', () => {
        const marpit = marpitStub()

        md(marpit)
          .use(mdIt => {
            mdIt.core.ruler.before(
              'marpit_slide',
              'marpit_test_inject',
              state => {
                const markParsed = token => {
                  token.meta = {
                    ...(token.meta || {}),
                    marpitCommentParsed: 'test',
                  }
                }

                for (const token of state.tokens) {
                  if (token.content === 'This is comment') {
                    markParsed(token)
                  } else if (token.type === 'inline') {
                    for (const t of token.children)
                      if (t.content === 'inline comment') markParsed(t)
                  }
                }
              }
            )
          })
          .render(text)

        const { lastComments } = marpit

        expect(lastComments[0]).toHaveLength(1)
        expect(lastComments[0]).not.toContain('This is comment')
        expect(lastComments[3]).toHaveLength(0)
      })
    }
  )
})
