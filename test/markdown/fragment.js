import MarkdownIt from 'markdown-it'
import fragment from '../../src/markdown/fragment'

describe('Marpit fragment plugin', () => {
  const md = () => {
    const instance = new MarkdownIt('commonmark')
    instance.marpit = {}

    return instance
      .use(pluginMd => pluginMd.core.ruler.push('marpit_slide', () => {}))
      .use(fragment)
  }

  it.todo('Test Marpit fragment plugin')
})
