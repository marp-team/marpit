import dedent from 'dedent'
import { Theme } from '../src/index'
import skipThemeValidationSymbol from '../src/theme/symbol'

describe('Theme', () => {
  describe('.fromCSS', () => {
    it('returns frozen Theme instance', () => {
      const css = '/* @theme test-theme */'
      const instance = Theme.fromCSS(css)

      expect(instance).toBeInstanceOf(Theme)
      expect(Object.isFrozen(instance)).toBe(true)

      expect(instance.name).toBe('test-theme')
      expect(instance.css).toBe(css)
      expect(instance.meta).toStrictEqual({ theme: 'test-theme' })
      expect(Object.isFrozen(instance.meta)).toBe(true)
      expect(instance.importRules).toStrictEqual([])
      expect(instance.width).toBeUndefined()
      expect(instance.height).toBeUndefined()
    })

    context('when CSS has not @theme meta', () => {
      const css = 'section { background: #fff; }'

      it('throws error', () =>
        expect(() => Theme.fromCSS(css)).toThrow(
          'Marpit theme CSS requires @theme meta.',
        ))

      context('with specified internal symbol for skipping validation', () => {
        it('returns theme instance without name', () => {
          let instance
          expect(() => {
            instance = Theme.fromCSS(css, { [skipThemeValidationSymbol]: true })
          }).not.toThrow()

          expect(instance.name).toBeUndefined()
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
        expect(instance.width).toBe('960px')
        expect(instance.height).toBe('720px')
      })
    })

    context('when CSS has size declarations on :root selector', () => {
      const instance = Theme.fromCSS(dedent`
        /* @theme test-theme */
        :root {
          width: 960px;
          height: 720px;
        }
        section {
          width: 123px;
          height: 456px;
        }
      `)

      it('returns Theme instance that has width and height props defined in :root selector', () => {
        expect(instance.width).toBe('960px')
        expect(instance.height).toBe('720px')
      })
    })

    context('when CSS has @import rules', () => {
      const instance = Theme.fromCSS(dedent`
        /* @theme test-theme */
        @import "another-theme";
        @import-theme "yet-another"
      `)

      it('returns Theme instance that has width and height props', () =>
        expect(instance.importRules.map((r) => r.value)).toStrictEqual([
          'yet-another', // @import-theme prepends to the beginning
          'another-theme',
        ]))
    })

    context('with metaType option argument', () => {
      it('parses custom metadata with specified type', () => {
        const instance = Theme.fromCSS(
          dedent`
            /**
             * @theme test
             * @string A
             * @string B
             * @array A
             * @array B
             * @unknown A
             * @unknown B
             */
          `,
          { metaType: { string: String, array: Array } },
        )

        expect(instance.meta.string).toBe('B')
        expect(instance.meta.array).toStrictEqual(['A', 'B'])
        expect(instance.meta.unknown).toBe('B')
      })

      it('cannot override the type for restricted metadata', () => {
        const instance = Theme.fromCSS(
          dedent`
            /**
             * @theme A
             * @theme B
             */
          `,
          { metaType: { theme: Array } },
        )

        expect(instance.meta.theme).toStrictEqual('B')
      })
    })
  })

  describe('widthPixel property', () => {
    const instance = (width) =>
      Theme.fromCSS(`section { width: ${width}; }`, {
        [skipThemeValidationSymbol]: true,
      })

    it('returns a width pixel as number', () =>
      expect(instance('1280px').widthPixel).toBe(1280))

    it('converts absolute unit into pixel', () => {
      expect(instance('127cm').widthPixel).toBe(4800)
      expect(instance('2.5in').widthPixel).toBe(240)
      expect(instance('635mm').widthPixel).toBe(2400)
      expect(instance('8pc').widthPixel).toBe(128)
      expect(instance('300pt').widthPixel).toBe(400)
      expect(instance('635Q').widthPixel).toBe(600)
    })

    it('returns undefined when width has not absolute unit', () => {
      expect(instance('100em').widthPixel).toBeUndefined()
    })

    it('returns undefined when width property is invalid', () => {
      const theme = new Theme()
      const assertWidth = (width) => {
        theme.width = width
        expect(theme.widthPixel).toBeUndefined()
      }

      assertWidth(undefined)
      assertWidth('')
      assertWidth('-.px')
      assertWidth(123)
    })
  })

  describe('heightPixel property', () => {
    const instance = (height) =>
      Theme.fromCSS(`section { height: ${height}; }`, {
        [skipThemeValidationSymbol]: true,
      })

    it('returns a width pixel as number', () =>
      expect(instance('960px').heightPixel).toBe(960))

    it('converts absolute unit into pixel', () => {
      expect(instance('31.75cm').heightPixel).toBe(1200)
      expect(instance('1.25in').heightPixel).toBe(120)
      expect(instance('127mm').heightPixel).toBe(480)
      expect(instance('10.1pc').heightPixel).toBe(161.6)
      expect(instance('5.625pt').heightPixel).toBe(7.5)
    })

    it('returns undefined when width has not absolute unit', () => {
      expect(instance('100%').heightPixel).toBeUndefined()
    })

    it('returns undefined when width property is invalid', () => {
      const theme = new Theme()
      const assertHeight = (height) => {
        theme.height = height
        expect(theme.heightPixel).toBeUndefined()
      }

      assertHeight(undefined)
      assertHeight('')
      assertHeight('-.px')
      assertHeight(123)
    })
  })
})
