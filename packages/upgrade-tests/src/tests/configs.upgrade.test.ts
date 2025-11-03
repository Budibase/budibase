import { BudibaseClient } from "../index"
import { shouldNotChange, upgradeSpansCommit } from "../utils/upgradeTest"
import { ConfigType } from "@budibase/types"

describe("configs", () => {
  let client: BudibaseClient

  beforeAll(async () => {
    client = await BudibaseClient.authenticated()
  })

  let configTypes: ConfigType[] = Object.values(ConfigType)
  // recaptcha wasn't added until after commit 9440a20 - therefore wasn't supported
  if (upgradeSpansCommit("9440a20")) {
    configTypes = configTypes.filter(type => type !== ConfigType.RECAPTCHA)
  }

  // IMAP wasn't added until after commit 2d71d28e17be21d088e1766bb69237cb5b7093df - therefore wasn't supported
  if (upgradeSpansCommit("2d71d28e17be21d088e1766bb69237cb5b7093df")) {
    configTypes = configTypes.filter(type => type !== ConfigType.IMAP)
  }

  shouldNotChange.each(configTypes)("config type: %s", async type => {
    const config = await client.config.get(type)
    // In commit 191bf3a we fixed a bug where the AI config type didn't
    // always set a `type` property.
    if (type === ConfigType.AI && upgradeSpansCommit("191bf3a")) {
      config.type = ConfigType.AI
    }
    return config
  })
})
