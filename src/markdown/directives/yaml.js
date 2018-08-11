/** @module */
import YAML, { FAILSAFE_SCHEMA } from 'js-yaml'
import directives from './directives'

/**
 * Parse text as YAML by using js-yaml's FAILSAFE_SCHEMA.
 *
 * @alias module:markdown/directives/yaml
 * @param {String} text Target text.
 * @param {boolean} allowLazy By `true`, it try to parse lazy YAML at first.
 * @returns {Object|false} Return parse result, or `false` when failed to parse.
 */

const keyPattern = `[_$]?(?:${directives.join('|')})`
const directivesMatcher = new RegExp(`^\\s*(${keyPattern})\\s*:(.*)$`)
const specialChars = `["'{|>~&*`
const whitespaceMatcher = /^\s*$/

function strict(text) {
  try {
    const obj = YAML.safeLoad(text, { schema: FAILSAFE_SCHEMA })
    if (obj === null || typeof obj !== 'object') return false

    return obj
  } catch (e) {
    return false
  }
}

function lazy(text) {
  const collected = {}
  const lines = text.split(/\r?\n/)

  return lines.every(line => {
    if (whitespaceMatcher.test(line)) return true

    const matched = directivesMatcher.exec(line)
    if (!matched) return false

    const [, directive, originalValue] = matched
    const value = originalValue.trim()
    if (specialChars.includes(value[0])) return false

    collected[directive] = value
    return true
  })
    ? collected
    : false
}

export default function(text, allowLazy) {
  if (allowLazy) {
    const lazyResult = lazy(text)
    if (lazyResult !== false) return lazyResult
  }

  return strict(text)
}
