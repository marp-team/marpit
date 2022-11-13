/** @module */
/**
 * Wrap value in array if it is not an array.
 *
 * @function wrapArray
 * @param  {*} valOrArr
 * @return {Array}
 */
export const wrapArray = (valOrArr) => {
  if (valOrArr == null || valOrArr === false) return []
  if (valOrArr instanceof Array) return valOrArr
  return [valOrArr]
}

export default wrapArray
