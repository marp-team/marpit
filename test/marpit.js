import cheerio from 'cheerio'
import dedent from 'dedent'
import postcss from 'postcss'
import MarkdownIt from 'markdown-it'
import { Marpit, ThemeSet } from '../src/index'

describe('Marpit', () => {
  // Suppress PostCSS warning while running test
  const postcssInstance = postcss([() => {}])

  describe('#constructor', () => {
    const instance = new Marpit()

    it('has default options', () => {
      expect(instance.options.container.tag).toBe('div')
      expect(instance.options.container.class).toBe('marpit')
      expect(instance.options.backgroundSyntax).toBe(true)
      expect(instance.options.markdown).toBe('commonmark')
      expect(instance.options.printable).toBe(true)
      expect(instance.options.slideContainer).toBe(false)
      expect(instance.options.inlineSVG).toBe(false)
    })

    it('marks options property as immutable', () => {
      expect(() => {
        instance.options = { updated: true }
      }).toThrow(TypeError)

      expect(() => {
        instance.options.printable = false
      }).toThrow(TypeError)
    })

    it('has themeSet property', () => {
      expect(instance.themeSet).toBeInstanceOf(ThemeSet)
      expect(instance.themeSet.size).toBe(0)
    })

    it('has markdown property', () => {
      expect(instance.markdown).toBeInstanceOf(MarkdownIt)
    })
  })

  describe('get #markdownItPlugins', () => {
    it('provides markdown-it plugins with its compatible interface', () => {
      const marpit = new Marpit()
      marpit.themeSet.add('/* @theme foobar */')

      const md = new MarkdownIt().use(marpit.markdownItPlugins)
      md.render('<!-- theme: foobar -->')

      expect(marpit.lastGlobalDirectives.theme).toBe('foobar')
    })
  })

  describe('#render', () => {
    it('returns the object contains html, css, and comments', () => {
      const markdown = '# Hello'
      const instance = new Marpit()

      instance.renderMarkdown = md => {
        expect(md).toBe(markdown)
        instance.lastGlobalDirectives = { theme: 'dummy-theme' }
        instance.lastComments = [['A', 'B', 'C']]
        return 'HTML'
      }

      instance.themeSet.pack = (theme, opts) => {
        expect(theme).toBe('dummy-theme')
        expect(opts.containers).toHaveLength(1)
        expect(opts.containers[0].tag).toBe('div')
        expect(opts.containers[0].class).toBe('marpit')
        expect(opts.inlineSVG).toBe(false)
        expect(opts.printable).toBe(true)
        return 'CSS'
      }

      expect(instance.render(markdown)).toStrictEqual({
        html: 'HTML',
        css: 'CSS',
        comments: [['A', 'B', 'C']],
      })
    })

    context('with env argument', () => {
      it('passes env option to markdown#render', () => {
        const instance = new Marpit()
        const render = jest.spyOn(instance.markdown, 'render')

        instance.render('Markdown', { env: 'env' })
        expect(render).toBeCalledWith('Markdown', { env: 'env' })
      })

      context('when passed htmlAsArray prop as true', () => {
        it('outputs HTML as array per slide', () => {
          const { html } = new Marpit().render('# Page1\n***\n## Page2', {
            htmlAsArray: true,
          })

          expect(html).toHaveLength(2)
          expect(cheerio.load(html[0])('section#1 > h1')).toHaveLength(1)
          expect(cheerio.load(html[1])('section#2 > h2')).toHaveLength(1)
        })
      })
    })

    context('with inlineSVG option', () => {
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

        expect($('svg')).toHaveLength(0)
      })

      it('wraps section with svg when inlineSVG is true', () => {
        const rendered = instance(true).render('# Hi')
        const $ = cheerio.load(rendered.html, { lowerCaseTags: false })

        return postcssInstance
          .process(rendered.css, { from: undefined })
          .then(ret => {
            expect($('svg > foreignObject > section > h1')).toHaveLength(1)
            expect(countDecl(ret.root, '--theme-defined')).toBe(1)
          })
      })
    })

    context('with backgroundSyntax option', () => {
      const instance = backgroundSyntax => new Marpit({ backgroundSyntax })

      it('renders img tag when backgroundSyntax is false', () => {
        const $ = cheerio.load(instance(false).render('![bg](test)').html)
        expect($('img')).toHaveLength(1)
      })

      it('has background-image style on section tag when backgroundSyntax is true', () => {
        const $ = cheerio.load(instance(true).render('![bg](test)').html)

        return postcssInstance
          .process($('section').attr('style'), { from: undefined })
          .then(ret =>
            ret.root.walkDecls('background-image', decl => {
              expect(decl.value).toBe('url("test")')
            })
          )
      })
    })

    context('with filters option', () => {
      const instance = filters => new Marpit({ filters })

      it('does not apply filter style when filters is false', () => {
        const $ = cheerio.load(instance(false).render('![blur](test)').html)
        const style = $('img').attr('style') || ''

        expect(style).not.toContain('filter:blur')
      })

      it('applies filter style when filters is true', () => {
        const $ = cheerio.load(instance(true).render('![blur](test)').html)
        const style = $('img').attr('style') || ''

        expect(style).toContain('filter:blur')
      })
    })

    context('with inlineStyle option', () => {
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

        expect($('style')).toHaveLength(1)
        expect(rendered.css).not.toContain('--style: appended;')
      })

      it('appends style to css with processing when inlineStyle is true', () => {
        const rendered = instance(true).render(markdown)
        const $ = cheerio.load(rendered.html)

        expect($('style')).toHaveLength(0)
        expect(rendered.css).toContain('--style: appended;')
        expect(rendered.css).toContain('/* @import "valid-theme"; */')
      })
    })

    context('with looseYAML option', () => {
      const instance = looseYAML => new Marpit({ looseYAML })
      const markdown = dedent`
        ---
        backgroundImage:  url('/image.jpg')
        _color:           #123${' \t'}
        ---

        ---
      `

      it('allows loose YAML parsing when looseYAML is true', () => {
        const rendered = instance(true).render(markdown)
        const $ = cheerio.load(rendered.html)
        const firstStyle = $('section:nth-of-type(1)').attr('style')
        const secondStyle = $('section:nth-of-type(2)').attr('style')

        expect(firstStyle).toContain("background-image:url('/image.jpg')")
        expect(firstStyle).toContain('color:#123;')
        expect(secondStyle).toContain("background-image:url('/image.jpg')")
        expect(secondStyle).not.toContain('color:')
      })

      it('disallows loose YAML parsing when looseYAML is false', () => {
        const rendered = instance(false).render(markdown)
        const $ = cheerio.load(rendered.html)
        const style = $('section:nth-of-type(1)').attr('style')

        expect(style).toContain("background-image:url('/image.jpg')")
        expect(style).not.toContain('color:#123;')
      })
    })

    context('with scopedStyle option', () => {
      const markdown = '<style scoped>a { color: #00c; }</style>'
      const instance = scopedStyle =>
        new Marpit({ scopedStyle, inlineStyle: true })

      it('allows scoping inline style through <style scoped> when scopedStyle is true', () => {
        const { html, css } = instance(true).render(markdown)
        const $ = cheerio.load(html)

        expect(css).toContain('[data-marpit-scope-')
        expect(Object.keys($('section').attr())).toContainEqual(
          expect.stringMatching(/^data-marpit-scope-/)
        )
      })

      it('disallows scoping inline style through <style scoped> when scopedStyle is false', () => {
        const { html, css } = instance(false).render(markdown)
        const $ = cheerio.load(html)

        expect(css).not.toContain('[data-marpit-scope-')
        expect(Object.keys($('section').attr())).not.toContainEqual(
          expect.stringMatching(/^data-marpit-scope-/)
        )
      })
    })
  })

  describe('#renderMarkdown', () => {
    it('returns the result of markdown#render', () => {
      const instance = new Marpit()
      const spy = jest.spyOn(instance.markdown, 'render').mockImplementation()

      instance.renderMarkdown('render', { env: 'env' })
      expect(spy).toBeCalledWith('render', { env: 'env' })
    })
  })

  describe('#renderStyle', () => {
    it('returns the result of themeSet#pack', () => {
      const instance = new Marpit()
      instance.themeSet.pack = (theme, opts) => {
        expect(Object.keys(opts)).toContain('containers')
        expect(Object.keys(opts)).toContain('inlineSVG')
        expect(Object.keys(opts)).toContain('printable')

        return `style of ${theme}`
      }

      expect(instance.renderStyle('test-theme')).toBe('style of test-theme')
    })
  })

  describe('#use', () => {
    it('extends markdown-it parser by passed plugin', () => {
      const instance = new Marpit()
      const plugin = jest.fn((md, param) => {
        md.extended = param
      })

      expect(instance.use(plugin, 'parameter')).toBe(instance)
      expect(plugin).toBeCalledTimes(1)
      expect(plugin).toBeCalledWith(instance.markdown, 'parameter')
      expect(instance.markdown.extended).toBe('parameter')
    })
  })
})
