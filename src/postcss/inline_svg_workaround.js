/** @module */
import postcss from 'postcss'

const allowOverflowProps = ['visible', 'hidden', 'inherit', 'initial', 'unset']

const commentOut = node =>
  node.replaceWith(`${node.raw('before')}/* ${node.toString()}; */`)

/**
 * Marpit PostCSS inline SVG workaround plugin.
 *
 * It will comment out declarations that cause problems by rendering in inline
 * SVG. Especially in Google Chrome, a lot of issues about the rendering of
 * `<foreignObject>` have been reported.
 *
 * @see https://bugs.chromium.org/p/chromium/issues/detail?id=771852
 * @alias module:postcss/inline_svg_workaround
 */
const plugin = postcss.plugin(
  'marpit-postcss-inline-svg-workaround',
  () => css => {
    css.walkDecls(/^position|transform$/, decl => commentOut(decl))
    css.walkDecls(/^overflow(-[xy])?$/, decl => {
      if (!allowOverflowProps.includes(decl.value)) commentOut(decl)
    })
  }
)

export default plugin
