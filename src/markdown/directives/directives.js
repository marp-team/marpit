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
 * @prop {Directive} style Specify the CSS style to apply additionally.
 * @prop {Directive} theme Specify theme of the slide deck.
 */
export const globals = {
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
 * @prop {Directive} backgroundImage Specify background-image style.
 * @prop {Directive} backgroundPosition Specify background-position style. The
 *     default value while setting backgroundImage is `center`.
 * @prop {Directive} backgroundRepeat Specify background-repeat style. The
 *     default value while setting backgroundImage is `no-repeat`.
 * @prop {Directive} backgroundSize Specify background-size style. The default
 *     value while setting backgroundImage is `cover`.
 * @prop {Directive} class Specify HTML class of section element(s).
 * @prop {Directive} footer Specify the content of slide footer. It will insert
 *     a `<footer>` element to the last of each slide contents.
 * @prop {Directive} header Specify the content of slide header. It will insert
 *     a `<header>` element to the first of each slide contents.
 * @prop {Directive} paginate Show page number on the slide if you set `true`.
 */
export const locals = {
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
    return { class: value }
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

export default { globals, locals }
