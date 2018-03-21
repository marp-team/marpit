import assert from 'assert'
import postcss from 'postcss'
import sectionSize from '../../src/postcss/section_size'

describe('Marpit PostCSS section size plugin', () => {
  const run = input =>
    postcss([sectionSize()]).process(input, { from: undefined })

  it('adds marpitSectionSize object to result', () => {
    run('').then(result => {
      assert(result.marpitSectionSize instanceof Object)
      assert.deepEqual(result.marpitSectionSize, {})
    })
  })

  it('parses width and height declaration on section selector', () =>
    run('section { width: 123px; height: 456px; }').then(result =>
      assert.deepEqual(result.marpitSectionSize, {
        width: '123px',
        height: '456px',
      })
    ))

  it('supports grouping selector', () =>
    run('html, body, section { width: 234px; height: 567px; }').then(result =>
      assert.deepEqual(result.marpitSectionSize, {
        width: '234px',
        height: '567px',
      })
    ))

  it('ignores section selector with pusedo selector', () =>
    run('section:first-child { width: 123px; height: 456px; }').then(result =>
      assert.deepEqual(result.marpitSectionSize, {})
    ))
})
