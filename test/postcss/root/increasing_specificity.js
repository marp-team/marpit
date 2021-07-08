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

  it('replaces specific pseudo-class into ":not(a)" to increase specificity', () => {
    expect(run(`section${pseudoClass} {}`).css).toBe('section:not(a) {}')

    // With replaced :root selector via root replace plugin
    expect(run(`:root {}`).css).toBe('section:not(a) {}')
    expect(run(`section :root {}`).css).toBe('section section:not(a) {}')
    expect(run(`:root.klass div {}`).css).toBe('section:not(a).klass div {}')
  })
})
