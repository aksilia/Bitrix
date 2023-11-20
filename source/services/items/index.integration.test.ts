import Bitrix from '../../bitrix'

const WEBHOOK_URL = process.env['WEBHOOK_URL']

if (!WEBHOOK_URL) {
  throw Error('Integration tests require environmental variable `WEBHOOK_URL` to be set')
}

const { items } = Bitrix(WEBHOOK_URL)

describe('Items', () => {
  describe('fields', () => {
    it('should get all fields', async () => {
      const { result } = await items.fields()
      expect(result).toMatchSnapshot()
    })
  })
})
