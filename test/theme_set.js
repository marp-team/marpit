import dedent from 'dedent'
import scaffoldTheme from '../src/theme/scaffold'
import { ThemeSet, Theme } from '../src/index'

describe('ThemeSet', () => {
  const instance = new ThemeSet()

  beforeEach(() => {
    instance.default = undefined
    instance.clear()
  })

  describe('#constructor', () => {
    const bareInstance = new ThemeSet()

    it('has default property as undefined', () =>
      expect(bareInstance.default).toBeUndefined())

    it('has unenumerable themeMap property', () => {
      expect(bareInstance.themeMap).toBeInstanceOf(Map)
      expect({}.propertyIsEnumerable.call(bareInstance, 'themeMap')).toBe(false)
    })
  })

  describe('get #size', () => {
    it('returns the count of themes', () => {
      instance.add('/* @theme test-theme */')
      expect(instance.size).toBe(1)

      instance.add('/* @theme test-theme2 */')
      expect(instance.size).toBe(2)
    })
  })

  describe('#add', () => {
    it('adds theme and returns parsed Theme instance', () => {
      expect(instance.add('/* @theme test-theme */')).toBeInstanceOf(Theme)
      expect(instance.has('test-theme')).toBe(true)
    })

    it('throws error with invalid CSS', () =>
      expect(() => instance.add('h1 {')).toThrow())

    it('throws error when CSS has not @theme meta', () =>
      expect(() => instance.add('h1 { color: #f00; }')).toThrow())
  })

  describe('#addTheme', () => {
    it('adds theme instance', () => {
      instance.addTheme(Theme.fromCSS('/* @theme test-theme */'))
      expect(instance.has('test-theme')).toBe(true)
    })

    it('throws error when passed theme is not an instance of Theme', () =>
      expect(() => instance.addTheme('/* @theme test-theme */')).toThrow(
        'ThemeSet can add only an instance of Theme.'
      ))

    it('throws error when passed theme has not name', () => {
      expect(() => instance.addTheme(new Theme(undefined, ''))).toThrow(
        'An instance of Theme requires name.'
      )
    })

    it('throws error when passed theme is scaffold theme', () =>
      expect(() => instance.addTheme(scaffoldTheme)).toThrow())
  })

  describe('#clear', () => {
    it('removes all themes', () => {
      instance.add('/* @theme test1 */')
      instance.add('/* @theme test2 */')
      expect(instance.size).toBe(2)

      instance.clear()
      expect(instance.size).toBe(0)
    })
  })

  describe('#delete', () => {
    beforeEach(() => {
      instance.add('/* @theme test1 */')
      instance.add('/* @theme test2 */')
    })

    it('removes specified theme and returns true', () => {
      expect(instance.delete('test1')).toBe(true)
      expect(instance.has('test1')).toBe(false)
      expect(instance.has('test2')).toBe(true)
    })

    it('returns false when specified theme is not contain', () => {
      expect(instance.delete('test3')).toBe(false)
      expect(instance.size).toBe(2)
    })
  })

  describe('#get', () => {
    let testTheme

    beforeEach(() => {
      testTheme = instance.add('/* @theme test-theme */')
    })

    it('returns specified Theme instance', () => {
      expect(instance.get('test-theme')).toBe(testTheme)
    })

    it('returns undefined when specified theme is not contain', () => {
      expect(instance.get('not-contain')).toBe(undefined)
    })

    context('with fallback option as true', () => {
      it('returns scaffold theme when specified theme is not contain', () => {
        expect(instance.get('not-contain', true)).toBe(scaffoldTheme)
      })

      context('when default theme is defined', () => {
        beforeEach(() => {
          instance.default = Theme.fromCSS('/* @theme default */')
        })

        it('returns default theme when specified theme is not contain', () => {
          expect(instance.get('not-contain', true)).toBe(instance.default)
        })
      })
    })
  })

  describe('#getThemeProp', () => {
    let fallbackTheme
    let sizeSpecifiedTheme

    beforeEach(() => {
      fallbackTheme = instance.add('/* @theme fallback */')
      sizeSpecifiedTheme = instance.add(dedent`
        /* @theme size-specified */
        section {
          width: 640px;
          height: 480px;
        }
      `)

      // @import rules
      instance.add('/* @theme import */\n@import "imported";')
      instance.add('/* @theme imported */\nsection { width: 100px; }')
      instance.add('/* @theme double-import */\n@import "double-imported";')
      instance.add('/* @theme double-imported */\n@import "imported";')

      // Circular @import
      instance.add('/* @theme circular-import */\n@import "circular-import";')
      instance.add('/* @theme nested-circular */\n@import "nested-circular2";')
      instance.add('/* @theme nested-circular2 */\n@import "nested-circular";')

      // Import undefined theme
      instance.add('/* @theme undefined-theme */\n@import "ignore"')
    })

    const { width, height } = scaffoldTheme

    context('with passing theme as string', () => {
      it('returns the property value when specified theme is contained', () => {
        expect(instance.getThemeProp('size-specified', 'width')).toBe('640px')
        expect(instance.getThemeProp('size-specified', 'height')).toBe('480px')
      })

      it('returns scaffold value when specified theme is not defined props', () => {
        expect(instance.getThemeProp('fallback', 'width')).toBe(width)
        expect(instance.getThemeProp('fallback', 'height')).toBe(height)
      })

      it('returns scaffold value when specified theme is not contained', () => {
        expect(instance.getThemeProp('not-contained', 'width')).toBe(width)
        expect(instance.getThemeProp('not-contained', 'height')).toBe(height)
      })
    })

    context('with passing theme as Theme instance', () => {
      it('returns the property value when specified theme is contained', () => {
        expect(instance.getThemeProp(sizeSpecifiedTheme, 'width')).toBe('640px')
        expect(instance.getThemeProp(sizeSpecifiedTheme, 'height')).toBe(
          '480px'
        )
      })

      it('returns scaffold value when specified theme is not defined props', () => {
        expect(instance.getThemeProp(fallbackTheme, 'width')).toBe(width)
        expect(instance.getThemeProp(fallbackTheme, 'height')).toBe(height)
      })

      it('returns scaffold value when specified theme is not contained', () => {
        const theme = Theme.fromCSS('/* @theme not-contained */')

        expect(instance.getThemeProp(theme, 'width')).toBe(width)
        expect(instance.getThemeProp(theme, 'height')).toBe(height)
      })
    })

    context('when default theme is defined', () => {
      beforeEach(() => {
        instance.default = Theme.fromCSS(dedent`
          /* @theme default */
          section { width: 123px; }
        `)
      })

      it('returns default value when specified theme is not contained', () =>
        expect(instance.getThemeProp('not-contained', 'width')).toBe('123px'))

      it('fallbacks to scaffold value when prop in default theme is not defined', () =>
        expect(instance.getThemeProp('not-contained', 'height')).toBe(height))
    })

    context('with @import rules', () => {
      it('returns the value defined at imported theme', () => {
        expect(instance.getThemeProp('import', 'width')).toBe('100px')
        expect(instance.getThemeProp('double-import', 'width')).toBe('100px')
      })

      it('throws error when circular import is detected', () => {
        expect(() => instance.getThemeProp('circular-import', 'width')).toThrow(
          'Circular "circular-import" theme import is detected.'
        )
        expect(() => instance.getThemeProp('nested-circular', 'width')).toThrow(
          'Circular "nested-circular" theme import is detected.'
        )
      })

      it('ignores importing undefined theme and fallbacks to scaffold value', () =>
        expect(instance.getThemeProp('undefined-theme', 'width')).toBe(width))
    })
  })

  describe('#has', () => {
    it('returns true when specified name is contained', () => {
      instance.add('/* @theme test-theme */')
      expect(instance.has('test-theme')).toBe(true)
    })

    it('returns false when specified name is not contained', () =>
      expect(instance.has('test-theme')).toBe(false))
  })

  describe('#themes', () => {
    it('returns iterator of themes', () => {
      instance.add('/* @theme test1 */')
      instance.add('/* @theme test2 */')

      const themes = instance.themes()

      expect(typeof themes.next).toBe('function')
      expect([...themes].map(t => t.name)).toStrictEqual(['test1', 'test2'])
    })
  })

  describe('#pack', () => {
    context('with before option', () => {
      it('rolls-up @import rule to top for importing another theme', () => {
        instance.add('/* @theme test1 */ strong { font-weight: bold; }')
        instance.add('/* @theme test2 */ @import "test1";')

        const css = instance.pack('test2', {
          before: 'b { font-weight: bold; }',
        })

        expect(css).toContain('b { font-weight: bold; }')
        expect(css).toContain('strong { font-weight: bold; }')
      })

      it('ignores when passed invalid CSS', () => {
        let css

        expect(() => {
          css = instance.pack(undefined, { before: 'INVALID */' })
        }).not.toThrowError()

        expect(css).not.toContain('INVALID')
      })

      it('cannot apply unscoped rules by using @media print', () => {
        const pack = before =>
          instance.pack(undefined, { before, printable: true })

        // `@media print` will apply scope to defined rules.
        const print = '@media print { body { background: red; } }'
        const printCSS = pack(print)

        expect(printCSS.split('@media print').length - 1).toBe(2)
        expect(printCSS).toContain(
          '@media print { section body { background: red; } }'
        )

        // `@media marpit-print` internal at-rule will remove.
        const marpitPrint = '@media marpit-print { body { background: red; } }'
        const marpitPrintCSS = pack(marpitPrint)

        expect(marpitPrintCSS.split('@media print').length - 1).toBe(1)
        expect(marpitPrintCSS).not.toContain('background: red;')
      })
    })
  })
})
