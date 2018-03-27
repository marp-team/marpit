import MarkdownIt from 'markdown-it'
import wrapArray from './helpers/wrap_array'
import ThemeSet from './theme_set'
import { marpitContainer } from './element'
import markdownItApplyDirectives from './markdown/directives/apply'
import markdownItComment from './markdown/comment'
import markdownItContainer from './markdown/container'
import markdownItInlineSVG from './markdown/inline_svg'
import markdownItParseDirectives from './markdown/directives/parse'
import markdownItSlide from './markdown/slide'
import markdownItSlideContainer from './markdown/slide_container'

const defaultOptions = {
  container: marpitContainer,
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
   * @param {Element|Element[]}
   *     [opts.container={@link module:element.marpitContainer}] Container
   *     element(s) wrapping whole slide deck.
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
      .use(markdownItComment)
      .use(markdownItSlide)
      .use(markdownItParseDirectives, this)
      .use(markdownItApplyDirectives)
      .use(markdownItSlideContainer, this.slideContainers)
      .use(markdownItContainer, this.containers)

    if (this.options.inlineSVG) this.markdown.use(markdownItInlineSVG, this)
  }

  render(markdown) {
    const html = this.renderMarkdown(markdown)

    const css = this.themeSet.pack(this.lastGlobalDirectives.theme, {
      containers: [...this.containers, ...this.slideContainers],
      inlineSVG: this.options.inlineSVG,
      printable: this.options.printable,
    })

    return { html, css }
  }

  renderMarkdown(markdown) {
    return this.markdown.render(markdown)
  }
}

export default Marpit
