import dedent from 'dedent'
import yaml from '../../../src/markdown/directives/yaml'

describe('Marpit directives YAML parser', () => {
  it("ignores directive's special char with false allowLazy option", () =>
    expect(yaml('color: #f00', false).color).toBeFalsy())

  context('with allowLazy option as true', () => {
    it("parses directive's special char as string", () =>
      expect(yaml('color: #f00', true).color).toBe('#f00'))

    it('fallbacks to regular YAML parser when passed like strict YAML', () => {
      const confirm = text =>
        expect(yaml(text, true)).toMatchObject(yaml(text, false))

      confirm('headingDivider: [3]')
      confirm('backgroundPosition: "left center"')
      confirm("backgroundSize: '100px 200px'")
      confirm(dedent`
        color: #f00
        notSupported: key
      `)
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
})
