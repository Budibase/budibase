import { BudibaseClient } from "../index"
import { shouldNotChange } from "../utils/upgradeTest"

describe("screens", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange("IDs", async () => {
    const screens = await client.screen.fetch()
    return screens.map(screen => screen._id!).sort()
  })
})
