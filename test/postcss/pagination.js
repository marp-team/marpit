import assert from 'assert'
import postcss from 'postcss'
import pagination from '../../src/postcss/pagination'

describe('Marpit PostCSS pagination plugin', () => {
  const run = input =>
    postcss([pagination()]).process(input, { from: undefined })

  // TODO: add test case
})
