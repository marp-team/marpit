/** @module */
import postcss from 'postcss'
import emojiSequences from 'unicode-tr51/sequences'

// Generate unicode ranges from UTR#51 sequences
const codeSet = new Set()
emojiSequences.forEach(seq =>
  [...seq].forEach(code => codeSet.add(code.codePointAt(0)))
)

const codes = [...codeSet.values()].sort((a, b) => a - b)
let previousCode = codes[0]
const codeGroups = codes.reduce(
  (arr, code) => {
    const ret =
      code - previousCode <= 1
        ? [...arr.slice(0, -1), [...arr[arr.length - 1], code]]
        : [...arr, [code]]

    previousCode = code
    return ret
  },
  [[]]
)

export const unicodeRanges = codeGroups.reduce((arr, g) => {
  const start = `u+${g[0].toString(16)}`
  const end = g.length === 1 ? '' : `-${g[g.length - 1].toString(16)}`

  return [...arr, `${start}${end}`]
}, [])

export const defaultFamilyName = 'marpit-system-emoji'
export const defaultFonts = [
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Noto Color Emoji',
  'Segoe UI Symbol',
  'Android Emoji',
  'Twitter Color Emoji',
  'EmojiOne Color',
  'Symbola',
  'EmojiSymbols',
]

/**
 * Marpit PostCSS emoji font plugin.
 *
 * Prepend the definition of `marpit-system-emoji` web font.
 *
 * @alias module:postcss/emoji_font
 */
const plugin = postcss.plugin(
  'marpit-postcss-emoji-font',
  (familyName = defaultFamilyName, fonts = defaultFonts) => css => {
    css.first.before(
      `
@font-face {
  font-family: '${familyName}';
  src: ${fonts.map(f => `local('${f}')`).join(',')};
  unicode-range: ${unicodeRanges.join(' ')};
}
`.trim()
    )
  }
)

export default plugin
