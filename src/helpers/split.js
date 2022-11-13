/** @module */
/**
 * Split array into multiple arrays by specified condition.
 *
 * @param {Array} arr Target array.
 * @param {splitCallback} func Callback to split array.
 * @param {boolean} [keepSplitedValue=false] Keep splited value. The split
 *     point is before the matched value.
 * @returns {Array[]} Splited array.
 */
export function split(arr, func, keepSplitedValue = false) {
  const ret = [[]]

  for (const value of arr) {
    /**
     * Return true at the split point.
     *
     * @callback splitCallback
     * @param {*} value
     */
    if (func(value)) {
      ret.push(keepSplitedValue ? [value] : [])
    } else {
      ret[ret.length - 1].push(value)
    }
  }

  return ret
}

export default split
