import Items from '.'

const mockCall = jest.fn(() => Promise.resolve()) as any
const mockList = jest.fn(() => Promise.resolve()) as any
const items = Items({ call: mockCall, list: mockList })

describe('Items', () => {
  beforeEach(() => {
    mockCall.mockClear()
    mockList.mockClear()
  })

  it('should expose API methods', () => {
    expect(items).toMatchSnapshot()
  })
})
