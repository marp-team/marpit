import postcss from 'postcss'
import { containerQuery, postprocess } from '../../src/postcss/container_query'
import { findDecl, findRule } from '../_supports/postcss_finder'

describe('Marpit PostCSS container query plugin', () => {
  const run = (input, args = []) =>
    postcss([containerQuery(...args), postprocess]).process(input, {
      from: undefined,
    })

  it('prepends style for container query', async () => {
    const css = await run('section { width: 1280px; height: 960px; }')

    expect(css.css).toMatchInlineSnapshot(`
":where(section) {
  container-type: size;
}
section { width: 1280px; height: 960px; }"
`)
  })

  context('with container name', () => {
    const findContainerNameDecl = (node) => {
      const rule = findRule(node, {
        selector: (selector) => selector.includes('section'),
      })

      return findDecl(rule, { prop: 'container-name' })
    }

    it('prepends style for container query with name', async () => {
      const { root } = await run('', ['marpit'])

      expect(findContainerNameDecl(root).value).toBe('marpit')
    })

    it('escapes container name', async () => {
      const { root } = await run('', ['123 test'])

      expect(findContainerNameDecl(root).value).toBe('\\31 23\\ test')
    })

    it('does not assign name if the name is empty', async () => {
      const { root } = await run('', [''])

      expect(findContainerNameDecl(root)).toBeFalsy()
    })

    it('does not assign name if the name has a reserved value', async () => {
      for (const name of [
        'none',
        'inherit',
        'initial',
        'revert',
        'revert-layer',
        'unset',
      ]) {
        const { root } = await run('', [name])

        expect(findContainerNameDecl(root)).toBeFalsy()
      }
    })

    it('allows multiple names by passing array of strings', async () => {
      const { root } = await run('', [['a', 'b', 'c']])

      expect(findContainerNameDecl(root).value).toBe('a b c')
    })

    it('skips invalid name in array of strings', async () => {
      const { root } = await run('', [['test', '', 'test2']])

      expect(findContainerNameDecl(root).value).toBe('test test2')
    })

    it('does not assign name if the array of names is empty', async () => {
      const { root } = await run('', [])

      expect(findContainerNameDecl(root)).toBeFalsy()
    })
  })
})
