/** @module */
import YAML, { FAILSAFE_SCHEMA } from 'js-yaml'
import directives from './directives'

/**
 * Parse text as YAML by using js-yaml's FAILSAFE_SCHEMA.
 *
 * @alias module:markdown/directives/yaml
 * @param {String} text Target text.
 * @param {boolean} allowLoose By `true`, it try to parse loose YAML in defined
 *     directives.
 * @returns {Object|false} Return parse result, or `false` when failed to parse.
 */

const keyPattern = `[_$]?(?:${directives.join('|')})`
const looseMatcher = new RegExp(`^(${keyPattern}\\s*:)(.+)$`)
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

function convertLoose(text) {
  let normalized = ''

  for (const line of text.split(/\r?\n/))
    normalized += `${line.replace(looseMatcher, (original, prop, value) => {
      const trimmed = value.trim()

      if (trimmed.length === 0 || specialChars.includes(trimmed[0]))
        return original

      const spaceLength = value.length - value.trimLeft().length
      const spaces = value.substring(0, spaceLength)

      return `${prop}${spaces}"${trimmed.split('"').join('\\"')}"`
    })}\n`

  return normalized.trim()
}

export default (text, allowLoose) =>
  parse(allowLoose ? convertLoose(text) : text)
