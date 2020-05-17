import dedent from 'dedent'
import postcss from 'postcss'
import { rootFontSizeCustomProp } from '../../../src/postcss/root/font_size'
import rem from '../../../src/postcss/root/rem'

describe('Marpit PostCSS rem plugin', () => {
  const run = (input) => postcss([rem()]).process(input, { from: undefined })

  it('replaces rem unit in all declarations into calculated value', () => {
    expect(run('h1 { font-size: 2rem; }').css).toBe(
      `h1 { font-size: calc(var(${rootFontSizeCustomProp}, 1rem) * 2); }`
    )

    expect(
      run(dedent`
        h2 { font-size: 1.5rem; }
        h3 { font-size: .9rem; }
      `).css
    ).toBe(dedent`
      h2 { font-size: calc(var(${rootFontSizeCustomProp}, 1rem) * 1.5); }
      h3 { font-size: calc(var(${rootFontSizeCustomProp}, 1rem) * .9); }
    `)

    expect(
      run('@media screen { h4 { height: calc(12px + .6rem); } }').css
    ).toBe(
      `@media screen { h4 { height: calc(12px + calc(var(${rootFontSizeCustomProp}, 1rem) * .6)); } }`
    )
  })

  it('does not replace the quoted rem unit', () => {
    const singleQuote = 'section::after { content: "1rem"; }'
    expect(run(singleQuote).css).toBe(singleQuote)

    const doubleQuote = "section::after { content: '1rem'; }"
    expect(run(doubleQuote).css).toBe(doubleQuote)

    // The case of mixed
    expect(run("section { font: regular 2rem '2rem font'; }").css).toBe(
      `section { font: regular calc(var(${rootFontSizeCustomProp}, 1rem) * 2) '2rem font'; }`
    )
  })

  it('does not replace a string like rem unit in some functions', () => {
    const url = 'section { background: url(https://example.com/1rem.png); }'
    expect(run(url).css).toBe(url)

    const attr = 'section::after { content: attr(data-1rem); }'
    expect(run(attr).css).toBe(attr)

    const varFunc = 'section::after { content: var(--text-1rem); }'
    expect(run(varFunc).css).toBe(varFunc)
  })

  it('does not replace custom value definition of confusable to rem', () => {
    const css = ':root { --test: 1remy; }'
    expect(run(css).css).toBe(css)
  })
})
