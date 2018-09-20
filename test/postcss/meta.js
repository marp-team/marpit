import postcss from 'postcss'
import meta from '../../src/postcss/meta'

describe('Marpit PostCSS meta plugin', () => {
  const run = input => postcss([meta()]).process(input, { from: undefined })

  it('adds marpitMeta object to result', () => {
    run('').then(result => {
      expect(result.marpitMeta).toBeInstanceOf(Object)
      expect(result.marpitMeta).toStrictEqual({})
    })
  })

  it('parses meta comment and store to marpitMeta', () =>
    run('/* @meta value */').then(result =>
      expect(result.marpitMeta.meta).toBe('value')
    ))

  it('parses meta comment with starting by double star', () =>
    run('/** @meta double-star */').then(result =>
      expect(result.marpitMeta.meta).toBe('double-star')
    ))

  it('parses meta comment with important comment', () =>
    run('/*! @meta important-comment */').then(result =>
      expect(result.marpitMeta.meta).toBe('important-comment')
    ))

  context('with multiline metas', () => {
    const css = `
      /**
       **  Marpit metas
       **    @meta      value
       **    @multiline is supported.
       */
    `

    it('parses multiline metas correctly', () =>
      run(css).then(result =>
        expect(result.marpitMeta).toStrictEqual({
          meta: 'value',
          multiline: 'is supported.',
        })
      ))
  })
})
