import assert from 'assert'
import dedent from 'dedent'
import postcss from 'postcss'
import prepend from '../../../src/postcss/pseudo_selector/prepend'

describe('Marpit PostCSS pseudo selector prepending plugin', () => {
  const run = input => postcss([prepend()]).process(input, { from: undefined })

  it('prepends Marpit pseudo selectors to each rule', () => {
    const css = dedent`
      h1 { font-size: 40px; }
      h2, h3 { font-size: 30px; }
    `

    return run(css).then(result => {
      result.root.walkRules(rule => {
        rule.selectors.forEach(selector => {
          assert(selector.startsWith(':marpit-container > :marpit-slide h'))
        })
      })
    })
  })

  it('replaces section selector into :marpit-slide pseudo element', () => {
    const css = dedent`
      section { background: #fff; }
      section::after { color: #666; }
      section.invert { background: #000; }
      section-like-element { color: red; }
    `

    return run(css).then(result => {
      const rules = []
      result.root.walkRules(rule => rules.push(...rule.selectors))

      assert(rules.includes(':marpit-container > :marpit-slide'))
      assert(rules.includes(':marpit-container > :marpit-slide::after'))
      assert(rules.includes(':marpit-container > :marpit-slide.invert'))

      // Custom Elements
      assert(
        rules.includes(':marpit-container > :marpit-slide section-like-element')
      )
    })
  })

  it('ignores root html, body and :marpit-container pseudo element', () => {
    const css = dedent`
      html, body { margin: 0; }
      :marpit-container > div { background: #fff; }
    `

    return run(css).then(result => {
      result.root.walkRules(rule => {
        rule.selectors.forEach(selector => {
          assert(!selector.startsWith(':marpit-container > :marpit-slide'))
        })
      })
    })
  })
})
