import assert from 'assert'
import { Element } from '../src/index'

describe('Element', () => {
  describe('#constructor', () => {
    it('creates a instance with tag', () => {
      const elm = new Element('span')

      assert(elm.tag === 'span')
      assert.deepStrictEqual(elm.attributes, {})
    })

    it('creates a instance with tag and attributes', () => {
      const attributes = { id: 'foo', class: 'bar' }
      const elm = new Element('div', attributes)

      assert(elm.tag === 'div')
      assert.deepStrictEqual(elm.attributes, attributes)

      assert(elm.id === 'foo')
      assert(elm.class === 'bar')
    })
  })

  it('has a compatibility with plain object', () => {
    const elm = new Element('a', { href: '#', target: '_blank' })
    const obj = { tag: 'a', href: '#', target: '_blank' }

    assert.deepStrictEqual(obj, { ...elm })
  })

  it('has been frozen', () => {
    const elm = new Element('article')
    assert(Object.isFrozen(elm))

    assert.throws(() => {
      elm.tag = 'section'
    })

    assert.throws(() => {
      elm.extraAttr = 'extra'
    })
  })
})
