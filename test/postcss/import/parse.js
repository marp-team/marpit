import postcss from 'postcss'
import importParse from '../../../src/postcss/import/parse'

describe('Marpit PostCSS import parse plugin', () => {
  const run = (input) =>
    postcss([importParse()]).process(input, { from: undefined })

  it('adds marpitImport empty array to result', () => {
    run('').then((result) => {
      expect(result.marpitImport).toBeInstanceOf(Array)
      expect(result.marpitImport).toStrictEqual([])
    })
  })

  it('parses @import rule and store meta object to marpitImport', () =>
    run("/* @theme test */\n@charset 'utf-8';\n@import 'theme';").then(
      (result) => {
        const [imported] = result.marpitImport

        expect(imported.node.type).toBe('atrule')
        expect(imported.value).toBe('theme')
      }
    ))

  it('parses multiple @import rules', () =>
    run("@import 'theme1';\n@import 'theme2'").then((result) => {
      const values = result.marpitImport.map((rule) => rule.value)
      expect(values).toStrictEqual(['theme1', 'theme2'])
    }))

  it('parses @import rule with escaped character correctly', () =>
    run('@import "\\"escaped\\""').then((result) => {
      const [imported] = result.marpitImport
      expect(imported.value).toBe('"escaped"')
    }))

  it('parses @import-theme rule with escaped character and media queries (ignored)', () =>
    run("@import-theme '\\'theme\\'' ignore, media-queries;").then((result) => {
      const [imported] = result.marpitImport
      expect(imported.value).toBe("'theme'")
    }))

  it('does not parse @import rule when it specifies URL data type', () =>
    run("@import url('https://example.com/example.css')").then((result) =>
      expect(result.marpitImport).toHaveLength(0)
    ))

  it('does not parse @import rule when it is not preceded any rules', () =>
    Promise.all([
      run("b { color: red; }\n@import 'theme';").then((result) =>
        expect(result.marpitImport).toHaveLength(0)
      ),
      run("@keyframes {}\n@import 'theme';").then((result) =>
        expect(result.marpitImport).toHaveLength(0)
      ),
    ]))
})
