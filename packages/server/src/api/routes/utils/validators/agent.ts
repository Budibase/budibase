import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_NUMBER = Joi.number().optional().allow(null)
const DISCORD_INTEGRATION_SCHEMA = Joi.object({
  applicationId: OPTIONAL_STRING,
  publicKey: OPTIONAL_STRING,
  botToken: OPTIONAL_STRING,
  guildId: OPTIONAL_STRING,
  chatAppId: OPTIONAL_STRING,
  interactionsEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
})
  .optional()
  .allow(null)

const TEAMS_INTEGRATION_SCHEMA = Joi.object({
  appId: OPTIONAL_STRING,
  appPassword: OPTIONAL_STRING,
  tenantId: OPTIONAL_STRING,
  chatAppId: OPTIONAL_STRING,
  messagingEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
})
  .optional()
  .allow(null)

export function createAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      description: OPTIONAL_STRING,
      aiconfig: Joi.string().optional(),
      promptInstructions: OPTIONAL_STRING,
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
      embeddingModel: OPTIONAL_STRING,
      vectorDb: OPTIONAL_STRING,
      ragMinDistance: OPTIONAL_NUMBER.min(0).max(1),
      ragTopK: OPTIONAL_NUMBER.integer().min(1).max(10),
      discordIntegration: DISCORD_INTEGRATION_SCHEMA,
      teamsIntegration: TEAMS_INTEGRATION_SCHEMA,
    })
  )
}

export function updateAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _id: Joi.string().required(),
      _rev: Joi.string().required(),
      name: Joi.string().required(),
      description: OPTIONAL_STRING,
      aiconfig: Joi.string().optional(),
      promptInstructions: OPTIONAL_STRING,
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
      embeddingModel: OPTIONAL_STRING,
      vectorDb: OPTIONAL_STRING,
      ragMinDistance: OPTIONAL_NUMBER.min(0).max(1),
      ragTopK: OPTIONAL_NUMBER.integer().min(1).max(10),
      discordIntegration: DISCORD_INTEGRATION_SCHEMA,
      teamsIntegration: TEAMS_INTEGRATION_SCHEMA,
    }).unknown(true)
  )
}

export function syncAgentDiscordCommandsValidator() {
  return auth.joiValidator.body(
    Joi.object({
      chatAppId: OPTIONAL_STRING,
    })
      .optional()
      .allow(null)
  )
}
