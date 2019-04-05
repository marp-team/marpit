import postcss from 'postcss'
import meta from '../../src/postcss/meta'

describe('Marpit PostCSS meta plugin', () => {
  const run = input => postcss([meta()]).process(input, { from: undefined })

  it('adds marpitMeta object to result', async () => {
    const result = await run('')
    expect(result.marpitMeta).toBeInstanceOf(Object)
    expect(result.marpitMeta).toStrictEqual({})
  })

  it('parses meta comment and store to marpitMeta', async () => {
    expect((await run('/* @meta value */')).marpitMeta.meta).toBe('value')

    // Number, hyphen and underscore
    expect((await run('/* @123 456 */')).marpitMeta['123']).toBe('456')
    expect((await run('/* @-_- _-_ */')).marpitMeta['-_-']).toBe('_-_')
  })

  it('parses meta comment with starting by double star', async () => {
    const result = await run('/** @meta double-star */')
    expect(result.marpitMeta.meta).toBe('double-star')
  })

  it('parses meta comment with important comment', async () => {
    const result = await run('/*! @meta important-comment */')
    expect(result.marpitMeta.meta).toBe('important-comment')
  })

  context('with multiline metas', () => {
    const css = `
      /**
       **  Marpit metas
       **    @meta      value
       **    @multiline is supported.
       */
    `

    it('parses multiline metas correctly', async () =>
      expect((await run(css)).marpitMeta).toStrictEqual({
        meta: 'value',
        multiline: 'is supported.',
      }))
  })
})
