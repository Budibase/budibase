import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("plugins", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const plugins = await client.plugin.fetch()
    return plugins.map(plugin => plugin._id!).sort()
  })

  shouldNotChange("names", async () => {
    const plugins = await client.plugin.fetch()
    return plugins
      .map(plugin => plugin.name || "")
      .filter(name => name)
      .sort()
  })
})
