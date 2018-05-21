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

        assert(imported.node.type === 'atrule')
        assert(imported.value === 'theme')
      }
    ))

  it('parses multiple @import rules', () =>
    run("@import 'theme1';\n@import 'theme2'").then(result => {
      const values = result.marpitImport.map(rule => rule.value)
      assert.deepStrictEqual(values, ['theme1', 'theme2'])
    }))

  it('parses @import rule with escaped character correctly', () =>
    run('@import "\\"escaped\\""').then(result => {
      const [imported] = result.marpitImport
      assert(imported.value === '"escaped"')
    }))

  it('parses @import-theme rule with escaped character and media queries (ignored)', () =>
    run("@import-theme '\\'theme\\'' ignore, media-queries;").then(result => {
      const [imported] = result.marpitImport

      assert(imported.value === "'theme'")
    }))

  it('does not parse @import rule when it specifies URL data type', () =>
    run("@import url('https://example.com/example.css')").then(result =>
      assert(result.marpitImport.length === 0)
    ))

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
