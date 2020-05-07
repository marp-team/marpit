import dedent from 'dedent'
import postcss from 'postcss'
import replace, {
  rootFontSizeCustomProp,
} from '../../../src/postcss/root/replace'
import prependSlide from '../../../src/postcss/pseudo_selector/prepend'
import replaceSlide from '../../../src/postcss/pseudo_selector/replace'

describe('Marpit PostCSS root replace plugin', () => {
  const run = (input, plugins = []) =>
    postcss([replace()].concat(plugins)).process(input, { from: undefined })

  it('replaces ":root" pseudo-class selector into "section"', () => {
    expect(run(':root { --bg: #fff; }').css).toBe('section { --bg: #fff; }')

    // Various usages of :root selector
    expect(run(':root :root { --bg: #fff; }').css).toBe(
      'section section { --bg: #fff; }'
    )
    expect(run(':marpit-slide>:root { --bg: #fff; }').css).toBe(
      ':marpit-slide>section { --bg: #fff; }'
    )
    expect(run(':root+:root { --bg: #fff; }').css).toBe(
      'section+section { --bg: #fff; }'
    )
    expect(run(':root.klass~:root { --bg: #fff; }').css).toBe(
      'section.klass~section { --bg: #fff; }'
    )
    expect(run(':root:not(:root.klass) { --bg: #fff; }').css).toBe(
      'section:not(section.klass) { --bg: #fff; }'
    )
    expect(
      run(dedent`
        @media screen {
          :root { --bg: #fff; }
        }
      `).css
    ).toContain('section { --bg: #fff; }')
    expect(
      run(dedent`
        @supports (--foo: bar) {
          :root { --bg: #fff; }
        }
      `).css
    ).toContain('section { --bg: #fff; }')

    // "section:root" also replaces into "section"
    expect(run('section:root { --bg: #fff; }').css).toBe(
      'section { --bg: #fff; }'
    )
  })

  it('does not replace ":root" in non-selector', () => {
    expect(run('p[data-value=":root"] { --bg: #fff; }').css).toBe(
      'p[data-value=":root"] { --bg: #fff; }'
    )
  })

  it('leaves :root selector for other elements', () => {
    expect(run('html:root :root { --bg: #fff; }').css).toBe(
      'html:root section { --bg: #fff; }'
    )
  })

  describe('CSS variable injection', () => {
    const runWithModularize = (css) => run(css, [prependSlide, replaceSlide()])

    it('injects CSS custom property reflected with font-size declarations for the root section', () => {
      const expected = dedent`
        section { font-size: 16px; }
        section { ${rootFontSizeCustomProp}: 16px; }
      `
      expect(run('section { font-size: 16px; }').css).toBe(expected)
      expect(run(':root { font-size: 16px; }').css).toBe(expected)

      // With combinator
      expect(run(':root.klass { font-size: 16px; }').css).toContain(
        `section.klass { ${rootFontSizeCustomProp}: 16px; }`
      )
      expect(run(':root#id { font-size: 16px; }').css).toContain(
        `section#id { ${rootFontSizeCustomProp}: 16px; }`
      )
      expect(run(':root[data-header] { font-size: 16px; }').css).toContain(
        `section[data-header] { ${rootFontSizeCustomProp}: 16px; }`
      )
      expect(run(':root:hover { font-size: 16px; }').css).toContain(
        `section:hover { ${rootFontSizeCustomProp}: 16px; }`
      )
      expect(run(':root::after { font-size: 16px; }').css).toContain(
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
      expect(
        runWithModularize('section>section { font-size: 16px; }').css
      ).toBe(nested)
      expect(runWithModularize(':root>:root { font-size: 16px; }').css).toBe(
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
})
