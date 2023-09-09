import MarkdownIt from 'markdown-it'
import { marpitContainer } from './element'
import { wrapArray } from './helpers/wrap_array'
import marpitBackgroundImage from './markdown/background_image'
import marpitCollect from './markdown/collect'
import marpitComment from './markdown/comment'
import marpitContainerPlugin from './markdown/container'
import marpitApplyDirectives from './markdown/directives/apply'
import marpitParseDirectives from './markdown/directives/parse'
import marpitFragment from './markdown/fragment'
import marpitHeaderAndFooter from './markdown/header_and_footer'
import marpitHeadingDivider from './markdown/heading_divider'
import marpitImage from './markdown/image'
import marpitInlineSVG from './markdown/inline_svg'
import marpitSlide, { defaultAnchorCallback } from './markdown/slide'
import marpitSlideContainer from './markdown/slide_container'
import marpitStyleAssign from './markdown/style/assign'
import marpitStyleParse from './markdown/style/parse'
import marpitSweep from './markdown/sweep'
import ThemeSet from './theme_set'

const defaultOptions = {
  anchor: true,
  container: marpitContainer,
  headingDivider: false,
  looseYAML: false,
  markdown: undefined,
  printable: true,
  slideContainer: false,
  inlineSVG: false,
}

const defaultInlineSVGOptions = {
  enabled: true,
  backdropSelector: true,
}

/**
 * Parse Marpit Markdown and render to the slide HTML/CSS.
 */
class Marpit {
  #markdown = undefined

  /**
   * @typedef {Object} Marpit~InlineSVGOptions
   * @property {boolean} [enabled=true] Whether inline SVG mode is enabled.
   * @property {boolean} [backdropSelector=true] Whether `::backdrop` selector
   *     support is enabled. If enabled, the `::backdrop` CSS selector will
   *     match to the SVG container element.
   */

  /**
   * Convert slide page index into anchor string.
   *
   * @callback Marpit~AnchorCallback
   * @param {number} index Slide page index, beginning from zero.
   * @returns {string} The text of anchor for id attribute, without prefix `#`.
   */

  /**
   * Create a Marpit instance.
   *
   * @param {Object} [opts]
   * @param {boolean|Marpit~AnchorCallback} [opts.anchor=true] Set the page
   *     number as anchor of each slides (`id` attribute). You can customize the
   *     anchor text by defining a custom callback function.
   * @param {false|Element|Element[]}
   *     [opts.container={@link module:element.marpitContainer}] Container
   *     element(s) wrapping whole slide deck.
   * @param {false|number|number[]} [opts.headingDivider=false] Start a new
   *     slide page at before of headings. it would apply to headings whose
   *     larger than or equal to the specified level if a number is given, or
   *     ONLY specified levels if a number array.
   * @param {boolean} [opts.looseYAML=false] Allow loose YAML parsing in
   *     built-in directives, and custom directives defined in current instance.
   * @param {MarkdownIt|string|Object|Array} [opts.markdown] An instance of
   *     markdown-it or its constructor option(s) for wrapping. Marpit will
   *     create its instance based on CommonMark when omitted.
   * @param {boolean} [opts.printable=true] Make style printable to PDF.
   * @param {false|Element|Element[]} [opts.slideContainer] Container element(s)
   *     wrapping each slide sections.
   * @param {boolean|Marpit~InlineSVGOptions} [opts.inlineSVG=false] Wrap each
   *     slide sections by inline SVG. _(Experimental)_
   */
  constructor(opts = {}) {
    /**
     * The current options for this instance.
     *
     * This property is read-only and marked as immutable. You cannot change the
     * value of options after creating instance.
     *
     * @member {Object} options
     * @memberOf Marpit#
     * @readonly
     */
    Object.defineProperty(this, 'options', {
      enumerable: true,
      value: Object.freeze({ ...defaultOptions, ...opts }),
    })

    /**
     * Definitions of the custom directive.
     *
     * It has the assignable `global` and `local` object. They have consisted of
     * the directive name as a key, and parser function as a value. The parser
     * should return the validated object for updating meta of markdown-it
     * token.
     *
     * @member {Object} customDirectives
     * @memberOf Marpit#
     * @readonly
     */
    Object.defineProperty(this, 'customDirectives', {
      value: Object.seal({
        global: Object.create(null),
        local: Object.create(null),
      }),
    })

    /**
     * @type {ThemeSet}
     */
    this.themeSet = new ThemeSet()

    this.applyMarkdownItPlugins(
      (() => {
        // Use CommonMark based instance by default
        if (!this.options.markdown) return new MarkdownIt('commonmark')

        // Detect markdown-it features
        if (
          typeof this.options.markdown === 'object' &&
          typeof this.options.markdown.parse === 'function' &&
          typeof this.options.markdown.renderer === 'object'
        )
          return this.options.markdown

        // Create instance with passed argument(s)
        return new MarkdownIt(...wrapArray(this.options.markdown))
      })(),
    )
  }

