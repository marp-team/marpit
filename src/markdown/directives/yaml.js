/** @module */
import YAML, { FAILSAFE_SCHEMA } from 'js-yaml'
import directives from './directives'

const createPatterns = (keys) => {
  const set = new Set()

  for (const k of keys) {
    const normalized = '_?' + k.replace(/[.*+?^=!:${}()|[\]\\/]/g, '\\$&')

    set.add(normalized)
    set.add(`"${normalized}"`)
    set.add(`'${normalized}'`)
  }

  return [...set.values()]
}

const yamlSpecialChars = `["'{|>~&*`

function parse(text) {
  try {
    const obj = YAML.load(text, { schema: FAILSAFE_SCHEMA })
    if (obj === null || typeof obj !== 'object') return false

    return obj
  } catch (e) {
    return false
  }
}

function convertLoose(text, looseDirectives) {
  const keyPattern = `(?:${createPatterns(looseDirectives).join('|')})`
  const looseMatcher = new RegExp(`^(${keyPattern}\\s*:)(.+)$`)

  let normalized = ''

  for (const line of text.split(/\r?\n/))
    normalized += `${line.replace(looseMatcher, (original, prop, value) => {
      const trimmed = value.trim()

      if (trimmed.length === 0 || yamlSpecialChars.includes(trimmed[0]))
        return original

      const spaceLength = value.length - value.trimLeft().length
      const spaces = value.substring(0, spaceLength)

      return `${prop}${spaces}"${trimmed.split('"').join('\\"')}"`
    })}\n`

  return normalized.trim()
}

/**
 * Parse text as YAML by using js-yaml's FAILSAFE_SCHEMA.
 *
 * @alias module:markdown/directives/yaml
 * @param {String} text Target text.
 * @param {boolean|string[]} [looseDirectives=false] By setting `true`, it try
 *     to parse as loose YAML only in defined Marpit built-in directives. You
 *     may also extend target keys for loose parsing by passing an array of
 *     strings.
 * @returns {Object|false} Return parse result, or `false` when failed to parse.
 */

export default (text, looseDirectives = false) =>
  parse(
    looseDirectives
      ? convertLoose(text, [
          ...directives,
          ...(Array.isArray(looseDirectives) ? looseDirectives : []),
        ])
      : text
  )
