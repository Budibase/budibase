import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("webhooks", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const webhooks = await client.webhook.fetch()
    return webhooks.map(webhook => webhook._id!).sort()
  })

  shouldNotChange("names", async () => {
    const webhooks = await client.webhook.fetch()
    return webhooks
      .map(webhook => webhook.name || "")
      .filter(name => name)
      .sort()
  })
})
