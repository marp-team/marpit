import assert from 'assert'
import postcss from 'postcss'
import meta from '../../src/postcss/meta'

describe('Marpit PostCSS meta plugin', () => {
  const run = input => postcss([meta()]).process(input, { from: undefined })

  it('adds marpitMeta object to result', () => {
    run('').then(result => {
      assert(result.marpitMeta instanceof Object)
      assert.deepEqual(result.marpitMeta, {})
    })
  })

  it('parses meta comment and store to marpitMeta', () =>
    run('/* @meta value */').then(result =>
      assert(result.marpitMeta.meta === 'value')
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
        assert.deepEqual(result.marpitMeta, {
          meta: 'value',
          multiline: 'is supported.',
        })
      ))
  })
})
