import dedent from 'dedent'
import postcss from 'postcss'
import { findAtRule, findDecl, findRule } from '../_supports/postcss_finder'
import printable, { postprocess } from '../../src/postcss/printable'

describe('Marpit PostCSS printable plugin', () => {
  const run = (input, opts) =>
    postcss([printable(opts), postprocess]).process(input, { from: undefined })

  it('prepends style for printing', () => {
    const css = dedent`
      section.theme { background: #fff; }

      @media marpit-print {
        /* Declarations for internal will remove */
        html { margin: 10px; }
      }
    `

    const opts = { width: '640px', height: '480px' }

    return run(css, opts).then(({ root }) => {
      const page = findAtRule(root, { name: 'page' })
      const print = findAtRule(root, { name: 'media', params: 'print' })
      const marpitPrint = findAtRule(root, {
        name: 'media',
        params: 'marpit-print',
      })

      expect(page).toBeTruthy()
      expect(print).toBeTruthy()
      expect(marpitPrint).toBeFalsy()

      // @page at-rule
      const pageSizeDecl = findDecl(page, { prop: 'size' })
      expect(pageSizeDecl.value).toBe('640px 480px')

      // @print at-rule for print
      for (const tag of ['html', 'body']) {
        const r = findRule(print, { selectors: s => s.includes(tag) })
        expect(findDecl(r, { prop: 'page-break-inside' }).value).toBe('avoid')
        expect(findDecl(r, { prop: 'margin' }).value).toBe('0')
      }

      // Original CSS
      expect(findRule(root, { selector: 'section.theme' })).toBeTruthy()
    })
  })
})
