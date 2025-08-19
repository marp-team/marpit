import postcss from 'postcss'
import postcssAdvancedBackground from './postcss/advanced_background'
import postcssAfter from './postcss/after'
import postcssBefore from './postcss/before'
import postcssContainerQuery, {
  postprocess as postcssContainerQueryPostProcess,
} from './postcss/container_query'
import postcssImportHoisting from './postcss/import/hoisting'
import postcssImportReplace from './postcss/import/replace'
import postcssImportSuppress from './postcss/import/suppress'
import postcssNesting from './postcss/nesting'
import postcssPagination from './postcss/pagination'
import postcssPrintable, {
  postprocess as postcssPrintablePostProcess,
} from './postcss/printable'
import postcssPseudoPrepend from './postcss/pseudo_selector/prepend'
import postcssPseudoReplace from './postcss/pseudo_selector/replace'
import postcssRootFontSize from './postcss/root/font_size'
import postcssRootIncreasingSpecificity, {
  pseudoClass,
} from './postcss/root/increasing_specificity'
import postcssRem from './postcss/root/rem'
import postcssRootReplace from './postcss/root/replace'
import postcssScaffold from './postcss/scaffold'
import postcssSVGBackdrop from './postcss/svg_backdrop'
import Theme from './theme'
import scaffold from './theme/scaffold'

const defaultOptions = {
  cssNesting: false,
}

/**
 * Marpit theme set class.
 */
class ThemeSet {
  #plugins = []

