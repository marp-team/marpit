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
 * @typedef {Function} Applier
 * @param {string} value A value of directive.
 * @param {Object} opts
 * @param {Token} opts.token The slide token of markdown-it.
 * @param {string[]} opts.styles The array of current style definitions.
 */

/**
 * Appliers for directive.
 *
 * @prop {Applier} class Assign `class` attribute to the slide token.
 * @prop {Applier} backgroundImage Add `background-image` style.
 * @prop {Applier} backgroundPosition Add `background-position` style.
 * @prop {Applier} backgroundRepeat Add `background-repeat` style.
 * @prop {Applier} backgroundSize Add `background-size` style.
 */
export const appliers = {
  class(value, { token }) {
    token.attrJoin('class', value)
  },
  backgroundImage(value, { styles }) {
    styles.push(`background-image:${value};`)
  },
  backgroundPosition(value, { styles }) {
    styles.push(`background-position:${value};`)
  },
  backgroundRepeat(value, { styles }) {
    styles.push(`background-repeat:${value};`)
  },
  backgroundSize(value, { styles }) {
    styles.push(`background-size:${value};`)
  },
}

/**
 * Global directives.
 *
 * Each global directive assigns to the whole slide deck. If you wrote a same
 * directive many times, Marpit only recognizes the last value.
 *
 * You can use prefix `$` as the name of a directive for the clarity (or
 * compatibility with the old version of Marp).
 *
 * @prop {Directive} theme Specify theme of the slide deck.
 */
export const globals = {
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
 * @prop {Directive} class Specify HTML class of section element(s).
 * @prop {Directive} backgroundImage Specify background-image style.
 * @prop {Directive} backgroundPosition Specify background-position style. There
 *     is defined `center` as the default style of scaffold.
 * @prop {Directive} backgroundRepeat Specify background-repeat style. There is
 *     defined `no-repeat` as the default style of scaffold.
 * @prop {Directive} backgroundSize Specify background-size style. There is
 *     defined `cover` as the default style of scaffold.
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
}

export default { appliers, globals, locals }
