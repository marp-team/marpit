import postcss from 'postcss'
import postcssImportParse from './postcss/import/parse'
import postcssMeta from './postcss/meta'
import postcssSectionSize from './postcss/section_size'

const absoluteUnits = {
  cm: v => (v * 960) / 25.4,
  in: v => v * 96,
  mm: v => (v * 96) / 25.4,
  pc: v => v * 16,
  pt: v => (v * 4) / 3,
  px: v => v,
}

const convertToPixel = value => {
  if (typeof value !== 'string') return undefined

  const matched = value.match(/^(-?[.0-9]+)([a-z]+)$/i)
  if (!matched) return undefined

  const [, num, unit] = matched
  const parsed = Number.parseFloat(num)
  if (Number.isNaN(parsed)) return undefined

  const conv = absoluteUnits[unit]
  return conv ? conv(parsed) : undefined
}

const memoizeProp = name => `${name}Memoized`
const postcssParser = postcss([
  postcssMeta,
  postcssSectionSize,
  postcssImportParse,
])

/**
 * Marpit theme class.
 */
class Theme {
  /**
   * Create a Theme instance.
   *
   * You should use {@link Theme.fromCSS} unless there is some particular
   * reason.
   *
   * @param {string} name The name of theme.
   * @param {string} css The content of CSS.
   * @hideconstructor
   */
  constructor(name, css) {
    /**
     * The name of theme.
     * @type {string}
     */
    this.name = name

    /**
     * The content of theme CSS.
     * @type {string}
     */
    this.css = css

    /**
     * Parsed metadata from CSS comments.
     * @type {Object}
     */
    this.meta = {}

    /**
     * Parsed `@import` rules.
     * @type {module:postcss/import/parse~ImportMeta[]}
     */
    this.importRules = []

    /**
     * Slide width. It requires the absolute unit supported in CSS.
     * @type {string}
     */
    this.width = undefined

    /**
     * Slide height. It requires the absolute unit supported in CSS.
     * @type {string}
     */
    this.height = undefined

    this.memoizeInit('width')
    this.memoizeInit('height')
  }

  /**
   * Create a Theme instance from Marpit theme CSS.
   *
   * @alias Theme.fromCSS
   * @param {string} cssString The string of Marpit theme CSS. It requires
   *     `@theme` meta comment.
   */
  static fromCSS(cssString, validate = true) {
    const processed = postcssParser.process(cssString)
    const { css, result } = processed

    // validate option is for internal usage. User should never set as false.
    if (validate && !result.marpitMeta.theme)
      throw new Error('Marpit theme CSS requires @theme meta.')

    const theme = new Theme(result.marpitMeta.theme, css)

    theme.importRules = [...result.marpitImport]
    theme.meta = { ...result.marpitMeta }

    Object.assign(theme, { ...result.marpitSectionSize })

    return Object.freeze(theme)
  }

  /**
   * The converted width into pixel.
   *
   * @alias Theme#widthPixel
   * @type {number}
   * @readonly
   */
  get widthPixel() {
    return this.memoize('width', convertToPixel)
  }

  /**
   * The converted height into pixel.
   *
   * @alias Theme#heightPixel
   * @type {number}
   * @readonly
   */
  get heightPixel() {
    return this.memoize('height', convertToPixel)
  }

  /** @private */
  memoize(prop, func) {
    if (this[memoizeProp(prop)].has(this[prop]))
      return this[memoizeProp(prop)].get(this[prop])

    const converted = func(this[prop])
    this[memoizeProp(prop)].set(this[prop], converted)
    return converted
  }

  /** @private */
  memoizeInit(prop) {
    if (!this[memoizeProp(prop)])
      Object.defineProperty(this, memoizeProp(prop), { value: new Map() })
  }
}

export default Theme
