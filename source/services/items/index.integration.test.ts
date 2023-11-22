import Bitrix from '../../bitrix'

const WEBHOOK_URL = process.env['WEBHOOK_URL']

if (!WEBHOOK_URL) {
  throw Error('Integration tests require environmental variable `WEBHOOK_URL` to be set')
}

const { items } = Bitrix(WEBHOOK_URL)

describe('Items', () => {
  describe('fields', () => {
    it('should get list', async () => {
      const { result } = await items.list({entityTypeId: "167"})
      expect(result).toMatchSnapshot()
    })
  })
})
