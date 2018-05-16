import assert from 'assert'
import postcss from 'postcss'
import importParse from '../../../src/postcss/import/parse'

describe('Marpit PostCSS import parse plugin', () => {
  const run = input =>
    postcss([importParse()]).process(input, { from: undefined })

  it('adds marpitImport empty array to result', () => {
    run('').then(result => {
      assert(result.marpitImport instanceof Array)
      assert.deepEqual(result.marpitImport, [])
    })
  })

  it('parses @import rule and store meta object to marpitImport', () =>
    run("/* @theme test */\n@charset 'utf-8';\n@import 'theme';").then(
      result => {
        const [imported] = result.marpitImport

        assert(imported.value === 'theme')
        assert.deepStrictEqual(imported.start, { line: 3, column: 1 })
        assert.deepStrictEqual(imported.end, { line: 3, column: 16 })
      }
    ))

  it('parses @import rule with escaped character correctly', () =>
    run('@import "\\"escaped\\""').then(result => {
      const [imported] = result.marpitImport
      assert(imported.value === '"escaped"')
    }))

  it('parses @import-theme rule with escaped character and media queries (ignored)', () =>
    run("@import-theme '\\'theme\\'' ignore, media-queries;").then(result => {
      const [imported] = result.marpitImport

      assert(imported.value === "'theme'")
      assert.deepStrictEqual(imported.start, { line: 1, column: 1 })
      assert.deepStrictEqual(imported.end, { line: 1, column: 48 })
    }))

  it('does not parse @import rule when it is not preceded any rules', () =>
    Promise.all([
      run("b { color: red; }\n@import 'theme';").then(result =>
        assert(result.marpitImport.length === 0)
      ),
      run("@keyframes {}\n@import 'theme';").then(result =>
        assert(result.marpitImport.length === 0)
      ),
    ]))
})
