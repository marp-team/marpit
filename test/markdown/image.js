import { load } from 'cheerio'
import MarkdownIt from 'markdown-it'
import backgroundImage from '../../src/markdown/background_image'
import comment from '../../src/markdown/comment'
import applyDirectives from '../../src/markdown/directives/apply'
import parseDirectives from '../../src/markdown/directives/parse'
import headerAndFooter from '../../src/markdown/header_and_footer'
import image from '../../src/markdown/image'
import inlineSVG from '../../src/markdown/inline_svg'
import slide from '../../src/markdown/slide'

describe('Marpit image plugin', () => {
  const md = (svg = false) =>
    new MarkdownIt('commonmark')
      .use((instance) => {
        instance.marpit = {
          customDirectives: { global: {}, local: {} },
          options: { inlineSVG: svg },
        }
      })
      .use(comment)
      .use(slide)
      .use(parseDirectives)
      .use(applyDirectives)
      .use(inlineSVG)
      .use(image)
      .use(backgroundImage)
      .use(headerAndFooter)

  describe('Regular image', () => {
    const [token] = md().parseInline('![](https://example.com/image.jpg)')
    const [imageToken] = token.children

    it('uses primitive string as src attribute', () =>
      expect(typeof imageToken.attrGet('src')).toBe('string'))

    context('with header image via directive', () => {
      const tokens = md().parse(
        '<!-- header: "![](header.png)" -->\n\n![](content.png)'
      )

      it('uses primitive string as src attribute for all images', () => {
        for (const { children } of tokens.filter((t) => t.type === 'inline')) {
          const [t] = children
          expect(typeof t.attrGet('src')).toBe('string')
        }
      })
    })
  })

  describe('Style for inline image', () => {
    const style = (opts) => {
      const $ = load(md().render(`![${opts}](https://example.com/example.jpg)`))
      return $('img').attr('style')
    }

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

      expect(style('h:100%')).not.toBe('height:100%;')
      expect(style('h:12.345%')).not.toBe('height:12.345%;')
      expect(style('h:.678%')).not.toBe('height:.678%;')
      expect(style('h:unexpected')).not.toBe('height:unexpected;')
    })

    it('removes recognized Marpit keywords from alt attribute of the output image', () => {
      const output = md().render(
        `![w:100px \t This is  example\timage \t h:200px](https://example.com/test.jpg)`
      )
      const $ = load(output)

      expect($('img').attr('alt')).toBe('This is  example\timage')
    })
  })

  describe('Shorthand for text color', () => {
    const colorMd = (src, opts = '') => `![${opts}](${src})`
    const colorDirective = (markdown) => {
      const [firstSlide] = md().parse(markdown)
      return firstSlide.meta.marpitDirectives.color
    }

    it('assigns color directive', () => {
      expect(colorDirective(colorMd('#123abc'))).toBe('#123abc')
      expect(colorDirective(colorMd('#def'))).toBe('#def')
      expect(colorDirective(colorMd('transparent'))).toBe('transparent')
      expect(colorDirective(colorMd('currentColor'))).toBe('currentColor')
      expect(colorDirective(colorMd('rgb(255,128,0)'))).toBe('rgb(255,128,0)')
      expect(colorDirective(colorMd('rgba(16,32,64,0.5)'))).toBe(
        'rgba(16,32,64,0.5)'
      )
    })

    it('does not assign color directive when options have bg keyword', () => {
      expect(colorDirective(colorMd('#123abc', 'bg'))).toBeUndefined()
      expect(colorDirective('![bg](red) ![](blue)')).toBe('blue')
    })
  })
})
