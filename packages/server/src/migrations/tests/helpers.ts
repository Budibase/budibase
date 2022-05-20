// Mimic configs test configuration from worker, creation configs directly in database

import * as structures from "./structures"
import { db } from "@budibase/backend-core"
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
  config._id = db.generateConfigID({ type: config.type })
  await globalDb.put(config)
}
