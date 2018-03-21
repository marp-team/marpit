import assert from 'assert'
import postcss from 'postcss'
import inlineSVGWorkaround from '../../src/postcss/inline_svg_workaround'

describe('Marpit PostCSS inline SVG workaround plugin', () => {
  const run = input =>
    postcss([inlineSVGWorkaround()]).process(input, { from: undefined })

  it('comments out the position declaration', () =>
    run('section { position: relative; }').then(result => {
      assert(result.css === 'section { /* position: relative; */ }')
    }))

  it('comments out the transform declaration', () =>
    run('section { transform: scale(0.5); }').then(result => {
      assert(result.css === 'section { /* transform: scale(0.5); */ }')
    }))

  it('comments out the overflow declaration that has auto value', () =>
    run('pre { overflow: auto; }').then(result => {
      assert(result.css === 'pre { /* overflow: auto; */ }')
    }))

  it('comments out the overflow-x and overflow-y declaration that has scroll value', () =>
    run('pre { overflow-x: scroll; overflow-y: scroll; }').then(result => {
      assert(
        result.css ===
          'pre { /* overflow-x: scroll; */ /* overflow-y: scroll; */ }'
      )
    }))

  it('keeps the overflow declaration that has hidden value', () =>
    run('pre { overflow: hidden; }').then(result => {
      assert(result.css === 'pre { overflow: hidden; }')
    }))

  it('keeps the overflow-x declaration that has visible value', () =>
    run('pre { overflow-x: visible; }').then(result => {
      assert(result.css === 'pre { overflow-x: visible; }')
    }))

  it('keeps the overflow-y declaration that has inherit value', () =>
    run('pre { overflow-y: inherit; }').then(result => {
      assert(result.css === 'pre { overflow-y: inherit; }')
    }))
})
