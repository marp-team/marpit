import dedent from 'dedent'
import postcss from 'postcss'
import importReplace from '../../../src/postcss/import/replace'

describe('Marpit PostCSS import replace plugin', () => {
  const themeSetStub = new Map()
  themeSetStub.set('imported', { css: 'h1 { font-size: 3em; }' })
  themeSetStub.set('nested', {
    css: '@import "nested2";\nh2 { font-size: 2em; }',
  })
  themeSetStub.set('nested2', { css: 'h3 { font-size: 1em; }' })
  themeSetStub.set('example', { css: 'h4 { font-size: .5em; }' })

  // Circular imports
  themeSetStub.set('circular', { css: '@import "circular"' })
  themeSetStub.set('nested-circular', { css: '@import "nested-circular2"' })
  themeSetStub.set('nested-circular2', { css: '@import "nested-circular"' })

  const run = input =>
    postcss([importReplace(themeSetStub)]).process(input, { from: undefined })

  it('imports another theme', () =>
    run('@import "imported";\n\nsection { width: 100px; }').then(({ css }) =>
      expect(css).toBe('h1 { font-size: 3em; }\n\nsection { width: 100px; }')
    ))

  it('supports nested import', () =>
    run('@import "nested";\nh1 { font-size: 10em; }').then(({ css }) =>
      expect(css).toBe(dedent`
        h3 { font-size: 1em; }
        h2 { font-size: 2em; }
        h1 { font-size: 10em; }
      `)
    ))

  it('ignores when the specified theme is not defined in ThemeSet', () =>
    run('@import "unknown";').then(({ css }) =>
      expect(css).toBe('@import "unknown";')
    ))

  context('with using @import-theme rule', () => {
    it('imports to the beginning of CSS', () =>
      run('body { color: red; }\n\n@import-theme "imported"').then(({ css }) =>
        expect(css).toBe('h1 { font-size: 3em; }\nbody { color: red; }')
      ))

    it('ignores when the rule is contained in selector', () =>
      run('body { @import-theme "imported"; }').then(({ css }) =>
        expect(css).toBe('body { @import-theme "imported"; }')
      ))
  })

  context('with mixed rules', () => {
    it('imports CSS with following each specification', () =>
      // @import-theme => @import => content
      run(dedent`
        @import 'imported';
        @import-theme "nested";
        body { background: white; }
        @import-theme "example"
      `).then(({ css }) => {
        expect(css).toBe(dedent`
          h3 { font-size: 1em; }
          h2 { font-size: 2em; }
          h4 { font-size: .5em; }
          h1 { font-size: 3em; }
          body { background: white; }
        `)
      }))
  })

  it('throws error when circular import is detected', () =>
    Promise.all([
      expect(run('@import "circular"')).rejects.toThrow(
        'Circular "circular" theme import is detected.'
      ),
      expect(run('@import "nested-circular"')).rejects.toThrow(
        'Circular "nested-circular" theme import is detected.'
      ),
    ]))
})
