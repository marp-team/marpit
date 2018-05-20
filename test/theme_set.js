/* eslint no-prototype-builtins: 0 */
import assert from 'assert'
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
      assert(bareInstance.default === undefined))

    it('has unenumerable themeMap property', () => {
      assert(bareInstance.themeMap instanceof Map)
      assert(!bareInstance.propertyIsEnumerable('themeMap'))
    })
  })

  describe('get #size', () => {
    it('returns the count of themes', () => {
      instance.add('/* @theme test-theme */')
      assert(instance.size === 1)

      instance.add('/* @theme test-theme2 */')
      assert(instance.size === 2)
    })
  })

  describe('#add', () => {
    it('adds theme and returns parsed Theme instance', () => {
      const ret = instance.add('/* @theme test-theme */')
      assert(ret instanceof Theme)
      assert(instance.has('test-theme'))
    })

    it('throws error with invalid CSS', () =>
      assert.throws(() => instance.add('h1 {')))

    it('throws error when CSS has not @theme meta', () =>
      assert.throws(() => instance.add('h1 { color: #f00; }')))
  })

  describe('#addTheme', () => {
    it('adds theme instance', () => {
      instance.addTheme(Theme.fromCSS('/* @theme test-theme */'))
      assert(instance.has('test-theme'))
    })

    it('throws error when passed theme is not an instance of Theme', () =>
      assert.throws(
        () => instance.addTheme('/* @theme test-theme */'),
        'ThemeSet can add only an instance of Theme.'
      ))

    it('throws error when passed theme has not name', () => {
      assert.throws(
        () => instance.addTheme(new Theme(undefined, '')),
        'An instance of Theme requires name.'
      )
    })

    it('throws error when passed theme is scaffold theme', () =>
      assert.throws(() => instance.addTheme(scaffoldTheme)))
  })

  describe('#clear', () => {
    it('removes all themes', () => {
      instance.add('/* @theme test1 */')
      instance.add('/* @theme test2 */')
      assert(instance.size === 2)

      instance.clear()
      assert(instance.size === 0)
    })
  })

  describe('#delete', () => {
    beforeEach(() => {
      instance.add('/* @theme test1 */')
      instance.add('/* @theme test2 */')
    })

    it('removes specified theme and returns true', () => {
      assert(instance.delete('test1'))
      assert(!instance.has('test1'))
      assert(instance.has('test2'))
    })

    it('returns false when specified theme is not contain', () => {
      assert(!instance.delete('test3'))
      assert(instance.size === 2)
    })
  })

  describe('#get', () => {
    let testTheme

    beforeEach(() => {
      testTheme = instance.add('/* @theme test-theme */')
    })

    it('returns specified Theme instance', () => {
      assert(instance.get('test-theme') === testTheme)
    })

    it('returns undefined when specified theme is not contain', () => {
      assert(instance.get('not-contain') === undefined)
    })

    context('with fallback option as true', () => {
      it('returns scaffold theme when specified theme is not contain', () => {
        assert(instance.get('not-contain', true) === scaffoldTheme)
      })

      context('when default theme is defined', () => {
        beforeEach(() => {
          instance.default = Theme.fromCSS('/* @theme default */')
        })

        it('returns default theme when specified theme is not contain', () => {
          assert(instance.get('not-contain', true) === instance.default)
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
        assert(instance.getThemeProp('size-specified', 'width') === '640px')
        assert(instance.getThemeProp('size-specified', 'height') === '480px')
      })

      it('returns scaffold value when specified theme is not defined props', () => {
        assert(instance.getThemeProp('fallback', 'width') === width)
        assert(instance.getThemeProp('fallback', 'height') === height)
      })

      it('returns scaffold value when specified theme is not contained', () => {
        assert(instance.getThemeProp('not-contained', 'width') === width)
        assert(instance.getThemeProp('not-contained', 'height') === height)
      })
    })

    context('with passing theme as Theme instance', () => {
      it('returns the property value when specified theme is contained', () => {
        assert(instance.getThemeProp(sizeSpecifiedTheme, 'width') === '640px')
        assert(instance.getThemeProp(sizeSpecifiedTheme, 'height') === '480px')
      })

      it('returns scaffold value when specified theme is not defined props', () => {
        assert(instance.getThemeProp(fallbackTheme, 'width') === width)
        assert(instance.getThemeProp(fallbackTheme, 'height') === height)
      })

      it('returns scaffold value when specified theme is not contained', () => {
        const theme = Theme.fromCSS('/* @theme not-contained */')

        assert(instance.getThemeProp(theme, 'width') === width)
        assert(instance.getThemeProp(theme, 'height') === height)
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
        assert(instance.getThemeProp('not-contained', 'width') === '123px'))

      it('fallbacks to scaffold value when prop in default theme is not defined', () =>
        assert(instance.getThemeProp('not-contained', 'height') === height))
    })

    context('with @import rules', () => {
      it('returns the value defined at imported theme', () => {
        assert(instance.getThemeProp('import', 'width') === '100px')
        assert(instance.getThemeProp('double-import', 'width') === '100px')
      })

      it('throws error when circular import is detected', () => {
        assert.throws(() => instance.getThemeProp('circular-import', 'width'))
        assert.throws(() => instance.getThemeProp('nested-circular', 'width'))
      })

      it('ignores importing undefined theme and fallbacks to scaffold value', () =>
        assert(instance.getThemeProp('undefined-theme', 'width') === width))
    })
  })

  describe('#has', () => {
    it('returns true when specified name is contained', () => {
      instance.add('/* @theme test-theme */')
      assert(instance.has('test-theme'))
    })

    it('returns false when specified name is not contained', () =>
      assert(!instance.has('test-theme')))
  })

  describe('#themes', () => {
    it('returns iterator of themes', () => {
      instance.add('/* @theme test1 */')
      instance.add('/* @theme test2 */')

      const themes = instance.themes()

      assert(typeof themes.next === 'function')
      assert.deepStrictEqual([...themes].map(t => t.name), ['test1', 'test2'])
    })
  })
})
