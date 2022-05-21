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

  it('replaces specific pseudo-class into ":where(section):not([\\20 root])" to increase specificity', () => {
    expect(run(`section${pseudoClass} {}`).css).toBe(
      ':where(section):not([\\20 root]) {}'
    )

    // With replaced :root selector via root replace plugin
    expect(run(`:root {}`).css).toBe(':where(section):not([\\20 root]) {}')
    expect(run(`section :root {}`).css).toBe(
      'section :where(section):not([\\20 root]) {}'
    )
    expect(run(`:root.klass div {}`).css).toBe(
      ':where(section):not([\\20 root]).klass div {}'
    )
  })
})
