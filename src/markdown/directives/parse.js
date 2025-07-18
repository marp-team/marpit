/** @module */
import MarkdownItFrontMatter from 'markdown-it-front-matter'
import marpitPlugin from '../../plugin'
import { markAsParsed } from '../comment'
import * as directives from './directives'
import { yaml } from './yaml'

const isDirectiveComment = (token) =>
  token.type === 'marpit_comment' && token.meta.marpitParsedDirectives

/**
 * Parse Marpit directives and store result to the slide token meta.
 *
 * Marpit comment plugin and slide plugin requires already loaded to
 * markdown-it instance.
 *
 * @function parse
 * @param {MarkdownIt} md markdown-it instance.
 * @param {Object} [opts]
 * @param {boolean} [opts.frontMatter=true] Switch feature to support YAML
 *     front-matter. If true, you can use Jekyll style directive setting to the
 *     first page.
 */
function _parse(md, opts = {}) {
  const { marpit } = md

  const applyBuiltinDirectives = (newProps, builtinDirectives) => {
    let ret = {}

    for (const prop of Object.keys(newProps)) {
      if (builtinDirectives[prop]) {
        ret = { ...ret, ...builtinDirectives[prop](newProps[prop], marpit) }
      } else {
        ret[prop] = newProps[prop]
      }
    }

    return ret
  }

  // Front-matter support
  const frontMatter = opts.frontMatter === undefined ? true : !!opts.frontMatter
  let frontMatterObject = {}

  if (frontMatter) {
    md.core.ruler.before('block', 'marpit_directives_front_matter', (state) => {
      frontMatterObject = {}
      if (!state.inlineMode) marpit.lastGlobalDirectives = {}
    })
    md.use(MarkdownItFrontMatter, (fm) => {
      frontMatterObject.text = fm

      const parsed = yaml(
        fm,
        marpit.options.looseYAML
          ? [
              ...Object.keys(marpit.customDirectives.global),
              ...Object.keys(marpit.customDirectives.local),
            ]
          : false,
      )
      if (parsed !== false) frontMatterObject.yaml = parsed
    })
  }

  // Parse global directives
  md.core.ruler.after('inline', 'marpit_directives_global_parse', (state) => {
    if (state.inlineMode) return

    let globalDirectives = {}
    const applyDirectives = (obj) => {
      let recognized = false

      for (const key of Object.keys(obj)) {
        if (directives.globals[key]) {
          recognized = true
          globalDirectives = {
            ...globalDirectives,
            ...directives.globals[key](obj[key], marpit),
          }
        } else if (marpit.customDirectives.global[key]) {
          recognized = true
          globalDirectives = {
            ...globalDirectives,
            ...applyBuiltinDirectives(
              marpit.customDirectives.global[key](obj[key], marpit),
              directives.globals,
            ),
          }
        }
      }

      return recognized
    }

    if (frontMatterObject.yaml) applyDirectives(frontMatterObject.yaml)

    for (const token of state.tokens) {
      if (
        isDirectiveComment(token) &&
        applyDirectives(token.meta.marpitParsedDirectives)
      ) {
        markAsParsed(token, 'directive')
      } else if (token.type === 'inline') {
        for (const t of token.children) {
          if (
            isDirectiveComment(t) &&
            applyDirectives(t.meta.marpitParsedDirectives)
          )
            markAsParsed(t, 'directive')
        }
      }
    }

    marpit.lastGlobalDirectives = { ...globalDirectives }
  })

  // Parse local directives and apply meta to slide
  md.core.ruler.after('marpit_slide', 'marpit_directives_parse', (state) => {
    if (state.inlineMode) return

    const slides = []
    const cursor = { slide: undefined, local: {}, spot: {} }

    const applyDirectives = (obj) => {
      let recognized = false

      for (const key of Object.keys(obj)) {
        if (directives.locals[key]) {
          recognized = true
          cursor.local = {
            ...cursor.local,
            ...directives.locals[key](obj[key], marpit),
          }
        } else if (marpit.customDirectives.local[key]) {
          recognized = true
          cursor.local = {
            ...cursor.local,
            ...applyBuiltinDirectives(
              marpit.customDirectives.local[key](obj[key], marpit),
              directives.locals,
            ),
          }
        }

        // Spot directives
        // (Apply local directive to only current slide by prefix "_")
        if (key.startsWith('_')) {
          const spotKey = key.slice(1)

          if (directives.locals[spotKey]) {
            recognized = true
            cursor.spot = {
              ...cursor.spot,
              ...directives.locals[spotKey](obj[key], marpit),
            }
          } else if (marpit.customDirectives.local[spotKey]) {
            recognized = true
            cursor.spot = {
              ...cursor.spot,
              ...applyBuiltinDirectives(
                marpit.customDirectives.local[spotKey](obj[key], marpit),
                directives.locals,
              ),
            }
          }
        }
      }

      return recognized
    }

    if (frontMatterObject.yaml) applyDirectives(frontMatterObject.yaml)

    for (const token of state.tokens) {
      if (token.meta && token.meta.marpitSlideElement === 1) {
        // Initialize Marpit directives meta
        token.meta.marpitDirectives = {}

        slides.push(token)
        cursor.slide = token
      } else if (token.meta && token.meta.marpitSlideElement === -1) {
        // Assign local and spot directives to meta
        cursor.slide.meta.marpitDirectives = {
          ...cursor.slide.meta.marpitDirectives,
          ...cursor.local,
          ...cursor.spot,
        }

        cursor.spot = {}
      } else if (
        isDirectiveComment(token) &&
        applyDirectives(token.meta.marpitParsedDirectives)
      ) {
        markAsParsed(token, 'directive')
      } else if (token.type === 'inline') {
        for (const t of token.children) {
          if (
            isDirectiveComment(t) &&
            applyDirectives(t.meta.marpitParsedDirectives)
          )
            markAsParsed(t, 'directive')
        }
      }
    }

    // Assign global directives to meta
    for (const token of slides)
      token.meta.marpitDirectives = {
        ...token.meta.marpitDirectives,
        ...marpit.lastGlobalDirectives,
      }
  })
}

export const parse = marpitPlugin(_parse)
export default parse
