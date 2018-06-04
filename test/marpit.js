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
      assert(instance.options.backgroundSyntax === true)
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

  describe('get #markdownItPlugins', () => {
    it('provides markdown-it plugins with its compatible interface', () => {
      const marpit = new Marpit()
      marpit.themeSet.add('/* @theme foobar */')

      const md = new MarkdownIt().use(marpit.markdownItPlugins)
      md.render('<!-- theme: foobar -->')

      assert(marpit.lastGlobalDirectives.theme === 'foobar')
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
          section { --theme-defined: declaration; }
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
            assert(countDecl(ret.root, '--theme-defined') === 1)
          })
      })
    })

    context('with backgroundSyntax option in instance', () => {
      const instance = backgroundSyntax => new Marpit({ backgroundSyntax })

      it('renders img tag when backgroundSyntax is false', () => {
        const $ = cheerio.load(instance(false).render('![bg](test)').html)
        assert($('img').length === 1)
      })

      it('has background-image style on section tag when backgroundSyntax is true', () => {
        const $ = cheerio.load(instance(true).render('![bg](test)').html)

        return postcss()
          .process($('section').attr('style'), { from: undefined })
          .then(ret =>
            ret.root.walkDecls('background-image', decl => {
              assert(decl.value === 'url("test")')
            })
          )
      })
    })

    context('with filters option in instance', () => {
      const instance = filters => new Marpit({ filters })

      it('does not apply filter style when filters is false', () => {
        const $ = cheerio.load(instance(false).render('![blur](test)').html)
        const style = $('img').attr('style') || ''

        assert(!style.includes('filter:blur'))
      })

      it('applies filter style when filters is true', () => {
        const $ = cheerio.load(instance(true).render('![blur](test)').html)
        const style = $('img').attr('style') || ''

        assert(style.includes('filter:blur'))
      })
    })

    context('with inlineStyle option in instance', () => {
      const instance = inlineStyle => {
        const marpit = new Marpit({ inlineStyle })

        marpit.themeSet.add('/* @theme valid-theme */')
        return marpit
      }

      const markdown =
        '<style>@import "valid-theme";\nsection { --style: appended; }</style>'

      it('keeps inline style in HTML when inlineStyle is false', () => {
        const rendered = instance(false).render(markdown)
        const $ = cheerio.load(rendered.html)

        assert($('style').length === 1)
        assert(!rendered.css.includes('--style: appended;'))
      })

      it('appends style to css with processing when inlineStyle is true', () => {
        const rendered = instance(true).render(markdown)
        const $ = cheerio.load(rendered.html)

        assert($('style').length === 0)
        assert(rendered.css.includes('--style: appended;'))
        assert(rendered.css.includes('/* @import "valid-theme"; */'))
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

  describe('#renderStyle', () => {
    it('returns the result of themeSet#pack', () => {
      const instance = new Marpit()
      instance.themeSet.pack = (theme, opts) => {
        assert(Object.keys(opts).includes('containers'))
        assert(Object.keys(opts).includes('inlineSVG'))
        assert(Object.keys(opts).includes('printable'))

        return `style of ${theme}`
      }

      assert(instance.renderStyle('test-theme') === 'style of test-theme')
    })
  })
})
