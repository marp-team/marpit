/** @module */
import { scaffoldTheme } from '../theme/scaffold'
import postcssBefore from './before'

/**
 * Marpit PostCSS scaffold plugin.
 *
 * Prepend scaffold theme CSS into before style.
 *
 * @function scaffold
 */
export const scaffold = Object.defineProperty(
  { ...postcssBefore(scaffoldTheme.css) },
  'postcssPlugin',
  { value: 'marpit-pack-scaffold' },
)

export default scaffold
