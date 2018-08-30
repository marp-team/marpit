import cheerio from 'cheerio'
import MarkdownIt from 'markdown-it'
import parseImage from '../../src/markdown/parse_image'

describe('Marpit parse image plugin', () => {
  const md = (opts = {}) => new MarkdownIt('commonmark').use(parseImage, opts)

  const style = opts => {
    const $ = cheerio.load(
      md().render(`![${opts}](https://example.com/example.jpg)`)
    )
    return $('img').attr('style')
  }

  context('with width option', () => {
    it('renders image width style', () => {
      // Number & floats
      expect(style('w:100')).toBe('width:100px;')
      expect(style('width:23.4')).toBe('width:23.4px;')
      expect(style('w:.5')).toBe('width:.5px;')

      // CSS units
      expect(style('w:1ch')).toBe('width:1ch;')
      expect(style('w:2cm')).toBe('width:2cm;')
      expect(style('w:3em')).toBe('width:3em;')
      expect(style('w:4ex')).toBe('width:4ex;')
      expect(style('w:5in')).toBe('width:5in;')
      expect(style('w:6mm')).toBe('width:6mm;')
      expect(style('w:7pc')).toBe('width:7pc;')
      expect(style('w:8pt')).toBe('width:8pt;')
      expect(style('w:9px')).toBe('width:9px;')
      expect(style('w:10rem')).toBe('width:10rem;')
      expect(style('w:11vh')).toBe('width:11vh;')
      expect(style('w:12vmax')).toBe('width:12vmax;')
      expect(style('w:13vmin')).toBe('width:13vmin;')
      expect(style('w:14vw')).toBe('width:14vw;')

      // Percentage and not supported keyword in inline image will ignore
      expect(style('w:100%')).not.toBe('width:100%;')
      expect(style('w:12.345%')).not.toBe('width:12.345%;')
      expect(style('w:.678%')).not.toBe('width:.678%;')
      expect(style('w:unexpected')).not.toBe('width:unexpected;')
    })

    it('renders image height style', () => {
      expect(style('h:100')).toBe('height:100px;')
      expect(style('height:23.4')).toBe('height:23.4px;')
      expect(style('h:.5')).toBe('height:.5px;')

      expect(style('h:1ch')).toBe('height:1ch;')
      expect(style('h:2cm')).toBe('height:2cm;')
      expect(style('h:3em')).toBe('height:3em;')
      expect(style('h:4ex')).toBe('height:4ex;')
      expect(style('h:5in')).toBe('height:5in;')
      expect(style('h:6mm')).toBe('height:6mm;')
      expect(style('h:7pc')).toBe('height:7pc;')
      expect(style('h:8pt')).toBe('height:8pt;')
      expect(style('h:9px')).toBe('height:9px;')
      expect(style('h:10rem')).toBe('height:10rem;')
      expect(style('h:11vh')).toBe('height:11vh;')
      expect(style('h:12vmax')).toBe('height:12vmax;')
      expect(style('h:13vmin')).toBe('height:13vmin;')
      expect(style('h:14vw')).toBe('height:14vw;')

      expect(style('h:100%')).not.toBe('height:100%;')
      expect(style('h:12.345%')).not.toBe('height:12.345%;')
      expect(style('h:.678%')).not.toBe('height:.678%;')
      expect(style('w:unexpected')).not.toBe('width:unexpected;')
    })
  })
})
