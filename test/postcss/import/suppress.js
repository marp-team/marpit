import postcss from 'postcss'
import importSuppress from '../../../src/postcss/import/suppress'

describe('Marpit PostCSS import suppress plugin', () => {
  const themeSetStub = new Map()
  themeSetStub.set('imported', { css: '' })

  const run = (input) =>
    postcss([importSuppress(themeSetStub)]).process(input, { from: undefined })

  it('comments out @import and @import-theme rules with valid theme', () =>
    run('@import "imported";\n@import-theme "imported";').then(({ css }) =>
      expect(css).toBe(
        '/* @import "imported"; */\n/* @import-theme "imported"; */'
      )
    ))

  it('ignores @import and @import-theme rules with invalid theme', () => {
    const style = '@import "invalid";\n@import-theme "invalid";'
    return run(style).then(({ css }) => expect(css).toBe(style))
  })
})
