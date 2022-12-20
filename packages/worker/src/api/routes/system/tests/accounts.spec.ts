import sdk from "../../../../sdk"
import { TestConfiguration, structures } from "../../../../tests"
import { v4 as uuid } from "uuid"

describe("accounts", () => {
  const config = new TestConfiguration()

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

        const response = await config.api.accounts.saveMetadata(account)

        const id = sdk.accounts.formatAccountMetadataId(account.accountId)
        const metadata = await sdk.accounts.getMetadata(id)
        expect(response).toStrictEqual(metadata)
      })
    })

    describe("destroyMetadata", () => {
      it("destroys account metadata", async () => {
        const account = structures.accounts.account()
        await config.api.accounts.saveMetadata(account)

        await config.api.accounts.destroyMetadata(account.accountId)

        const deleted = await sdk.accounts.getMetadata(account.accountId)
        expect(deleted).toBe(undefined)
      })

      it("destroys account metadata that does not exist", async () => {
        const id = uuid()

        const response = await config.api.accounts.destroyMetadata(id)

        expect(response.status).toBe(204)
      })
    })
  })
})
