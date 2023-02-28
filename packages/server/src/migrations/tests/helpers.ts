// Mimic configs test configuration from worker, creation configs directly in database

import * as structures from "./structures"
import { configs } from "@budibase/backend-core"
import { Config } from "@budibase/types"

export const saveSettingsConfig = async (globalDb: any) => {
  const config = structures.settings()
  await saveConfig(config, globalDb)
}

export const saveGoogleConfig = async (globalDb: any) => {
  const config = structures.google()
  await saveConfig(config, globalDb)
}

export const saveOIDCConfig = async (globalDb: any) => {
  const config = structures.oidc()
  await saveConfig(config, globalDb)
}

export const saveSmtpConfig = async (globalDb: any) => {
  const config = structures.smtp()
  await saveConfig(config, globalDb)
}

const saveConfig = async (config: Config, globalDb: any) => {
  config._id = configs.generateConfigID(config.type)

  let response
  try {
    response = await globalDb.get(config._id)
    config._rev = response._rev
    await globalDb.put(config)
  } catch (e: any) {
    if (e.status === 404) {
      await globalDb.put(config)
    }
  }
}