  /**
   * Create a ThemeSet instance.
   *
   * @param {Object} [opts]
   * @param {boolean} [opts.cssNesting=true] Enable CSS nesting support.
   */
  constructor(opts = defaultOptions) {
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

    /**
     * The default type settings for theme metadata added by
     * {@link ThemeSet#add}.
     *
     * A key of object is the name of metadata and a value is the type which of
     * `String` and `Array`. You have to set `Array` if the theme allows
     * multi-time definitions in same meta key.
     *
     * ```css
     * /**
     *  * @theme example
     *  * @foo Single value
     *  * @foo allows only one string
     *  * @bar Multiple value 1
     *  * @bar Multiple value 2
     *  * @bar Multiple value 3
     *  * ...
     * ```
     *
     * ```js
     * const themeSet = new ThemeSet()
     *
     * themeSet.metaType = {
     *   foo: String,
     *   bar: Array,
     * }
     *
     * themeSet.add(css)
     *
     * console.log(themeSet.getThemeMeta('example', 'foo'))
     * // => 'allows only one string'
     *
     * console.log(themeSet.getThemeMeta('example', 'bar'))
     * // => ['Multiple value 1', 'Multiple value 2', 'Multiple value 3']
     * ```
     *
     * @type {Object}
     */
    this.metaType = {}

    /**
     * A boolean value indicating whether the theme set is enabling CSS nesting
     * or not.
     *
     * @type {boolean}
     */
    this.cssNesting = !!opts.cssNesting

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
   * @throws Will throw an error if the theme name is not specified by `@theme`
   *     metadata.
   */
  add(css) {
    const theme = Theme.fromCSS(css, {
      metaType: this.metaType,
      cssNesting: this.cssNesting,
    })

    this.addTheme(theme)
    return theme
  }

  /**
   * Add theme instance.
   *
   * @param {Theme} theme The theme instance.
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
   * @returns {Theme|undefined} Returns specified or fallback theme, or
   *     `undefined` if `fallback` is false and the specified theme has not
   *     existed.
   */
  get(name, fallback = false) {
    const theme = this.themeMap.get(name)
    return fallback ? theme || this.default || scaffold : theme
  }

  /**
   * Returns value(s) of specified metadata from a theme. It considers `@import`
   * and `@import-theme` rules in getting meta value. On the other hand, the
   * default theme specified by the instance is not considered.
   *
   * To support metadata with array type, it will merge into a flatten array
   * when the all of got valid values that includes imported themes are array.
   *
   * @param {string|Theme} theme The theme name or instance.
   * @param {string} meta The meta name to get.
   * @returns {string|string[]|undefined}
   */
  getThemeMeta(theme, meta) {
    const themeInstance = theme instanceof Theme ? theme : this.get(theme)
    const metas = themeInstance
      ? this.resolveImport(themeInstance)
          .map((t) => t.meta[meta])
          .filter((m) => m)
      : []

    // Flatten in order of definitions when the all of valid values are array
    if (metas.length > 0 && metas.every((m) => Array.isArray(m))) {
      const mergedArray = []

      for (const m of metas) mergedArray.unshift(...m)
      return mergedArray
    }

    return metas[0]
  }

  /**
   * Returns the value of specified property name from a theme. It considers
   * `@import` and `@import-theme` rules in getting value.
   *
   * It will fallback the reference object into the instance's default theme or
   * scaffold theme when the specified theme is `undefined`.
   *
   * @param {string|Theme} theme The theme name or instance.
   * @param {string} prop The property name to get.
   * @returns {*}
   */
  getThemeProp(theme, prop) {
    const themeInstance = theme instanceof Theme ? theme : this.get(theme)
    const props = themeInstance
      ? this.resolveImport(themeInstance).map((t) => t[prop])
      : []

    return [...props, this.default && this.default[prop], scaffold[prop]].find(
      (t) => t,
    )
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
   * **This method is designed for internal use by {@link Marpit} class.** Use
   * {@link Marpit#render} instead unless there is some particular reason.
   *
   * @param {string} name The theme name. It will use the instance's default
   *     theme or scaffold theme when a specific named theme does not exist.
   * @param {Object} [opts] The option object passed by {@link Marpit#render}.
   * @param {string} [opts.after] A CSS string to append into after theme.
   * @param {string} [opts.before] A CSS string to prepend into before theme.
   * @param {Element[]} [opts.containers] Container elements wrapping whole
   *     slide deck.
   * @param {boolean|string|string[]} [opts.containerQuery] Enable CSS container
   *     query by setting `true`. You can also specify the name of container for
   *     CSS container query used by the `@container` at-rule in child elements.
   * @param {boolean} [opts.printable] Make style printable to PDF.
   * @param {Marpit~InlineSVGOptions} [opts.inlineSVG] Apply a hierarchy of
   *     inline SVG to CSS selector by setting `true`. _(Experimental)_
   * @return {string} The converted CSS string.
   */
  pack(name, opts = {}) {
    const theme = this.get(name, true)
    const inlineSVGOpts = opts.inlineSVG || {}
    const slideElements = [
      ...(inlineSVGOpts.enabled
        ? [{ tag: 'svg' }, { tag: 'foreignObject' }]
        : []),
      { tag: 'section' },
    ]
    const containerName =
      typeof opts.containerQuery === 'string' ||
      Array.isArray(opts.containerQuery)
        ? opts.containerQuery
        : undefined

    const runPostCSS = (css, plugins) =>
      postcss(
        [this.cssNesting && postcssNesting(), ...plugins].filter((p) => p),
      ).process(css).css

    const normalizeExtraCSS = (css) => {
      if (!css) return undefined

      try {
        return runPostCSS(css, [postcssImportSuppress(this)])
      } catch {
        return undefined
      }
    }

    const after = normalizeExtraCSS(opts.after)
    const before = normalizeExtraCSS(opts.before)

    return runPostCSS(theme.css, [
      before && postcssBefore(before),
      after && postcssAfter(after),
      opts.containerQuery && postcssContainerQuery(containerName),
      postcssImportHoisting,
      postcssImportReplace(this),
      opts.printable &&
        postcssPrintable({
          width: this.getThemeProp(theme, 'width'),
          height: this.getThemeProp(theme, 'height'),
        }),
      theme !== scaffold && postcssScaffold,
      inlineSVGOpts.enabled && postcssAdvancedBackground,
      inlineSVGOpts.enabled &&
        inlineSVGOpts.backdropSelector &&
        postcssSVGBackdrop,
      postcssPagination,
      postcssRootReplace({ pseudoClass }),
      postcssRootFontSize,
      postcssPseudoPrepend,
      postcssPseudoReplace(opts.containers, slideElements),
      postcssRootIncreasingSpecificity,
      opts.printable && postcssPrintablePostProcess,
      opts.containerQuery && postcssContainerQueryPostProcess,
      postcssRem,
      postcssImportHoisting,
      ...this.#plugins,
    ])
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

  /**
   * Resolves `@import` and `@import-theme` and returns an array of using theme
   * instances.
   *
   * @private
   * @param {Theme} theme Theme instance
   * @returns {Theme[]}
   */
  resolveImport(theme, importedThemes = []) {
    const { name } = theme

    if (importedThemes.includes(name))
      throw new Error(`Circular "${name}" theme import is detected.`)

    const resolvedThemes = [theme]

    theme.importRules.forEach((m) => {
      const importTheme = this.get(m.value)

      if (importTheme)
        resolvedThemes.push(
          ...this.resolveImport(
            importTheme,
            [...importedThemes, name].filter((n) => n),
          ),
        )
    })

    return resolvedThemes.filter((v) => v)
  }

  /**
   * Register an additional PostCSS plugin for processing the theme CSS.
   *
   * @private
   * @param {Function} plugin A PostCSS plugin function to register.
   * @return {ThemeSet} The current ThemeSet instance for chainable.
   */
  use(plugin) {
    this.#plugins.push(plugin)
    return this
  }
}

export default ThemeSet
