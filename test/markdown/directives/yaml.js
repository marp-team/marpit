import dedent from 'dedent'
import yaml from '../../../src/markdown/directives/yaml'

describe('Marpit directives YAML parser', () => {
  it("ignores directive's special char with false looseDirectives option", () =>
    expect(yaml('color: #f00', false).color).toBeNull())

  context('with looseDirectives option as true', () => {
    it("parses directive's special char as string", () =>
      expect(yaml('color: #f00', true).color).toBe('#f00'))

    it('disallows loose parsing in not built-in directives', () => {
      const body = dedent`
        backgroundColor: #f00
        header: _"HELLO!"_
        notDefinedDirective: # THIS IS A COMMENT
      `
      const parsed = yaml(body, true)

      expect(parsed.backgroundColor).toBe('#f00')
      expect(parsed.header).toBe('_"HELLO!"_')
      expect(parsed.notDefinedDirective).toBeNull()
    })

    it('returns result as same as regular YAML when passed like strict YAML', () => {
      const confirm = (text) =>
        expect(yaml(text, true)).toMatchObject(yaml(text, false))

      confirm('headingDivider: [3]')
      confirm('backgroundPosition: "left center"')
      confirm("backgroundSize: '100px 200px'")
      confirm(dedent`
        class:
          - first
          - second
      `)
      confirm(dedent`
        header: >
          Hello,
          world!
      `)
      confirm(dedent`
        footer: |
          Multiline
          footer
      `)
      confirm(dedent`
        class: &anchored klass
        _class: *anchored
      `)
    })
  })

  context('with looseDirectives option as extra keys', () => {
    it('allows loose parsing in not built-in directives', () => {
      const body = dedent`
        notDefinedDirective: # THIS IS NOT A COMMENT
        a.c: #def
        abc: # THIS IS A COMMENT
      `
      const parsed = yaml(body, ['notDefinedDirective', 'a.c'])

      expect(parsed.notDefinedDirective).toBe('# THIS IS NOT A COMMENT')
      expect(parsed['a.c']).toBe('#def')

      // It would fail if you forget escape special characters for RegEx
      expect(parsed.abc).toBeNull()
    })
  })
})
