import dedent from 'dedent'
import postcss from 'postcss'
import replace from '../../../src/postcss/root/replace'

describe('Marpit PostCSS root replace plugin', () => {
  const run = (input) =>
    postcss([replace()]).process(input, { from: undefined })

  it('replaces ":root" pseudo-class selector into "section"', () => {
    expect(run(':root { --bg: #fff; }').css).toBe('section { --bg: #fff; }')

    // Various usages of :root selector
    expect(run(':root :root { --bg: #fff; }').css).toBe(
      'section section { --bg: #fff; }',
    )
    expect(run(':marpit-slide>:root { --bg: #fff; }').css).toBe(
      ':marpit-slide>section { --bg: #fff; }',
    )
    expect(run(':root+:root { --bg: #fff; }').css).toBe(
      'section+section { --bg: #fff; }',
    )
    expect(run(':root.klass~:root { --bg: #fff; }').css).toBe(
      'section.klass~section { --bg: #fff; }',
    )
    expect(run(':root:not(:root.klass) { --bg: #fff; }').css).toBe(
      'section:not(section.klass) { --bg: #fff; }',
    )
    expect(run(':is(:root) { --bg: #fff; }').css).toBe(
      ':is(section) { --bg: #fff; }',
    )
    expect(
      run(dedent`
        @media screen {
          :root { --bg: #fff; }
        }
      `).css,
    ).toContain('section { --bg: #fff; }')
    expect(
      run(dedent`
        @supports (--foo: bar) {
          :root { --bg: #fff; }
        }
      `).css,
    ).toContain('section { --bg: #fff; }')

    // "section:root" also replaces into "section"
    expect(run('section:root { --bg: #fff; }').css).toBe(
      'section { --bg: #fff; }',
    )
  })

  it('does not replace ":root" in non-selector', () => {
    expect(run('p[data-value=":root"] { --bg: #fff; }').css).toBe(
      'p[data-value=":root"] { --bg: #fff; }',
    )
  })

  it('leaves :root selector for other elements', () => {
    expect(run('html:root :root { --bg: #fff; }').css).toBe(
      'html:root section { --bg: #fff; }',
    )
  })
})