  /**
   * @type {MarkdownIt}
   */
  get markdown() {
    return this.#markdown
  }

  set markdown(md) {
    if (this.#markdown && this.#markdown.marpit) delete this.#markdown.marpit
    this.#markdown = md

    if (md) {
      Object.defineProperty(md, 'marpit', { configurable: true, value: this })
    }
  }

  /** @private */
  applyMarkdownItPlugins(md) {
    this.markdown = md

    const slideAnchorCallback = (...args) => {
      const { anchor } = this.options

      if (typeof anchor === 'function') return anchor(...args)
      if (anchor) return defaultAnchorCallback(...args)

      return undefined
    }

    md.use(marpitComment)
      .use(marpitStyleParse)
      .use(marpitSlide, { anchor: slideAnchorCallback })
      .use(marpitParseDirectives)
      .use(marpitApplyDirectives)
      .use(marpitHeaderAndFooter)
      .use(marpitHeadingDivider)
      .use(marpitSlideContainer)
      .use(marpitContainerPlugin)
      .use(marpitInlineSVG)
      .use(marpitImage)
      .use(marpitBackgroundImage)
      .use(marpitSweep)
      .use(marpitStyleAssign)
      .use(marpitFragment)
      .use(marpitCollect)
  }

  /**
   * @typedef {Object} Marpit~RenderResult
   * @property {string|string[]} html Rendered HTML.
   * @property {string} css Rendered CSS.
   * @property {string[][]} comments Parsed HTML comments per slide pages,
   *     excepted YAML for directives. It would be useful for presenter notes.
   */

  /**
   * Render Markdown into HTML and CSS string.
   *
   * @param {string} markdown A Markdown string.
   * @param {Object} [env={}] Environment object for passing to markdown-it.
   * @param {boolean} [env.htmlAsArray=false] Output rendered HTML as array per
   *     slide.
   * @returns {Marpit~RenderResult} An object of rendering result.
   */
  render(markdown, env = {}) {
    return {
      html: this.renderMarkdown(markdown, env),
      css: this.renderStyle(this.lastGlobalDirectives.theme),
      comments: this.lastComments,
    }
  }

  /**
   * Render Markdown by using `markdownIt#render`.
   *
   * This method is for internal. You can override this method if you have to
   * render with customized way.
   *
   * @private
   * @param {string} markdown A Markdown string.
   * @param {Object} [env] Environment object for passing to markdown-it.
   * @param {boolean} [env.htmlAsArray=false] Output rendered HTML as array per
   *     slide.
   * @returns {string|string[]} The result string(s) of rendering Markdown.
   */
  renderMarkdown(markdown, env = {}) {
    const tokens = this.markdown.parse(markdown, env)

    if (env.htmlAsArray) {
      return this.lastSlideTokens.map((slideTokens) =>
        this.markdown.renderer.render(slideTokens, this.markdown.options, env),
      )
    }

    return this.markdown.renderer.render(tokens, this.markdown.options, env)
  }

  /**
   * Render style by using `themeSet#pack`.
   *
   * This method is for internal.
   *
   * @private
   * @param {string|undefined} theme Theme name.
   * @returns {string} The result string of rendering style.
   */
  renderStyle(theme) {
    return this.themeSet.pack(theme, this.themeSetPackOptions())
  }

  /** @private */
  themeSetPackOptions() {
    return {
      after: this.lastStyles ? this.lastStyles.join('\n') : undefined,
      containers: [
        ...wrapArray(this.options.container),
        ...wrapArray(this.options.slideContainer),
      ],
      inlineSVG: this.inlineSVGOptions,
      printable: this.options.printable,
    }
  }

  /**
   * @private
   * @returns {Marpit~InlineSVGOptions} Options for inline SVG.
   */
  get inlineSVGOptions() {
    if (typeof this.options.inlineSVG === 'object') {
      return { ...defaultInlineSVGOptions, ...this.options.inlineSVG }
    }

    return { ...defaultInlineSVGOptions, enabled: !!this.options.inlineSVG }
  }

  /**
   * Load the specified markdown-it plugin with given parameters.
   *
   * @param {Function} plugin markdown-it plugin.
   * @param {...*} params Params to pass into plugin.
   * @returns {Marpit} The called {@link Marpit} instance for chainable.
   */
  use(plugin, ...params) {
    plugin.call(this.markdown, this.markdown, ...params)
    return this
  }
}

export default Marpit
