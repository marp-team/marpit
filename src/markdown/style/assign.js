/** @module */
import postcss from 'postcss'
import postcssPlugin from '../../helpers/postcss_plugin'
import marpitPlugin from '../../plugin'

const uniqKeyChars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const uniqKeyCharsLength = uniqKeyChars.length

const generateScopeAttr = (uniqKey) => `data-marpit-scope-${uniqKey}`
const generateUniqKey = (length = 8) => {
  let ret = ''

  for (let i = 0; i < length; i += 1)
    ret += uniqKeyChars[Math.floor(Math.random() * uniqKeyCharsLength)]

  return ret
}

const injectScopePostCSSplugin = postcssPlugin(
  'marpit-style-assign-postcss-inject-scope',
  (key, keyframeSet) => (css) =>
    css.each(function inject(node) {
      const { type, name } = node

      if (type === 'atrule') {
        if (name === 'keyframes' && node.params) {
          keyframeSet.add(node.params)
          node.params += `-${key}`
        } else if (name === 'media' || name === 'supports') {
          node.each(inject)
        }
      } else if (type === 'rule') {
        node.selectors = node.selectors.map((selector) => {
          const injectSelector = /^section(?![\w-])/.test(selector)
            ? selector.slice(7)
            : ` ${selector}`

          return `section[${generateScopeAttr(key)}]${injectSelector}`
        })
      }
    })
)

const scopeKeyframesPostCSSPlugin = postcssPlugin(
  'marpit-style-assign-postcss-scope-keyframes',
  (key, keyframeSet) => (css) => {
    if (keyframeSet.size === 0) return

    const keyframeMatcher = new RegExp(
      `\\b(${[...keyframeSet.values()]
        .map((kf) => kf.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'))
        .join('|')})(?!\\()\\b`
    )

    css.walkDecls(/^animation(-name)?$/, (decl) => {
      decl.value = decl.value.replace(keyframeMatcher, (kf) => `${kf}-${key}`)
    })
  }
)

/**
 * Marpit style assign plugin.
 *
 * Assign style global directive and parsed styles to Marpit instance's
 * `lastStyles' property.
 *
 * @function assign
 * @param {MarkdownIt} md markdown-it instance.
 */
function _assign(md) {
  const { marpit } = md

  md.core.ruler.after('marpit_slide', 'marpit_style_assign', (state) => {
    if (state.inlineMode) return

    const directives = marpit.lastGlobalDirectives || {}
    marpit.lastStyles = directives.style ? [directives.style] : []

    let current

    for (const token of state.tokens) {
      if (token.meta && token.meta.marpitSlideElement === 1) {
        current = token
      } else if (token.meta && token.meta.marpitSlideElement === -1) {
        if (current.meta && current.meta.marpitStyleScoped) {
          const { key, keyframeSet, styles } = current.meta.marpitStyleScoped

          // Rewrite keyframes name in animation decls
          const processor = postcss([
            scopeKeyframesPostCSSPlugin(key, keyframeSet),
          ])

          current.meta.marpitStyleScoped.styles = styles.map((style) => {
            try {
              return processor.process(style).css
            } catch (e) {
              return style
            }
          })

          // Assign scoped styles
          marpit.lastStyles.push(...current.meta.marpitStyleScoped.styles)
        }
        current = undefined
      } else if (token.type === 'marpit_style') {
        const { content } = token

        // Scoped style
        const { marpitStyleScoped } = token.meta || {}

        if (current && marpitStyleScoped) {
          current.meta = current.meta || {}
          current.meta.marpitStyleScoped = current.meta.marpitStyleScoped || {}

          let { key } = current.meta.marpitStyleScoped

          if (!key) {
            key = generateUniqKey()

            current.meta.marpitStyleScoped.key = key
            current.attrSet(generateScopeAttr(key), '')
          }

          current.meta.marpitStyleScoped.styles =
            current.meta.marpitStyleScoped.styles || []

          current.meta.marpitStyleScoped.keyframeSet =
            current.meta.marpitStyleScoped.keyframeSet || new Set()

          const processor = postcss([
            injectScopePostCSSplugin(
              key,
              current.meta.marpitStyleScoped.keyframeSet
            ),
          ])

          try {
            current.meta.marpitStyleScoped.styles.push(
              processor.process(content).css
            )
          } catch (e) {
            // No ops
          }
        } else if (content) {
          // Global style
          marpit.lastStyles.push(content)
        }
      }
    }
  })
}

export const assign = marpitPlugin(_assign)
export default assign
