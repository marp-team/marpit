/** @module */
/**
 * Split array into multiple arrays by specified condition.
 *
 * @alias module:helpers/split
 * @param {Array} arr Target array.
 * @param {splitCallback} func Callback to split array.
 * @param {boolean} [keepSplitedValue=false] Keep splited value. The split
 *     point is before the matched value.
 * @returns {Array[]} Splited array.
 */
function split(arr, func, keepSplitedValue = false) {
  return arr.reduce(
    (ret, value) => {
      /**
       * Return true at the split point.
       *
       * @callback splitCallback
       * @param {*} value
       */
      if (func(value)) return [...ret, keepSplitedValue ? [value] : []]

      ret[ret.length - 1].push(value)
      return ret
    },
    [[]]
  )
}

export default split
