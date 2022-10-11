import sdk from "../../../../sdk"
import { TestConfiguration, structures, API } from "../../../../tests"
import { v4 as uuid } from "uuid"

describe("accounts", () => {
  const config = new TestConfiguration()
  const api = new API(config)

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("metadata", () => {
    describe("saveMetadata", () => {
      it("saves account metadata", async () => {
        let account = structures.accounts.account()

        const response = await api.accounts.saveMetadata(account)

        const id = sdk.accounts.formatAccountMetadataId(account.accountId)
        const metadata = await sdk.accounts.getMetadata(id)
        expect(response).toStrictEqual(metadata)
      })
    })

    describe("destroyMetadata", () => {
      it("destroys account metadata", async () => {
        const account = structures.accounts.account()
        await api.accounts.saveMetadata(account)

        await api.accounts.destroyMetadata(account.accountId)

        const deleted = await sdk.accounts.getMetadata(account.accountId)
        expect(deleted).toBe(undefined)
      })

      it("destroys account metadata that does not exist", async () => {
        const id = uuid()

        const response = await api.accounts.destroyMetadata(id)

        expect(response.status).toBe(204)
      })
    })
  })
})
