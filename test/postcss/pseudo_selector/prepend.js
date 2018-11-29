import dedent from 'dedent'
import postcss from 'postcss'
import prepend from '../../../src/postcss/pseudo_selector/prepend'

describe('Marpit PostCSS pseudo selector prepending plugin', () => {
  const run = input => postcss([prepend()]).process(input, { from: undefined })

  it('prepends Marpit pseudo selectors to each rule', () =>
    run(dedent`
      h1 { font-size: 40px; }
      h2, h3 { font-size: 30px; }
      html, body { margin: 0; }
    `).then(({ root }) => {
      const collected = []
      root.walkRules(({ selectors }) => collected.push(...selectors))

      expect(collected).toStrictEqual([
        ':marpit-container > :marpit-slide h1',
        ':marpit-container > :marpit-slide h2',
        ':marpit-container > :marpit-slide h3',
        ':marpit-container > :marpit-slide html',
        ':marpit-container > :marpit-slide body',
      ])
    }))

  it('replaces section selector into :marpit-slide pseudo element', () =>
    run(dedent`
      section { background: #fff; }
      section::after { color: #666; }
      section.invert { background: #000; }
      section-like-element { color: red; }
    `).then(({ root }) => {
      const collected = []
      root.walkRules(({ selectors }) => collected.push(...selectors))

      expect(collected).toStrictEqual([
        ':marpit-container > :marpit-slide',
        ':marpit-container > :marpit-slide::after',
        ':marpit-container > :marpit-slide.invert',
        ':marpit-container > :marpit-slide section-like-element', // Custom Elements
      ])
    }))

  it('does not prepend selectors to :marpit-container pseudo element', () =>
    run(':marpit-container > div { background: #fff; }').then(({ root }) => {
      const collected = []
      root.walkRules(({ selectors }) => collected.push(...selectors))

      expect(collected).toStrictEqual([':marpit-container > div'])
    }))

  it('does not prepend selectors within @keyframes', () =>
    run(dedent`
      @keyframes spin {
        from { transform: rotate(0deg); }
        80% { transform: rotate(390deg); }
        to { transform: rotate(360deg); }
      }
    `).then(({ root }) => {
      const collected = []
      root.walkRules(({ selector }) => collected.push(selector))

      expect(collected).toStrictEqual(['from', '80%', 'to'])
    }))
})
