import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("roles", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const roles = await client.role.fetch()
    return roles.map(role => role._id!).sort()
  })

  shouldNotChange("names", async () => {
    const roles = await client.role.fetch()
    return roles.map(role => role.name).sort()
  })
})
