import Bitrix from './../../bitrix'

const WEBHOOK_URL = process.env['WEBHOOK_URL']

if (!WEBHOOK_URL) {
  throw Error('Integration tests require environmental variable `WEBHOOK_URL` to be set')
}

const { users } = Bitrix(WEBHOOK_URL)

describe('Users', () => {
  
  describe('get', () => {
    it('should get all users', async () => {
      const { result } = await users.get()
      expect(result).toMatchSnapshot()
    })

  })
})
