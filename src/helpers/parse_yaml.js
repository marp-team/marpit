/** @module */
import YAML, { FAILSAFE_SCHEMA } from 'js-yaml'

/**
 * Parse text as YAML by using js-yaml's FAILSAFE_SCHEMA.
 *
 * @alias module:helpers/parse_yaml
 * @param {String} text Target text.
 */
function parseYAML(text) {
  try {
    const obj = YAML.safeLoad(text, { schema: FAILSAFE_SCHEMA })
    if (obj === null || typeof obj !== 'object') return false

    return obj
  } catch (e) {
    return false
  }
}

export default parseYAML
