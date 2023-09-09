import dedent from 'dedent'
import postcss from 'postcss'
import { Element } from '../../../src/index'
import replace from '../../../src/postcss/pseudo_selector/replace'

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

      return run(css).then((result) => {
        result.root.walkRules((rule) => {
          rule.selectors.forEach((selector) => {
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

      return run(css).then((result) => {
        const rules = []
        result.root.walkRules((rule) => rules.push(...rule.selectors))

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

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe('div > section'),
        )
      })
    })

    context('when container element is multiple elements', () => {
      it('replaces container into multiple elements combined by child combinator', () => {
        const containers = [new Element('div'), new Element('span')]

        return run(css, containers).then((result) =>
          expect(result.root.first.selector).toBe('div > span > section'),
        )
      })

      it('escapes each container element names in selector', () => {
        // These tag names can use in custom element.
        const containers = [
          new Element('marp.custom-element'),
          new Element('emotion-😍'),
        ]

        return run(css, containers).then((result) =>
          expect(result.root.first.selector).toBe(
            'marp\\.custom-element > emotion-\\1F60D > section',
          ),
        )
      })
    })

    context('when container element has specified class', () => {
      it('replaces container into an element with class selectors', () => {
        const container = new Element('div', { class: 'foo bar' })

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe('div.foo.bar > section'),
        )
      })

      it('removes duplicated class from selector', () => {
        const container = new Element('div', { class: 'one two one' })

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe('div.one.two > section'),
        )
      })

      it('escapes each class names in selector', () => {
        const container = new Element('div', { class: '123 .foo.bar #test' })

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe(
            'div.\\31 23.\\.foo\\.bar.\\#test > section',
          ),
        )
      })
    })

    context('when container element has id', () => {
      it('replaces container into an element with id selectors', () => {
        const container = new Element('div', { id: 'identifier' })

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe('div#identifier > section'),
        )
      })

      it('replaces container into selector consisted by class and id', () => {
        const container = new Element('div', { class: 'one two', id: 'id' })

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe('div.one.two#id > section'),
        )
      })

      it('escapes id name in selector', () => {
        const container = new Element('div', { id: '0123<#>4567' })

        return run(css, container).then((result) =>
          expect(result.root.first.selector).toBe(
            'div#\\30 123\\<\\#\\>4567 > section',
          ),
        )
      })
    })
  })

  context('with slide element(s) option', () => {
    const css = ':marpit-container > :marpit-slide h1 { font-size: 40px; }'

    context('when slide element is null', () => {
      it('remove pseudo elements', () =>
        run(css, undefined, null).then((result) =>
          expect(result.root.first.selector).toBe('h1'),
        ))
    })

    context('when slide element is a single element', () => {
      it('replaces slide into an element', () => {
        const container = new Element('div')

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe('div h1'),
        )
      })
    })

    context('when slide element is multiple elements', () => {
      it('replaces slide into multiple elements combined by child combinator', () => {
        const containers = [new Element('svg'), new Element('foreignObject')]

        return run(css, undefined, containers).then((result) =>
          expect(result.root.first.selector).toBe('svg > foreignObject h1'),
        )
      })

      it('escapes each container element names in selector', () => {
        const containers = [
          new Element('marp.custom-element'),
          new Element('emotion-😍'),
        ]

        return run(css, undefined, containers).then((result) =>
          expect(result.root.first.selector).toBe(
            'marp\\.custom-element > emotion-\\1F60D h1',
          ),
        )
      })
    })

    context('when slide element has specified class', () => {
      it('replaces slide into an element with class selectors', () => {
        const container = new Element('div', { class: 'foo bar' })

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe('div.foo.bar h1'),
        )
      })

      it('removes duplicated class from selector', () => {
        const container = new Element('div', { class: 'one two one' })

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe('div.one.two h1'),
        )
      })

      it('escapes each class names in selector', () => {
        const container = new Element('div', { class: '123 .foo.bar #test' })

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe(
            'div.\\31 23.\\.foo\\.bar.\\#test h1',
          ),
        )
      })
    })

    context('when slide element has id', () => {
      it('replaces slide into an element with id selectors', () => {
        const container = new Element('div', { id: 'identifier' })

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe('div#identifier h1'),
        )
      })

      it('replaces slide into selector consisted by class and id', () => {
        const container = new Element('div', { class: 'one two', id: 'id' })

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe('div.one.two#id h1'),
        )
      })

      it('escapes id name in selector', () => {
        const container = new Element('div', { id: '0123<#>4567' })

        return run(css, undefined, container).then((result) =>
          expect(result.root.first.selector).toBe(
            'div#\\30 123\\<\\#\\>4567 h1',
          ),
        )
      })
    })
  })
})
