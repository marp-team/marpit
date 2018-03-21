import assert from 'assert'
import dedent from 'dedent'
import { Theme } from '../src/index'

describe('Theme', () => {
  describe('.fromCSS', () => {
    it('returns frozen Theme instance', () => {
      const css = '/* @theme test-theme */'
      const instance = Theme.fromCSS(css)

      assert(instance instanceof Theme)
      assert(Object.isFrozen(instance))

      assert(instance.name === 'test-theme')
      assert(instance.css === css)
      assert.deepEqual(instance.meta, { theme: 'test-theme' })
      assert(instance.width === undefined)
      assert(instance.height === undefined)
    })

    context('when CSS has not @theme meta', () => {
      const css = 'section { background: #fff; }'

      it('throws error', () =>
        assert.throws(() => {
          Theme.fromCSS(css)
        }, 'Marpit theme CSS requires @theme meta.'))

      context('with validate option as false (for internal)', () => {
        it('returns theme instance without name', () => {
          let instance
          assert.doesNotThrow(() => {
            instance = Theme.fromCSS(css, false)
          })

          assert(instance.name === undefined)
        })
      })
    })

    context('when CSS has size declarations on section selector', () => {
      const instance = Theme.fromCSS(dedent`
        /* @theme test-theme */
        section {
          width: 960px;
          height: 720px;
        }
      `)

      it('returns Theme instance that has width and height props', () => {
        assert(instance.width === '960px')
        assert(instance.height === '720px')
      })
    })
  })

  describe('widthPixel property', () => {
    const instance = width =>
      Theme.fromCSS(`section { width: ${width}; }`, false)

    it('returns a width pixel as number', () =>
      assert(instance('1280px').widthPixel === 1280))

    it('converts absolute unit into pixel', () => {
      assert(instance('127cm').widthPixel === 4800)
      assert(instance('2.5in').widthPixel === 240)
      assert(instance('635mm').widthPixel === 2400)
      assert(instance('8pc').widthPixel === 128)
      assert(instance('300pt').widthPixel === 400)
    })

    it('returns undefined when width has not absolute unit', () => {
      assert(instance('100em').widthPixel === undefined)
    })

    it('returns undefined when width property is invalid', () => {
      const theme = new Theme()
      const assertWidth = width => {
        theme.width = width
        assert(theme.widthPixel === undefined)
      }

      assertWidth(undefined)
      assertWidth('')
      assertWidth('-.px')
      assertWidth(123)
    })
  })

  describe('heightPixel property', () => {
    const instance = height =>
      Theme.fromCSS(`section { height: ${height}; }`, false)

    it('returns a width pixel as number', () =>
      assert(instance('960px').heightPixel === 960))

    it('converts absolute unit into pixel', () => {
      assert(instance('31.75cm').heightPixel === 1200)
      assert(instance('1.25in').heightPixel === 120)
      assert(instance('127mm').heightPixel === 480)
      assert(instance('10.1pc').heightPixel === 161.6)
      assert(instance('5.625pt').heightPixel === 7.5)
    })

    it('returns undefined when width has not absolute unit', () => {
      assert(instance('100%').heightPixel === undefined)
    })

    it('returns undefined when width property is invalid', () => {
      const theme = new Theme()
      const assertHeight = height => {
        theme.height = height
        assert(theme.heightPixel === undefined)
      }

      assertHeight(undefined)
      assertHeight('')
      assertHeight('-.px')
      assertHeight(123)
    })
  })
})
