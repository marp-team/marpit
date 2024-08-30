import { load } from 'cheerio'
import dedent from 'dedent'
import MarkdownIt from 'markdown-it'
import postcss from 'postcss'
import { Marpit, ThemeSet } from '../src/index'
import { normalizeSelectorsInCss } from './_supports/selector_normalizer'

describe('Marpit', () => {
  // Suppress PostCSS warning while running test
  const postcssInstance = postcss([() => {}])

  describe('#constructor', () => {
    const instance = new Marpit()

    describe('markdown option', () => {
      const mdText = 'Hello,\n<b>world!</b>'

      it('wraps CommonMark based instance by default', () =>
        expect(instance.render(mdText).html).toContain('<b>'))

      it('wraps specified markdown-it instance', () => {
        const markdown = new MarkdownIt()
        const mdSpy = jest.spyOn(markdown, 'parse')
        const { html } = new Marpit({ markdown }).render(mdText)

        expect(html).not.toContain('<b>')
        expect(mdSpy).toBeCalledWith(mdText, expect.anything())
      })

      it('wraps markdown-it instance created by passed arguments', () => {
        const marpitWithArg = new Marpit({ markdown: { breaks: true } })
        expect(marpitWithArg.render(mdText).html).toContain('<br')
        expect(marpitWithArg.render(mdText).html).not.toContain('<b>')

        const marpitWithArgs = new Marpit({
          markdown: ['commonmark', { breaks: true }],
        })
        expect(marpitWithArgs.render(mdText).html).toContain('<br')
        expect(marpitWithArgs.render(mdText).html).toContain('<b>')
      })
    })

    describe('options member', () => {
      it('has default options', () => {
        expect(instance.options.anchor).toBe(true)
        expect(instance.options.container.tag).toBe('div')
        expect(instance.options.container.class).toBe('marpit')
        expect(instance.options.cssContainerQuery).toBe(false)
        expect(instance.options.cssNesting).toBe(true)
        expect(instance.options.lang).toBeUndefined()
        expect(instance.options.markdown).toBeUndefined()
        expect(instance.options.printable).toBe(true)
        expect(instance.options.slideContainer).toBe(false)
        expect(instance.options.inlineSVG).toBe(false)
      })

      it('marks as immutable', () => {
        expect(() => {
          instance.options = { updated: true }
        }).toThrow(TypeError)

        expect(() => {
          instance.options.printable = false
        }).toThrow(TypeError)
      })
    })

    describe('customDirectives member', () => {
      it('has sealed', () => {
        expect(Object.isSealed(instance.customDirectives)).toBe(true)

        expect(() => {
          delete instance.customDirectives.global
        }).toThrow(TypeError)

        expect(() => {
          instance.customDirectives.spot = {}
        }).toThrow(TypeError)
      })

      it('is assignable parser function and apply to rendered token', () => {
        const marpit = new Marpit({ container: undefined })

        expect(() => {
          marpit.customDirectives.global.marp = (v) => ({ marp: `test ${v}` })
        }).not.toThrowError()

        const [token] = marpit.markdown.parse('<!-- marp: ok -->')
        expect(token.meta.marpitDirectives).toStrictEqual({ marp: 'test ok' })
      })

      it('does not overload built-in directive parser', () => {
        const marpit = new Marpit({ container: undefined })
        marpit.customDirectives.local.class = () => ({ class: '!' })

        const [token] = marpit.markdown.parse('<!-- class: ok -->')
        expect(token.meta.marpitDirectives).toStrictEqual({ class: 'ok' })
      })

      it('can assign built-in directive as alias', () => {
        const $theme = jest.fn((v) => ({ theme: v }))
        const marpit = new Marpit({ container: undefined })

        marpit.themeSet.add('/* @theme foobar */')
        marpit.customDirectives.global.$theme = $theme
        marpit.customDirectives.local.test = (v) => ({ test: v, class: v })

        // Global directive (Dollar prefix)
        marpit.markdown.render('<!-- $theme: foobar -->')
        expect($theme).toBeCalledWith('foobar', marpit)
        expect(marpit.lastGlobalDirectives.theme).toBe('foobar')

        marpit.markdown.render('<!-- $theme: unknown -->')
        expect($theme).toBeCalledWith('unknown', marpit)
        expect(marpit.lastGlobalDirectives.theme).toBeUndefined()

        // Local directive (Alias + internal meta)
        const [localFirst, , , localSecond] = marpit.markdown.parse(
          '<!-- test: local -->\n***\n<!-- _test: spot -->',
        )
        expect(localFirst.meta.marpitDirectives).toStrictEqual({
          test: 'local',
          class: 'local',
        })
        expect(localSecond.meta.marpitDirectives).toStrictEqual({
          test: 'spot',
          class: 'spot',
        })
      })

      context('with looseYAML option as true', () => {
        it('allows loose YAML parsing for custom directives', () => {
          const marpit = new Marpit({ container: undefined, looseYAML: true })
          marpit.customDirectives.global.a = (v) => ({ a: v })
          marpit.customDirectives.local.b = (v) => ({ b: v })

          const [token] = marpit.markdown.parse('---\na: #123\nb: #abc\n---')
          expect(token.meta.marpitDirectives.a).toBe('#123')
          expect(token.meta.marpitDirectives.b).toBe('#abc')
        })
      })

      context('with looseYAML option as false', () => {
        it('disallows loose YAML parsing for custom directives', () => {
          const marpit = new Marpit({ container: undefined, looseYAML: false })
          marpit.customDirectives.global.a = (v) => ({ a: v })
          marpit.customDirectives.local.b = (v) => ({ b: v })

          const [token] = marpit.markdown.parse('---\na: #123\nb: #abc\n---')
          expect(token.meta.marpitDirectives.a).toBeNull()
          expect(token.meta.marpitDirectives.b).toBeNull()
        })
      })
    })

    it('has themeSet property', () => {
      expect(instance.themeSet).toBeInstanceOf(ThemeSet)
      expect(instance.themeSet.size).toBe(0)
    })

    it('has markdown property', () => {
      expect(instance.markdown).toBeInstanceOf(MarkdownIt)
    })
  })

  describe('#render', () => {
    it('returns the object contains html, css, and comments', () => {
      const markdown = '# Hello'
      const instance = new Marpit()

      instance.renderMarkdown = (md) => {
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
        expect(opts.inlineSVG).toStrictEqual(
          expect.objectContaining({ enabled: false }),
        )
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
        const render = jest.spyOn(instance.markdown.renderer, 'render')

        instance.render('Markdown', { env: 'env' })

        expect(render).toBeCalledWith(
          expect.any(Array),
          instance.markdown.options,
          { env: 'env' },
        )
      })

      context('when passed htmlAsArray prop as true', () => {
        it('outputs HTML as array per slide', () => {
          const { html } = new Marpit().render('# Page1\n***\n## Page2', {
            htmlAsArray: true,
          })

          expect(html).toHaveLength(2)
          expect(load(html[0])('section#1 > h1')).toHaveLength(1)
          expect(load(html[1])('section#2 > h2')).toHaveLength(1)
        })
      })
    })

    context('with inlineSVG option', () => {
      const instance = (inlineSVG) => {
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

      const backdropStyle = '<style>::backdrop { --backdrop: true; }</style>'
      const findBackdropRules = (css) =>
        postcssInstance.process(css, { from: undefined }).then((ret) => {
          let rules = []

          ret.root.walkDecls('--backdrop', (decl) => {
            let node = decl
            while (node.type !== 'rule' && node.parent) node = node.parent
            if (node.type === 'rule') rules.push(node)
          })

          return rules
        })

      it('has not svg when inlineSVG is false', () => {
        const rendered = instance(false).render('# Hi')
        const $ = load(rendered.html, { lowerCaseTags: false })

        expect($('svg')).toHaveLength(0)
      })

      it('has not svg when inlineSVG option has enabled field as false', () => {
        const rendered = instance({ enabled: false }).render('# Hi')
        expect(rendered.html).not.toContain('<svg')
      })

      it('wraps section with svg when inlineSVG is true', () => {
        const rendered = instance(true).render('# Hi')
        const $ = load(rendered.html, {
          lowerCaseTags: false,
          xmlMode: true,
        })

        return postcssInstance
          .process(rendered.css, { from: undefined })
          .then((ret) => {
            expect($('svg > foreignObject > section > h1')).toHaveLength(1)
            expect(countDecl(ret.root, '--theme-defined')).toBe(1)
          })
      })

      it('redirects ::backdrop selector to container SVG when inlineSVG is enabled', () => {
        const { css } = instance(true).render(backdropStyle)

        return findBackdropRules(css).then((rules) => {
          expect(rules).toHaveLength(2)
          expect(
            rules.find((r) => r.selector.endsWith('svg[data-marpit-svg]')),
          ).toBeTruthy()
        })
      })

      it('wraps section with svg when inlineSVG is true', () => {
        const rendered = instance({ enabled: true }).render('# Hi')
        expect(rendered.html).toContain('<svg')
      })

      context('when passed htmlAsArray env', () => {
        it('outputs HTML including inline SVG as array', () => {
          for (const opt of [true, { enabled: true }]) {
            const { html } = instance(opt).render('# Hi', { htmlAsArray: true })
            expect(html).toHaveLength(1)

            const $ = load(html[0], {
              lowerCaseTags: false,
              xmlMode: true,
            })
            expect($('svg > foreignObject')).toHaveLength(1)
          }
        })
      })

      context(
        'when inlineSVG option has an object with backdropSelector field as false',
        () => {
          it('does not redirects ::backdrop selector to container SVG', () => {
            const { css } = instance({ backdropSelector: false }).render(
              backdropStyle,
            )

            return findBackdropRules(css).then((rules) => {
              expect(rules).toHaveLength(1)
            })
          })
        },
      )
    })

    describe('Background image', () => {
      it('has background-image style on section tag', () => {
        const $ = load(new Marpit().render('![bg](test)').html)

        return postcssInstance
          .process($('section').attr('style'), { from: undefined })
          .then((ret) =>
            ret.root.walkDecls('background-image', (decl) => {
              expect(decl.value).toBe('url("test")')
            }),
          )
      })

      describe('Advanced background image powered by inline SVG mode', () => {
        it('has figure element with background-image in the isolated layer', async () => {
          const $ = load(
            new Marpit({ inlineSVG: true }).render(
              '![bg  Advanced background](test)',
            ).html,
          )

          const figure = $('figure')
          const ret = await postcssInstance.process(figure.attr('style'), {
            from: undefined,
          })

          ret.root.walkDecls('background-image', (decl) => {
            expect(decl.value).toBe('url("test")')
          })

          expect(figure.find('figcaption').html()).toBe('Advanced background')
        })
      })
    })

    describe('CSS Filters', () => {
      it('applies filter style', () => {
        const $ = load(new Marpit().render('![blur](test)').html)
        const style = $('img').attr('style') || ''

        expect(style).toContain('filter:blur')
      })
    })

    describe('Inline style', () => {
      const instance = () => {
        const marpit = new Marpit()

        marpit.themeSet.add('/* @theme valid-theme */')
        return marpit
      }

      const markdown =
        '<style>@import "valid-theme";\nsection { --style: appended; }</style>'

      it('appends style to the last of css with processing', () => {
        const rendered = instance().render(markdown)
        const $ = load(rendered.html)

        expect($('style')).toHaveLength(0)
        expect(rendered.css.trim().endsWith('{ --style: appended; }')).toBe(
          true,
        )
        expect(rendered.css).toContain('/* @import "valid-theme"; */')
      })

      describe('Scoped style', () => {
        const scopedMarkdown = '<style scoped>a { color: #00c; }</style>'

        it('allows scoping inline style through <style scoped>', () => {
          const { html, css } = instance().render(scopedMarkdown)
          const $ = load(html)

          expect(css).toContain('[data-marpit-scope-')
          expect(Object.keys($('section').attr())).toContainEqual(
            expect.stringMatching(/^data-marpit-scope-/),
          )
        })
      })
    })

    context('with looseYAML option', () => {
      const instance = (looseYAML) => new Marpit({ looseYAML })
      const markdown = dedent`
        ---
        backgroundImage:  url('/image.jpg')
        _color:           #123${' \t'}
        "_backgroundColor": #456
        ---

        ---
      `

      it('allows loose YAML parsing for built-in directives when looseYAML is true', () => {
        const rendered = instance(true).render(markdown)
        const $ = load(rendered.html)
        const firstStyle = $('section:nth-of-type(1)').attr('style')
        const secondStyle = $('section:nth-of-type(2)').attr('style')

        expect(firstStyle).toContain("background-image:url('/image.jpg')")
        expect(firstStyle).toContain('color:#123;')
        expect(firstStyle).toContain('background-color:#456;')
        expect(secondStyle).toContain("background-image:url('/image.jpg')")
        expect(secondStyle).not.toContain('color:')
        expect(secondStyle).not.toContain('background-color:')
      })

      it('disallows loose YAML parsing for built-in directives when looseYAML is false', () => {
        const rendered = instance(false).render(markdown)
        const $ = load(rendered.html)
        const style = $('section:nth-of-type(1)').attr('style')

        expect(style).toContain("background-image:url('/image.jpg')")
        expect(style).not.toContain('color:#123;')
        expect(style).not.toContain('background-color:#456;')
      })
    })

    context('with anchor option', () => {
      it('renders slides with id attribute if anchor was true', () => {
        const marpit = new Marpit({ container: undefined, anchor: true })
        const [token] = marpit.markdown.parse('')

        expect(token.attrGet('id')).toBe('1')
      })

      it('renders slides without id attribute if anchor was false', () => {
        const marpit = new Marpit({ container: undefined, anchor: false })
        const [token] = marpit.markdown.parse('')

        expect(token.attrGet('id')).toBeNull()
      })

      it('renders slides with custom id attribute if the function was defined as anchor option', () => {
        const customAnchor = (index) => `custom-${index + 1}`

        const marpit = new Marpit({
          container: undefined,
          anchor: customAnchor,
        })
        const [token] = marpit.markdown.parse('')

        expect(token.attrGet('id')).toBe('custom-1')
      })
    })

    context('with cssContainerQuery option', () => {
      it('does not include container query style if cssContainerQuery was false', () => {
        const { css } = new Marpit({ cssContainerQuery: false }).render('')
        expect(css).not.toContain('container-type: size;')
      })

      it('includes container query style if cssContainerQuery was true', () => {
        const { css } = new Marpit({ cssContainerQuery: true }).render('')
        expect(css).toContain('container-type: size;')
      })

      it('includes container name style if cssContainerQuery was string', () => {
        const { css } = new Marpit({ cssContainerQuery: 'test' }).render('')
        expect(css).toContain('container-type: size;')
        expect(css).toContain('container-name: test;')
      })

      it('includes space-separated container name style if cssContainerQuery was the array of strings', () => {
        const { css } = new Marpit({ cssContainerQuery: ['a', 'b'] }).render('')
        expect(css).toContain('container-type: size;')
        expect(css).toContain('container-name: a b;')
      })

      it('does include container name style if cssContainerQuery was empty array', () => {
        const { css } = new Marpit({ cssContainerQuery: [] }).render('')
        expect(css).toContain('container-type: size;')
        expect(css).not.toContain('container-name')
      })
    })

    context('with cssNesting option', () => {
      const cssWithNesting = (root = 'section') => dedent`
        ${root} {
          color: red;

          h1 {
            font-size: 2em;

            &:hover {
              color: blue;
            }
          }

          > h2 {
            color: green;
          }
        }
      `

      it('parses CSS nesting if cssNesting was true', () => {
        // Inline style
        const { css } = new Marpit({ cssNesting: true }).render(
          `<style>\n${cssWithNesting()}\n</style>`,
        )
        const normalizedCss = normalizeSelectorsInCss(css)

        expect(normalizedCss).toContain('div.marpit>section h1')
        expect(normalizedCss).toContain('div.marpit>section h1:hover')
        expect(normalizedCss).toContain('div.marpit>section>h2')

        // Custom theme
        const marpit = new Marpit({ cssNesting: true })

        marpit.themeSet.add(dedent`
          /* @theme test */
          ${cssWithNesting(':root')}
        `)

        const { css: customThemeCSS } = marpit.render('<!-- theme: test -->')
        const normalizedCustomThemeCSS = normalizeSelectorsInCss(customThemeCSS)

        expect(normalizedCustomThemeCSS).toContain(
          'div.marpit>:where(section):not([\\20 root]) h1',
        )
        expect(normalizedCustomThemeCSS).toContain(
          'div.marpit>:where(section):not([\\20 root]) h1:hover',
        )
        expect(normalizedCustomThemeCSS).toContain(
          'div.marpit>:where(section):not([\\20 root])>h2',
        )
      })

      it('does not parse CSS nesting if cssNesting was false', () => {
        // Inline style
        const { css } = new Marpit({ cssNesting: false }).render(
          `<style>\n${cssWithNesting()}\n</style>`,
        )
        expect(css).not.toContain('h1:hover') // Test for parent selector `&`

        // Custom theme
        const marpit = new Marpit({ cssNesting: false })

        marpit.themeSet.add(dedent`
          /* @theme test */
          ${cssWithNesting(':root')}
        `)

        const { css: customThemeCSS } = marpit.render('<!-- theme: test -->')
        expect(customThemeCSS).not.toContain('h1:hover')
      })
    })
  })

  describe('#renderMarkdown', () => {
    it('returns the result of rendering', () => {
      const instance = new Marpit()
      const spy = jest
        .spyOn(instance.markdown.renderer, 'render')
        .mockImplementation()

      instance.renderMarkdown('render', { env: 'env' })

      expect(spy).toBeCalledWith(expect.any(Array), instance.markdown.options, {
        env: 'env',
      })
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

    it('scopes :root selector correctly', () => {
      const instance = new Marpit()
      instance.themeSet.add('/* @theme test */ :root { background: red; }')

      expect(instance.renderStyle('test')).toContain(
        'div.marpit > :where(section)',
      )
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
