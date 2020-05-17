import postcss from 'postcss'
import increasingSpecificity, {
  pseudoClass,
} from '../../../src/postcss/root/increasing_specificity'
import replace from '../../../src/postcss/root/replace'

describe('Marpit PostCSS root increasing specificity plugin', () => {
  const run = (input) =>
    postcss([replace({ pseudoClass }), increasingSpecificity]).process(input, {
      from: undefined,
    })

  it('replaces specific pseudo-class into ":not(\\9)" to increase specificity', () => {
    expect(run(`section${pseudoClass} {}`).css).toBe('section:not(\\9) {}')

    // With replaced :root selector via root replace plugin
    expect(run(`:root {}`).css).toBe('section:not(\\9) {}')
    expect(run(`section :root {}`).css).toBe('section section:not(\\9) {}')
    expect(run(`:root.klass div {}`).css).toBe('section:not(\\9).klass div {}')
  })
})
