import { load } from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import comment from '../../../src/markdown/comment'
import applyDirectives from '../../../src/markdown/directives/apply'
import parseDirectives from '../../../src/markdown/directives/parse'
import slide from '../../../src/markdown/slide'
import styleAssign from '../../../src/markdown/style/assign'
import styleParse from '../../../src/markdown/style/parse'

describe('Marpit style assign plugin', () => {
  const marpitStub = () => ({
    customDirectives: { global: {}, local: {} },
    options: {},
    themeSet: new Map(),
  })

  context('with inline style elements', () => {
    const md = (marpit) => {
      const instance = new MarkdownIt('commonmark')
      instance.marpit = marpit

      return instance.use(slide).use(styleParse).use(styleAssign)
    }

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
        const $ = load(
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
          const attrs = marpit.lastStyles.map((s) => s.match(matcher)[1])
          expect(attrs[0]).toBe(attrs[1])
        })
      })

      context('when the scoped style has @keyframes', () => {
        it('scopes keyframe name', () => {
          const marpit = marpitStub()
          md(marpit).render(dedent`
            <style scoped>
            @keyframes spin {
              from { transform: rotate(0deg); }
              80% { transform: rotate(390deg); }
              to { transform: rotate(360deg); }
            }
            </style>
          `)

          const css = marpit.lastStyles.join('\n')
          expect(css).toMatch(/@keyframes spin-\w+/)
          expect(css).not.toContain('data-marpit-scope-')
        })

        it('rewrites animation name in decls into scoped name', () => {
          const basic = marpitStub()
          md(basic).render(dedent`
            <style scoped>
            @keyframes abc {}
            .animation { animation-name: abc; }
            </style>
          `)

          const basicCss = basic.lastStyles.join('\n')
          const basicMatched = basicCss.match(/@keyframes (abc-\w+)/)
          expect(basicMatched).toBeTruthy()
          expect(basicCss).toContain(`animation-name: ${basicMatched[1]}`)

          // Divided keyframes & multiple animation names
          const divided = marpitStub()
          md(divided).render(dedent`
            <style scoped>@keyframes abc {}</style>
            <style scoped>.animation { animation-name: foo,abc ,bar; }</style>
          `)

          const dividedCss = divided.lastStyles.join('\n')
          const dividedMatched = dividedCss.match(/@keyframes (abc-\w+)/)
          expect(dividedMatched).toBeTruthy()
          expect(dividedCss).toContain(
            `animation-name: foo,${dividedMatched[1]} ,bar;`
          )

          // animation shorthands
          const shorthand = marpitStub()
          md(shorthand).render(dedent`
            <style scoped>
            /* Allow using scoped keyframes before defining */
            .anim3 { animation: 1s foo, 2s steps, 3s bar; }
            </style>
            <style scoped>
            @keyframes steps {}
            .anim1 { animation: steps 1s linear 0s infinite; }
            .anim2 { animation: 1s steps(6) 0s infinite steps; }
            </style>
          `)

          const shorthandCss = shorthand.lastStyles.join('\n')
          const shorthandMatched = shorthandCss.match(/@keyframes (steps-\w+)/)
          expect(shorthandMatched).toBeTruthy()
          expect(shorthandCss).toContain(
            `animation: ${shorthandMatched[1]} 1s linear 0s infinite;`
          )
          expect(shorthandCss).toContain(
            `animation: 1s steps(6) 0s infinite ${shorthandMatched[1]};`
          )
          expect(shorthandCss).toContain(
            `animation: 1s foo, 2s ${shorthandMatched[1]}, 3s bar;`
          )
        })

        it('does not scope keyframe name if not defined in scoped styles for the current slide', () => {
          const marpit = marpitStub()
          md(marpit).render(dedent`
            <style>@keyframes global-kf {}</style>
            <style scoped>.animation { animation-name: global-kf; }</style>
          `)

          const css = marpit.lastStyles.join('\n')
          expect(css).toContain('data-marpit-scope-')
          expect(css).toContain('animation-name: global-kf;')
        })

        it('scopes keyframes in @supports and @media queries', () => {
          const marpit = marpitStub()
          md(marpit).render(dedent`
            <style scoped>
            @supports (animation: foobar) {
              @media screen {
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .spin {
                  animation: 1s linear infinite spin;
                }
              }
            }
            </style>
          `)

          const css = marpit.lastStyles.join('\n')
          const matched = css.match(/@keyframes (spin-\w+)/)

          expect(matched).toBeTruthy()
          expect(css).toContain('data-marpit-scope-')
          expect(css).toContain(`animation: 1s linear infinite ${matched[1]};`)
        })
      })

      context('when the invalid CSS is passed', () => {
        it('ignores adding style to Marpit lastStyles property', () => {
          const marpit = marpitStub()
          md(marpit).render('<style scoped>b { invalid }</style>')

          expect(marpit.lastStyles).toHaveLength(0)
        })
      })
    })
  })

  context('with style global directive', () => {
    const md = (marpit) => {
      const instance = new MarkdownIt('commonmark')
      instance.marpit = marpit

      return instance
        .use(comment)
        .use(slide)
        .use(parseDirectives)
        .use(applyDirectives)
        .use(styleAssign)
    }

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
    const md = (marpit) => {
      const instance = new MarkdownIt('commonmark')
      instance.marpit = marpit

      return instance
        .use(comment)
        .use(styleParse)
        .use(slide)
        .use(parseDirectives)
        .use(applyDirectives)
        .use(styleAssign)
    }

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
