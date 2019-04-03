import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import fragment from '../../src/markdown/fragment'
import slide from '../../src/markdown/slide'

describe('Marpit fragment plugin', () => {
  const md = () => {
    const instance = new MarkdownIt('commonmark')
    instance.marpit = {}

    return instance
      .use(slide)
      .use(m => m.core.ruler.push('marpit_directives_parse', () => {}))
      .use(fragment)
  }

  describe('Fragmented unordered list', () => {
    context('when using "*" markup', () => {
      const markdown = '* A\n* B\n* C'
      const $ = cheerio.load(md().render(markdown))

      it('adds data-marpit-fragment attribute to <li> with index', () => {
        const li = $('ul > li[data-marpit-fragment]')
        expect(li).toHaveLength(3)

        const indexes = li.map((_, el) => $(el).data('marpit-fragment')).get()
        expect(indexes).toStrictEqual([1, 2, 3])
      })

      it('adds data-marpit-fragments attribute to <section> with count of fragments', () => {
        const section = $('section[data-marpit-fragments]')

        expect(section).toHaveLength(1)
        expect(section.data('marpit-fragments')).toBe(3)
      })
    })

    for (const char of ['-', '+']) {
      context(`when using "${char}" markup`, () => {
        const markdown = `${char} A\n${char} B\n${char} C`
        const $ = cheerio.load(md().render(markdown))

        it('does not add data-marpit-fragment attribute', () =>
          expect($('[data-marpit-fragment]')).toHaveLength(0))

        it('does not add data-marpit-fragments attribute', () =>
          expect($('[data-marpit-fragments]')).toHaveLength(0))
      })
    }
  })

  describe('Fragmented ordered list', () => {
    context('when using "1)" markup', () => {
      const markdown = '1) A\n1) B\n1) C'
      const $ = cheerio.load(md().render(markdown))

      it('adds data-marpit-fragment attribute to <li> with index', () => {
        const li = $('ol > li[data-marpit-fragment]')
        expect(li).toHaveLength(3)

        const indexes = li.map((_, el) => $(el).data('marpit-fragment')).get()
        expect(indexes).toStrictEqual([1, 2, 3])
      })

      it('adds data-marpit-fragments attribute to <section> with count of fragments', () => {
        const section = $('section[data-marpit-fragments]')

        expect(section).toHaveLength(1)
        expect(section.data('marpit-fragments')).toBe(3)
      })
    })

    context(`when using "1." markup`, () => {
      const markdown = `1. A\n1. B\n1. C`
      const $ = cheerio.load(md().render(markdown))

      it('does not add data-marpit-fragment attribute', () =>
        expect($('[data-marpit-fragment]')).toHaveLength(0))

      it('does not add data-marpit-fragments attribute', () =>
        expect($('[data-marpit-fragments]')).toHaveLength(0))
    })
  })
})
