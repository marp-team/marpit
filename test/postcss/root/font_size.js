import dedent from 'dedent'
import postcss from 'postcss'
import prependSlide from '../../../src/postcss/pseudo_selector/prepend'
import replaceSlide from '../../../src/postcss/pseudo_selector/replace'
import fontSize, {
  rootFontSizeCustomProp,
} from '../../../src/postcss/root/font_size'

describe('CSS variable injection', () => {
  const run = (input, plugins = []) =>
    postcss([fontSize()].concat(plugins)).process(input, { from: undefined })

  const runWithModularize = (css) => run(css, [prependSlide, replaceSlide()])

  it('injects CSS custom property reflected with font-size declarations for the root section', () => {
    const expected = dedent`
      section { font-size: 16px; }
      section { ${rootFontSizeCustomProp}: 16px; }
    `
    expect(run('section { font-size: 16px; }').css).toBe(expected)

    // With combinator
    expect(run('section.klass { font-size: 16px; }').css).toContain(
      `section.klass { ${rootFontSizeCustomProp}: 16px; }`
    )
    expect(run('section#id { font-size: 16px; }').css).toContain(
      `section#id { ${rootFontSizeCustomProp}: 16px; }`
    )
    expect(run('section[data-header] { font-size: 16px; }').css).toContain(
      `section[data-header] { ${rootFontSizeCustomProp}: 16px; }`
    )
    expect(run('section:hover { font-size: 16px; }').css).toContain(
      `section:hover { ${rootFontSizeCustomProp}: 16px; }`
    )
    expect(run('section::after { font-size: 16px; }').css).toContain(
      `section::after { ${rootFontSizeCustomProp}: 16px; }`
    )

    // Universal selector in modularized transform (explicit and implicit)
    expect(runWithModularize('* { font-size: 16px; }').css).toBe(dedent`
      section * { font-size: 16px; }
      section section { ${rootFontSizeCustomProp}: 16px; }
    `)
    expect(runWithModularize('*|* { font-size: 16px; }').css).toBe(dedent`
      section *|* { font-size: 16px; }
      section section { ${rootFontSizeCustomProp}: 16px; }
    `)
    expect(runWithModularize('[data-header] { font-size: 16px; }').css)
      .toBe(dedent`
        section [data-header] { font-size: 16px; }
        section section[data-header] { ${rootFontSizeCustomProp}: 16px; }
      `)

    // Nested section (For Marpit v2 and later)
    const nested = dedent`
      section>section { font-size: 16px; }
      section>section { ${rootFontSizeCustomProp}: 16px; }
    `
    expect(runWithModularize('section>section { font-size: 16px; }').css).toBe(
      nested
    )
  })

  it('keeps multiple font-size declarations in inherited custom property', () => {
    expect(
      run(dedent`
        section {
          font-size: 16px;
          font-size: 1rem;
          font-size: 18px !important;
        }
      `).css
    ).toBe(dedent`
      section {
        font-size: 16px;
        font-size: 1rem;
        font-size: 18px !important;
      }
      section {
        ${rootFontSizeCustomProp}: 16px;
        ${rootFontSizeCustomProp}: 1rem;
        ${rootFontSizeCustomProp}: 18px !important;
      }
    `)
  })
})
