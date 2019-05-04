import MarkdownIt from 'markdown-it'
import wrapArray from './helpers/wrap_array'
import ThemeSet from './theme_set'
import { marpitContainer } from './element'
import marpitApplyDirectives from './markdown/directives/apply'
import marpitBackgroundImage from './markdown/background_image'
import marpitCollect from './markdown/collect'
import marpitComment from './markdown/comment'
import marpitContainerPlugin from './markdown/container'
import marpitFragment from './markdown/fragment'
import marpitHeaderAndFooter from './markdown/header_and_footer'
import marpitHeadingDivider from './markdown/heading_divider'
import marpitInlineSVG from './markdown/inline_svg'
import marpitParseDirectives from './markdown/directives/parse'
import marpitImage from './markdown/image'
import marpitSlide from './markdown/slide'
import marpitSlideContainer from './markdown/slide_container'
import marpitStyleAssign from './markdown/style/assign'
import marpitStyleParse from './markdown/style/parse'
import marpitSweep from './markdown/sweep'

const defaultOptions = {
  container: marpitContainer,
  headingDivider: false,
  looseYAML: false,
  markdown: 'commonmark',
  printable: true,
  slideContainer: false,
  inlineSVG: false,
}

/**
 * Parse Marpit Markdown and render to the slide HTML/CSS.
 */
class Marpit {
  #markdown = undefined

  /**
   * Create a Marpit instance.
   *
   * @param {Object} [opts]
   * @param {false|Element|Element[]}
   *     [opts.container={@link module:element.marpitContainer}] Container
   *     element(s) wrapping whole slide deck.
   * @param {false|number|number[]} [opts.headingDivider=false] Start a new
   *     slide page at before of headings. it would apply to headings whose
   *     larger than or equal to the specified level if a number is given, or
   *     ONLY specified levels if a number array.
   * @param {boolean} [opts.looseYAML=false] Allow loose YAML for directives.
   * @param {string|Object|Array} [opts.markdown='commonmark'] markdown-it
   *     initialize option(s).
   * @param {boolean} [opts.printable=true] Make style printable to PDF.
   * @param {false|Element|Element[]} [opts.slideContainer] Container element(s)
   *     wrapping each slide sections.
   * @param {boolean} [opts.inlineSVG=false] Wrap each sections by inline SVG.
   *     _(Experimental)_
   */
  constructor(opts = {}) {
    /**
     * The current options for this instance.
     *
     * This property is read-only and marked as immutable. You cannot change the
     * value of options after creating instance.
     *
     * @member {Object} options
     * @memberOf Marpit
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
     * @memberOf Marpit
     * @readonly
     */
    Object.defineProperty(this, 'customDirectives', {
      value: Object.seal({ global: {}, local: {} }),
    })

    /**
     * @type {ThemeSet}
     */
    this.themeSet = new ThemeSet()

    this.applyMarkdownItPlugins(
      new MarkdownIt(...wrapArray(this.options.markdown))
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

  /**
   * The plugin interface of markdown-it for current Marpit instance.
   *
   * This is useful to integrate Marpit with the other markdown-it based parser.
   *
   * @type {Function}
   * @readonly
   */
  get markdownItPlugins() {
    return this.applyMarkdownItPlugins.bind(this)
  }

  /** @private */
  applyMarkdownItPlugins(md) {
    this.markdown = md

    md.use(marpitComment)
      .use(marpitStyleParse)
      .use(marpitSlide)
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
      return this.lastSlideTokens.map(slideTokens =>
        this.markdown.renderer.render(slideTokens, this.markdown.options, env)
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
      inlineSVG: this.options.inlineSVG,
      printable: this.options.printable,
    }
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
