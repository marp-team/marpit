import markdownIt from 'markdown-it'
import { Marpit } from '../src/index'
import pluginAsDefaultExport, { marpitPlugin } from '../src/plugin'

describe('Plugin interface', () => {
  it('is compatible as CommonJS module', () => {
    expect(require('../src/plugin')).toBeInstanceOf(Function)
  })

  it('is compatible as ES Modules and able to use through default export', () => {
    expect(pluginAsDefaultExport).toBeInstanceOf(Function)
  })

  it('is compatible as ES Modules and able to use through named export', () => {
    expect(marpitPlugin).toBeInstanceOf(Function)
  })

  it('generates plugin function that is able to use in Marpit instance', () => {
    const pluginFn = jest.fn((md) => md)
    const plugin = marpitPlugin(pluginFn)
    expect(plugin).toBeInstanceOf(Function)

    const marpit = new Marpit().use(plugin)
    expect(pluginFn).toHaveLastReturnedWith(marpit.markdown)
    expect(marpit.markdown.marpit).toStrictEqual(marpit)
  })

  it('throws error if a generated plugin was used in markdown-it instance', () => {
    const plugin = marpitPlugin(jest.fn())

    expect(() => new markdownIt().use(plugin)).toThrow(
      'Marpit plugin has detected incompatible markdown-it instance.',
    )
  })
})
