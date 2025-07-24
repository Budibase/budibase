import { BudibaseClient } from "../index"
import { shouldNotChange, upgradeSpansCommit } from "../utils/upgradeTest"
import { ConfigType } from "@budibase/types"

describe("configs", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  shouldNotChange.each(Object.values(ConfigType))(
    "config type: %s",
    async type => {
      // recaptcha wasn't added until after commit deb3556 - therefore wasn't supported
      if (type === ConfigType.RECAPTCHA && upgradeSpansCommit("deb3556")) {
        return
      }
      const config = await client.config.get(type)
      // In commit 191bf3a we fixed a bug where the AI config type didn't
      // always set a `type` property.
      if (type === ConfigType.AI && upgradeSpansCommit("191bf3a")) {
        config.type = ConfigType.AI
      }
      return config
    }
  )
})
