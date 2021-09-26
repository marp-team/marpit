import { hello } from 'src/index'

describe('hello', () => {
  it('outputs message', () => {
    expect(hello()).toBe('Hello, world!')
  })
})
