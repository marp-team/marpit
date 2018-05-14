import MarkdownIt from 'markdown-it'
import wrapArray from './helpers/wrap_array'
import ThemeSet from './theme_set'
import { marpitContainer } from './element'
import marpitApplyDirectives from './markdown/directives/apply'
import marpitBackgroundImage from './markdown/background_image'
import marpitComment from './markdown/comment'
import marpitContainerPlugin from './markdown/container'
import marpitHeaderAndFooter from './markdown/header_and_footer'
import marpitInlineSVG from './markdown/inline_svg'
import marpitParseDirectives from './markdown/directives/parse'
import marpitParseImage from './markdown/parse_image'
import marpitSlide from './markdown/slide'
import marpitSlideContainer from './markdown/slide_container'
import marpitSweep from './markdown/sweep'
import marpitUnicodeEmoji from './markdown/unicode_emoji'

const defaultOptions = {
  backgroundSyntax: true,
  container: marpitContainer,
  filters: true,
  markdown: 'commonmark',
  printable: true,
  slideContainer: undefined,
  inlineSVG: false,
}

/**
 * Parse Marpit Markdown and render to the slide HTML/CSS.
 */
class Marpit {
  /**
   * Create a Marpit instance.
   *
   * @param {Object} [opts]
   * @param {boolean} [opts.backgroundSyntax=true] Support markdown image syntax
   *     with the alternate text including `bg`. Normally it converts into spot
   *     directives about background image. If `inlineSVG` is enabled, it
   *     supports the advanced backgrounds.
   * @param {Element|Element[]}
   *     [opts.container={@link module:element.marpitContainer}] Container
   *     element(s) wrapping whole slide deck.
   * @param {boolean} [opts.filters=true] Support filter syntax for markdown
   *     image. It can apply to inline image and the advanced backgrounds.
   * @param {string|Object|Array} [opts.markdown='commonmark'] markdown-it
   *     initialize option(s).
   * @param {boolean} [opts.printable=true] Make style printable to PDF.
   * @param {Element|Element[]} [opts.slideContainer] Container element(s)
   *     wrapping each slide sections.
   * @param {boolean|'workaround'} [opts.inlineSVG=false] Wrap each sections by
   *     inline SVG. If you set `workaround`, a few basic styling in theme CSS
   *     will disable to avoid a rendering bug of Chromium. _(Experimental)_
   */
  constructor(opts = {}) {
    this.options = { ...defaultOptions, ...opts }

    Object.defineProperties(this, {
      containers: { value: [...wrapArray(this.options.container)] },
      slideContainers: { value: [...wrapArray(this.options.slideContainer)] },
    })

    /**
     * @type {ThemeSet}
     */
    this.themeSet = new ThemeSet()

    /**
     * @type {MarkdownIt}
     */
    this.markdown = new MarkdownIt(...wrapArray(this.options.markdown))
    this.applyMarkdownItPlugins()
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
  applyMarkdownItPlugins(md = this.markdown) {
    md
      .use(marpitComment)
      .use(marpitSlide)
      .use(marpitParseDirectives, this)
      .use(marpitApplyDirectives)
      .use(marpitHeaderAndFooter)
      .use(marpitSlideContainer, this.slideContainers)
      .use(marpitContainerPlugin, this.containers)
      .use(marpitParseImage, { filters: this.options.filters })
      .use(marpitUnicodeEmoji)
      .use(marpitSweep)
      .use(marpitInlineSVG, this)

    if (this.options.backgroundSyntax) md.use(marpitBackgroundImage)
  }

  /**
   * @typedef {Object} Marpit~RenderResult
   * @property {string} html Rendered HTML.
   * @property {string} css Rendered CSS.
   */

  /**
   * Render Markdown into HTML and CSS string.
   *
   * @param {string} markdown A Markdown string.
   * @returns {Marpit~RenderResult} An object of rendering result.
   */
  render(markdown) {
    return {
      html: this.renderMarkdown(markdown),
      css: this.renderStyle(this.lastGlobalDirectives.theme),
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
   * @returns {string} The result string of rendering Markdown.
   */
  renderMarkdown(markdown) {
    return this.markdown.render(markdown)
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
    return this.themeSet.pack(theme, {
      containers: [...this.containers, ...this.slideContainers],
      inlineSVG: this.options.inlineSVG,
      printable: this.options.printable,
    })
  }
}

export default Marpit
