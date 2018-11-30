import postcss from 'postcss'
import postcssAdvancedBackground from './postcss/advanced_background'
import postcssImportReplace from './postcss/import/replace'
import postcssImportRollup from './postcss/import/rollup'
import postcssImportSuppress from './postcss/import/suppress'
import postcssPagination from './postcss/pagination'
import postcssPrintable, {
  postprocess as postcssPrintablePostProcess,
} from './postcss/printable'
import postcssPseudoPrepend from './postcss/pseudo_selector/prepend'
import postcssPseudoReplace from './postcss/pseudo_selector/replace'
import Theme from './theme'
import scaffold from './theme/scaffold'

/**
 * Marpit theme set class.
 */
class ThemeSet {
  constructor() {
    /**
     * An instance of default theme.
     *
     * While running {@link ThemeSet#pack}, ThemeSet will use this theme when
     * the definition of theme directive or the theme with specified name is not
     * found.
     *
     * By default, Marpit does not provide default theme (`undefined`).
     *
     * @type {Theme|undefined}
     */
    this.default = undefined

    Object.defineProperty(this, 'themeMap', { value: new Map() })
  }

  /**
   * Return the number of themes.
   *
   * @type {number}
   * @readonly
   */
  get size() {
    return this.themeMap.size
  }

  /**
   * Add theme CSS from string.
   *
   * @param {string} css The theme CSS string.
   * @returns {Theme} A created {@link Theme} instance.
   * @throws Will throw an error if the theme name is not specified by `@theme`.
   */
  add(css) {
    const theme = Theme.fromCSS(css)

    this.addTheme(theme)
    return theme
  }

  /**
   * Add theme instance.
   *
   * @param {Theme} theme The theme instnace.
   * @throws Will throw an error if the theme name is not specified.
   */
  addTheme(theme) {
    if (!(theme instanceof Theme))
      throw new Error('ThemeSet can add only an instance of Theme.')

    if (typeof theme.name !== 'string')
      throw new Error('An instance of Theme requires name.')

    this.themeMap.set(theme.name, theme)
  }

  /**
   * Removes all themes from a {@link themeSet} object.
   */
  clear() {
    return this.themeMap.clear()
  }

  /**
   * Remove a specific named theme from a {@link themeSet} object.
   *
   * @param {string} name The theme name to delete.
   * @returns {boolean} Returns `true` if a theme in current {@link ThemeSet}
   *     existed and has been removed, or `false` if the theme does not exist.
   */
  delete(name) {
    return this.themeMap.delete(name)
  }

  /**
   * Returns a specific named theme.
   *
   * @param {string} name The theme name to get.
   * @param {boolean} [fallback=false] If true, return instance's default theme
   *     or scaffold theme when specified theme cannot find.
   * @returns {Theme|undefined} Returns specified or fallbacked theme, or
   *     `undefined` if `fallback` is false and the specified theme has not
   *     existed.
   */
  get(name, fallback = false) {
    const theme = this.themeMap.get(name)
    return fallback ? theme || this.default || scaffold : theme
  }

  /**
   * Returns the value of property from a specified theme. It considers
   * `@import` rules in getting property value.
   *
   * It will fallback the reference object into the instance's default theme or
   * scaffold theme when the specified theme is undefined.
   *
   * @param {string|Theme} theme The theme name or instance.
   * @param {string} prop The property name to get.
   */
  getThemeProp(theme, prop, importedThemes = []) {
    let importedProps = []
    const themeInstance = theme instanceof Theme ? theme : this.get(theme)

    if (themeInstance) {
      const { name } = themeInstance

      if (importedThemes.includes(name))
        throw new Error(`Circular "${name}" theme import is detected.`)

      importedProps = themeInstance.importRules
        .map(r => {
          const importTheme = this.get(r.value)
          return importTheme
            ? this.getThemeProp(
                importTheme,
                prop,
                [...importedThemes, name].filter(n => n)
              )
            : undefined
        })
        .filter(r => r)
        .reverse()
    }

    return [
      themeInstance && themeInstance[prop],
      ...importedProps,
      this.default && this.default[prop],
      scaffold[prop],
    ].find(t => t)
  }

  /**
   * Returns a boolean indicating whether a specific named theme exists or not.
   *
   * @param {string} name The theme name.
   * @returns {boolean} Returns `true` if a specific named theme exists,
   *     otherwise `false`.
   */
  has(name) {
    return this.themeMap.has(name)
  }

  /**
   * Convert registered theme CSS into usable in the rendered markdown by
   * {@link Marpit#render}.
   *
   * You should use {@link Marpit#render} unless there is some particular
   * reason.
   *
   * @param {string} name The theme name. It will use the instance's default
   *     theme or scaffold theme when a specific named theme does not exist.
   * @param {Object} [opts] The option object passed by {@link Marpit#render}.
   * @param {string} [opts.after] A CSS string to append into after theme.
   * @param {string} [opts.before] A CSS string to prepend into before theme.
   * @param {Element[]} [opts.containers] Container elements wrapping whole
   *     slide deck.
   * @param {boolean} [opts.printable] Make style printable to PDF.
   * @param {boolean} [opts.inlineSVG] Apply a hierarchy of inline SVG to CSS
   *     selector by setting `true`. _(Experimental)_
   * @return {string} The converted CSS string.
   */
  pack(name, opts = {}) {
    const slideElements = [{ tag: 'section' }]
    const theme = this.get(name, true)

    if (opts.inlineSVG)
      slideElements.unshift({ tag: 'svg' }, { tag: 'foreignObject' })

    const additionalCSS = css => {
      if (!css) return undefined

      try {
        return postcss([postcssImportSuppress(this)]).process(css).css
      } catch (e) {
        return undefined
      }
    }

    const after = additionalCSS(opts.after)
    const before = additionalCSS(opts.before)

    const packer = postcss(
      [
        before && (css => css.first.before(before)),
        after && (css => css.last.after(after)),
        postcssImportRollup,
        postcssImportReplace(this),
        opts.printable &&
          postcssPrintable({
            width: this.getThemeProp(theme, 'width'),
            height: this.getThemeProp(theme, 'height'),
          }),
        theme !== scaffold && (css => css.first.before(scaffold.css)),
        opts.inlineSVG && postcssAdvancedBackground,
        postcssPagination,
        postcssPseudoPrepend,
        postcssPseudoReplace(opts.containers, slideElements),
        opts.printable && postcssPrintablePostProcess,
        postcssImportRollup,
      ].filter(p => p)
    )

    return packer.process(theme.css).css
  }

  /**
   * Returns a `Iterator` object that contains registered themes to current
   * instance.
   *
   * @returns {Iterator.<Theme>}
   */
  themes() {
    return this.themeMap.values()
  }
}

export default ThemeSet
