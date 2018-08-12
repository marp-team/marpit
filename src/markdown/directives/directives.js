/**
 * The definition of Marpit directives
 * @module
 */

/**
 * @typedef {Function} Directive
 * @param {string} value Parsed value.
 * @param {Marpit} marpit Marpit instance.
 * @returns {Object} Assigning object to token meta.
 */

/**
 * Global directives.
 *
 * Each global directive assigns to the whole slide deck. If you wrote a same
 * directive many times, Marpit only recognizes the last value.
 *
 * You can use prefix `$` as the name of a directive for the clarity (or
 * compatibility with the old version of Marp).
 *
 * @prop {Directive} headingDivider Specify heading divider option.
 * @prop {Directive} style Specify the CSS style to apply additionally.
 * @prop {Directive} theme Specify theme of the slide deck.
 */
export const globals = {
  headingDivider(value) {
    const headings = [1, 2, 3, 4, 5, 6]
    const toInt = v =>
      Array.isArray(v) || Number.isNaN(v) ? v : Number.parseInt(v, 10)
    const converted = toInt(value)

    if (Array.isArray(converted)) {
      const convertedArr = converted.map(toInt)
      return {
        headingDivider: headings.filter(v => convertedArr.includes(v)),
      }
    }

    if (value === 'false') return { headingDivider: false }
    if (headings.includes(converted)) return { headingDivider: converted }

    return {}
  },
  style(value) {
    return { style: value }
  },
  theme(value, marpit) {
    if (!marpit.themeSet.has(value)) return {}
    return { theme: value }
  },
}

/**
 * Local directives.
 *
 * Mainly these are used to change settings each slide page. By default, a
 * local directive applies to the defined page and followed pages.
 *
 * If you want to set a local directive to single page only, you can add the
 * prefix `_` (underbar) to directive name. (Spot directives)
 *
 * @prop {Directive} backgroundColor Specify background-color style.
 * @prop {Directive} backgroundImage Specify background-image style.
 * @prop {Directive} backgroundPosition Specify background-position style. The
 *     default value while setting backgroundImage is `center`.
 * @prop {Directive} backgroundRepeat Specify background-repeat style. The
 *     default value while setting backgroundImage is `no-repeat`.
 * @prop {Directive} backgroundSize Specify background-size style. The default
 *     value while setting backgroundImage is `cover`.
 * @prop {Directive} class Specify HTML class of section element(s).
 * @prop {Directive} color Specify color style (base text color).
 * @prop {Directive} footer Specify the content of slide footer. It will insert
 *     a `<footer>` element to the last of each slide contents.
 * @prop {Directive} header Specify the content of slide header. It will insert
 *     a `<header>` element to the first of each slide contents.
 * @prop {Directive} paginate Show page number on the slide if you set `true`.
 */
export const locals = {
  backgroundColor(value) {
    return { backgroundColor: value }
  },
  backgroundImage(value) {
    return { backgroundImage: value }
  },
  backgroundPosition(value) {
    return { backgroundPosition: value }
  },
  backgroundRepeat(value) {
    return { backgroundRepeat: value }
  },
  backgroundSize(value) {
    return { backgroundSize: value }
  },
  class(value) {
    return { class: Array.isArray(value) ? value.join(' ') : value }
  },
  color(value) {
    return { color: value }
  },
  footer(value) {
    return { footer: value }
  },
  header(value) {
    return { header: value }
  },
  paginate(value) {
    return { paginate: (value || '').toLowerCase() === 'true' }
  },
}

const directiveNames = [...Object.keys(globals), ...Object.keys(locals)]

export default directiveNames
