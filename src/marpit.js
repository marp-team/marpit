import MarkdownIt from 'markdown-it'
import wrapArray from './helpers/wrap_array'
import ThemeSet from './theme_set'
import { marpitContainer } from './element'
import marpitApplyDirectives from './markdown/directives/apply'
import marpitBackgroundImage from './markdown/background_image'
import marpitCollect from './markdown/collect'
import marpitComment from './markdown/comment'
import marpitContainerPlugin from './markdown/container'
import marpitHeaderAndFooter from './markdown/header_and_footer'
import marpitHeadingDivider from './markdown/heading_divider'
import marpitInlineSVG from './markdown/inline_svg'
import marpitParseDirectives from './markdown/directives/parse'
import marpitParseImage from './markdown/parse_image'
import marpitSlide from './markdown/slide'
import marpitSlideContainer from './markdown/slide_container'
import marpitStyleAssign from './markdown/style/assign'
import marpitStyleParse from './markdown/style/parse'
import marpitSweep from './markdown/sweep'

const defaultOptions = {
  backgroundSyntax: true,
  container: marpitContainer,
  filters: true,
  headingDivider: false,
  inlineStyle: true,
  looseYAML: false,
  markdown: 'commonmark',
  printable: true,
  scopedStyle: true,
  slideContainer: false,
  inlineSVG: false,
}

const shouldUseMarpit = env =>
  !(typeof env === 'object' && env.marpit === false)

const useMarpitRuler = (md, process) => {
  const ruler = Object.getPrototypeOf(md.core.ruler)
  const { after, at, before, push } = ruler

  const wrappedRule = fn => (state, ...args) =>
    shouldUseMarpit(state.env) && fn(state, ...args)

  const reset = () => {
    ruler.after = after
    ruler.at = at
    ruler.before = before
    ruler.push = push
  }

  try {
    ruler.after = function marpitAfter(afterName, ruleName, fn, options) {
      return after.call(this, afterName, ruleName, wrappedRule(fn), options)
    }

    ruler.at = function marpitAt(name, fn, options) {
      return at.call(this, name, wrappedRule(fn), options)
    }

    ruler.before = function marpitBefore(beforeName, ruleName, fn, options) {
      return before.call(this, beforeName, ruleName, wrappedRule(fn), options)
    }

    ruler.push = function marpitPush(ruleName, fn, options) {
      return push.call(this, ruleName, wrappedRule(fn), options)
    }

    process()
  } catch (e) {
    reset()
    throw e
  }

  reset()
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
   * @param {false|Element|Element[]}
   *     [opts.container={@link module:element.marpitContainer}] Container
   *     element(s) wrapping whole slide deck.
   * @param {boolean} [opts.filters=true] Support filter syntax for markdown
   *     image. It can apply to inline image and the advanced backgrounds.
   * @param {false|number|number[]} [opts.headingDivider=false] Start a new
   *     slide page at before of headings. it would apply to headings whose
   *     larger than or equal to the specified level if a number is given, or
   *     ONLY specified levels if a number array.
   * @param {boolean} [opts.inlineStyle=true] Recognize `<style>` elements to
   *     append additional styles to theme. When it is `true`, Marpit will parse
   *     style regardless markdown-it's `html` option.
   * @param {boolean} [opts.looseYAML=false] Allow loose YAML for directives.
   * @param {string|Object|Array} [opts.markdown='commonmark'] markdown-it
   *     initialize option(s).
   * @param {boolean} [opts.printable=true] Make style printable to PDF.
   * @param {boolean} [opts.scopedStyle=true] Support scoping inline style to
   *     the current slide through `<style scoped>` when `inlineStyle` is
   *     enabled.
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

    // Internal members
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
    const { filters, looseYAML, scopedStyle } = this.options

    useMarpitRuler(md, () => {
      md.use(marpitComment, { looseYAML })
        .use(marpitStyleParse, this)
        .use(marpitSlide)
        .use(marpitParseDirectives, this, { looseYAML })
        .use(marpitApplyDirectives, this)
        .use(marpitHeaderAndFooter)
        .use(marpitHeadingDivider, this)
        .use(marpitSlideContainer, this.slideContainers)
        .use(marpitContainerPlugin, this.containers)
        .use(marpitParseImage, { filters })
        .use(marpitSweep)
        .use(marpitInlineSVG, this)
        .use(marpitStyleAssign, this, { supportScoped: scopedStyle })
        .use(marpitCollect, this)
        .use(marpitBackgroundImage, this)
    })
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
   * @param {Object} [env] Environment object for passing to markdown-it.
   * @param {boolean} [env.htmlAsArray=false] Output rendered HTML as array per
   *     slide.
   * @returns {Marpit~RenderResult} An object of rendering result.
   */
  render(markdown, env = {}) {
    const html = this.renderMarkdown(markdown, env)

    if (shouldUseMarpit(env)) {
      return {
        html,
        css: this.renderStyle(this.lastGlobalDirectives.theme),
        comments: this.lastComments,
      }
    }

    return { html, css: '', comments: [] }
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
    if (env.htmlAsArray) {
      this.markdown.parse(markdown, env)

      return this.lastSlideTokens.map(slide =>
        this.markdown.renderer.render(slide, this.markdown.options, env)
      )
    }

    return this.markdown.render(markdown, env)
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
      containers: [...this.containers, ...this.slideContainers],
      inlineSVG: this.options.inlineSVG,
      printable: this.options.printable,
    }
  }

  /**
   * Load the specified markdown-it plugin with given parameters.
   *
   * Please notice the extended rule may disable by `marpit` env. Consider to
   * use `marpit.markdown.use()` if any problem was occurred.
   *
   * @param {Function} plugin markdown-it plugin.
   * @param {...*} params Params to pass into plugin.
   * @returns {Marpit} The called {@link Marpit} instance for chainable.
   */
  use(plugin, ...params) {
    useMarpitRuler(this.markdown, () =>
      plugin.call(this.markdown, this.markdown, ...params)
    )

    return this
  }
}

export default Marpit
