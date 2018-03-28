import assert from 'assert'
import cheerio from 'cheerio'
import dedent from 'dedent'
import postcss from 'postcss'
import MarkdownIt from 'markdown-it'
import { Marpit, ThemeSet } from '../src/index'

describe('Marpit', () => {
  describe('#constructor', () => {
    const instance = new Marpit()

    it('has default options', () => {
      assert(instance.options.container.tag === 'div')
      assert(instance.options.container.class === 'marpit')
      assert(instance.options.markdown === 'commonmark')
      assert(instance.options.printable === true)
      assert(instance.options.slideContainer === undefined)
      assert(instance.options.inlineSVG === false)
    })

    it('has themeSet property', () => {
      assert(instance.themeSet instanceof ThemeSet)
      assert(instance.themeSet.size === 0)
    })

    it('has markdown property', () => {
      assert(instance.markdown instanceof MarkdownIt)
    })
  })

  describe('#render', () => {
    it('returns the object contains html and css member', () => {
      const markdown = '# Hello'
      const instance = new Marpit()

      instance.renderMarkdown = md => {
        assert(md === markdown)
        instance.lastGlobalDirectives = { theme: 'dummy-theme' }
        return 'HTML'
      }

      instance.themeSet.pack = (theme, opts) => {
        assert(theme === 'dummy-theme')
        assert(opts.containers.length === 1)
        assert(opts.containers[0].tag === 'div')
        assert(opts.containers[0].class === 'marpit')
        assert(opts.inlineSVG === false)
        assert(opts.printable === true)
        return 'CSS'
      }

      const ret = instance.render(markdown)
      assert.deepStrictEqual(ret, { html: 'HTML', css: 'CSS' })
    })

    context('with inlineSVG option in instance', () => {
      const instance = inlineSVG => {
        const marpit = new Marpit({ inlineSVG })

        marpit.themeSet.default = marpit.themeSet.add(dedent`
          /* @theme test */
          section { position: relative; transform: scale(0.9); }
        `)
        return marpit
      }

      const countDecl = (target, decl) => {
        let declCount = 0
        target.walkDecls(decl, () => {
          declCount += 1
        })
        return declCount
      }

      it('has not svg when inlineSVG is false', () => {
        const rendered = instance(false).render('# Hi')
        const $ = cheerio.load(rendered.html, { lowerCaseTags: false })

        assert($('svg').length === 0)
      })

      it('wraps section with svg when inlineSVG is true', () => {
        const rendered = instance(true).render('# Hi')
        const $ = cheerio.load(rendered.html, { lowerCaseTags: false })

        return postcss()
          .process(rendered.css, { from: undefined })
          .then(ret => {
            assert($('svg > foreignObject > section > h1').length === 1)
            assert(countDecl(ret.root, 'position') === 1)
            assert(countDecl(ret.root, 'transform') === 1)
          })
      })

      it('comments out basic styles when inlineSVG is a string "workaround"', () => {
        const rendered = instance('workaround').render('# Hi')
        const $ = cheerio.load(rendered.html, { lowerCaseTags: false })

        return postcss()
          .process(rendered.css, { from: undefined })
          .then(ret => {
            assert($('svg > foreignObject > section > h1').length === 1)
            assert(countDecl(ret.root, 'position') === 0)
            assert(countDecl(ret.root, 'transform') === 0)
          })
      })
    })
  })

  describe('#renderMarkdown', () => {
    it('returns the result of markdown#render', () => {
      const instance = new Marpit()
      instance.markdown.render = md => `test of ${md}`

      assert(instance.renderMarkdown('render') === 'test of render')
    })
  })
})
