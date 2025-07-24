import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("users", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const users = await client.user.fetch()
    return users.map(user => user._id!).sort()
  })

  shouldNotChange("emails", async () => {
    const users = await client.user.fetch()
    return users.map(user => user.email).sort()
  })
})
