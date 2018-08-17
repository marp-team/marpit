/** @module */
import YAML, { FAILSAFE_SCHEMA } from 'js-yaml'
import directives from './directives'

/**
 * Parse text as YAML by using js-yaml's FAILSAFE_SCHEMA.
 *
 * @alias module:markdown/directives/yaml
 * @param {String} text Target text.
 * @param {boolean} allowLazy By `true`, it try to parse lazy YAML in defined
 *     directives.
 * @returns {Object|false} Return parse result, or `false` when failed to parse.
 */

const keyPattern = `[_$]?(?:${directives.join('|')})`
const lazyMatcher = new RegExp(`^(\\s*(?:-\\s+)?(?:${keyPattern})\\s*:)(.+)$`)
const specialChars = `["'{|>~&*`

function parse(text) {
  try {
    const obj = YAML.safeLoad(text, { schema: FAILSAFE_SCHEMA })
    if (obj === null || typeof obj !== 'object') return false

    return obj
  } catch (e) {
    return false
  }
}

function convertLazy(text) {
  return text
    .split(/\r?\n/)
    .reduce(
      (ret, line) =>
        `${ret}${line.replace(lazyMatcher, (original, prop, value) => {
          const trimmed = value.trim()

          if (trimmed.length === 0 || specialChars.includes(trimmed[0]))
            return original

          const spaceLength = value.length - value.trimLeft().length
          const spaces = value.substring(0, spaceLength)

          return `${prop}${spaces}"${trimmed.split('"').join('\\"')}"`
        })}\n`,
      ''
    )
    .trim()
}

export default (text, allowLazy) => parse(allowLazy ? convertLazy(text) : text)
