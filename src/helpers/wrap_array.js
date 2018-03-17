/** @module */
/**
 * Wrap value in array if it is not an array.
 *
 * @alias module:helpers/wrap_array
 * @param  {*} valOrArr
 * @return {Array}
 */
const wrapArray = valOrArr => {
  if (valOrArr == null || valOrArr === false) return []
  if (valOrArr instanceof Array) return valOrArr
  return [valOrArr]
}

export default wrapArray
