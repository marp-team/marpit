import assert from 'assert'
import dedent from 'dedent'
import postcss from 'postcss'
import importRollup from '../../../src/postcss/import/rollup'

describe('Marpit PostCSS import rollup plugin', () => {
  const run = input =>
    postcss([importRollup]).process(input, { from: undefined })

  it('rolls up invalid @import rules', () => {
    const before = dedent`
      body { background: #fff; }
      @import 'invalid-import-1';
      h1 { color: red; }
      @import 'invalid-import-2';
    `
    const after = dedent`
      @import 'invalid-import-1';
      @import 'invalid-import-2';
      body { background: #fff; }
      h1 { color: red; }
    `
    return run(before).then(({ css }) => assert(css === after))
  })

  it('rolls up invalid @charset rule', () =>
    run('h1 { color: red; }\n@charset "utf-8";').then(({ css }) =>
      assert(css === '@charset "utf-8";\nh1 { color: red; }')
    ))

  it('applies the first rule when style has multiple @charset rules', () =>
    run('h1 { color: red; }\n@charset "utf-16";\n@charset "utf-8";').then(
      ({ css }) => assert(css === '@charset "utf-16";\nh1 { color: red; }')
    ))
})
