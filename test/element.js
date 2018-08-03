import { Element } from '../src/index'

describe('Element', () => {
  describe('#constructor', () => {
    it('creates a instance with tag', () => {
      const elm = new Element('span')

      expect(elm.tag).toBe('span')
      expect(elm.attributes).toStrictEqual({})
    })

    it('creates a instance with tag and attributes', () => {
      const attributes = { id: 'foo', class: 'bar' }
      const elm = new Element('div', attributes)

      expect(elm.tag).toBe('div')
      expect(elm.attributes).toStrictEqual(attributes)

      expect(elm.id).toBe('foo')
      expect(elm.class).toBe('bar')
    })
  })

  it('has a compatibility with plain object', () => {
    const elm = new Element('a', { href: '#', target: '_blank' })
    const obj = { tag: 'a', href: '#', target: '_blank' }

    expect(obj).toStrictEqual({ ...elm })
  })

  it('has been frozen', () => {
    const elm = new Element('article')
    expect(Object.isFrozen(elm)).toBe(true)

    expect(() => {
      elm.tag = 'section'
    }).toThrow()

    expect(() => {
      elm.extraAttr = 'extra'
    }).toThrow()
  })
})
