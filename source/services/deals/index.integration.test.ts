import Bitrix from './../../bitrix'

const WEBHOOK_URL = process.env['WEBHOOK_URL']

if (!WEBHOOK_URL) {
  throw Error('Integration tests require environmental variable `WEBHOOK_URL` to be set')
}

const { deals } = Bitrix(WEBHOOK_URL)

describe('Deals', () => {
  describe('fields', () => {
    it('should get all fields', async () => {
      const { result } = await deals.list({ select: ["*"], filter: {">OPPORTUNITY":10000, "<BEGINDATE":"2023-11-29T23:00:00.000Z"} })
      expect(result).toMatchSnapshot()
    })
  })
})
