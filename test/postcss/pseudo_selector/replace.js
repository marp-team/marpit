import dedent from 'dedent'
import postcss from 'postcss'
import replace from '../../../src/postcss/pseudo_selector/replace'
import { Element } from '../../../src/index'

describe('Marpit PostCSS pseudo selector replace plugin', () => {
  const run = (input, ...opts) =>
    postcss([replace(...opts)]).process(input, { from: undefined })

  context('with default option', () => {
    it('replaces Marpit pseudo selectors into section', () => {
      const css = dedent`
        :marpit-container > :marpit-slide h1 { font-size: 40px; }
        :marpit-container > :marpit-slide h2,
        :marpit-container > :marpit-slide h3 { font-size: 30px; }
      `

      return run(css).then(result => {
        result.root.walkRules(rule => {
          rule.selectors.forEach(selector => {
            expect(selector.startsWith('section h')).toBe(true)
          })
        })
      })
    })

    it('keeps id, class, attribute, and pesudo selector', () => {
      const css = dedent`
        :marpit-container > :marpit-slide#1 { color: red; }
        :marpit-container > :marpit-slide.invert { background: #000; }
        :marpit-container > :marpit-slide[data-theme="marpit"] { color: #999; }
        :marpit-container > :marpit-slide:first-child { background: #333; }
      `

      return run(css).then(result => {
        const rules = []
        result.root.walkRules(rule => rules.push(...rule.selectors))

        expect(rules).toContain('section#1')
        expect(rules).toContain('section.invert')
        expect(rules).toContain('section[data-theme="marpit"]')
        expect(rules).toContain('section:first-child')
      })
    })
  })

  context('with container element(s) option', () => {
    const css = ':marpit-container > :marpit-slide { background: #fff; }'

    context('when container element is a single element', () => {
      it('replaces container into an element', () => {
        const container = new Element('div')

        return run(css, container).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('div > section')
        })
      })
    })

    context('when container element is multiple elements', () => {
      it('replaces container into multiple elements combined by child combinator', () => {
        const containers = [new Element('div'), new Element('span')]

        return run(css, containers).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('div > span > section')
        })
      })
    })

    context('when container element has specified class', () => {
      it('replaces container into an element combined by class selectors', () => {
        const container = new Element('div', { class: 'foo bar' })

        return run(css, container).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('div.foo.bar > section')
        })
      })
    })
  })

  context('with slide element(s) option', () => {
    const css = ':marpit-container > :marpit-slide h1 { font-size: 40px; }'

    context('when slide element is null', () => {
      it('remove pseudo elements', () =>
        run(css, undefined, null).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('h1')
        }))
    })

    context('when slide element is a single element', () => {
      it('replaces slide into an element', () => {
        const container = new Element('div')

        return run(css, undefined, container).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('div h1')
        })
      })
    })

    context('when slide element is multiple elements', () => {
      it('replaces slide into multiple elements combined by child combinator', () => {
        const container = [new Element('svg'), new Element('foreignObject')]

        return run(css, undefined, container).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('svg > foreignObject h1')
        })
      })
    })

    context('when slide element has specified class', () => {
      it('replaces slide into an element combined by class selectors', () => {
        const container = new Element('div', { class: 'foo bar' })

        return run(css, undefined, container).then(result => {
          const { selector } = result.root.first
          expect(selector).toBe('div.foo.bar h1')
        })
      })
    })
  })
})
