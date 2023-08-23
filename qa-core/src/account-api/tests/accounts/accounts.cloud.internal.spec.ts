import TestConfiguration from "../../config/TestConfiguration"
import * as fixtures from "../../fixtures"
import { generator } from "../../../shared"

describe("Account Internal Operations", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.beforeAll()
  })

  afterAll(async () => {
    await config.afterAll()
  })

  it("performs account deletion by ID", async () => {
    // Deleting by unknown id doesn't work
    const accountId = generator.guid()
    await config.api.accounts.delete(accountId, { status: 404 })

    // Create new account
    const [_, account] = await config.api.accounts.create({
      ...fixtures.accounts.generateAccount(),
    })

    // New account can be deleted
    await config.api.accounts.delete(account.accountId)
  })
})
