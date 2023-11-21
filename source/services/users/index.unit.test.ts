import Users from '.'

const mockCall = jest.fn(() => Promise.resolve()) as any
const mockList = jest.fn(() => Promise.resolve()) as any
const users = Users({ call: mockCall, list: mockList })

describe('Users', () => {
  beforeEach(() => {
    mockCall.mockClear()
    mockList.mockClear()
  })

  it('should expose API methods', () => {
    expect(users).toMatchSnapshot()
  })

  describe('`get`', () => {
    it('should invoke `call`', async () => {
      await users.get()
      expect(mockCall.mock.calls).toMatchSnapshot()
    })
  })
})
