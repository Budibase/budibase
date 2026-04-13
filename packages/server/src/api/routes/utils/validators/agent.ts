import { auth } from "@budibase/backend-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_NUMBER = Joi.number().optional().allow(null)
const OPTIONAL_AICONFIG = Joi.string().optional().allow("")

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
  tenantId: Joi.string().required().trim().disallow(""),
  chatAppId: OPTIONAL_STRING,
  messagingEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
})
  .optional()
  .allow(null)

const SLACK_INTEGRATION_SCHEMA = Joi.object({
  botToken: OPTIONAL_STRING,
  signingSecret: OPTIONAL_STRING,
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
      aiconfig: OPTIONAL_AICONFIG,
      promptInstructions: OPTIONAL_STRING,
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
      discordIntegration: DISCORD_INTEGRATION_SCHEMA,
      MSTeamsIntegration: TEAMS_INTEGRATION_SCHEMA,
      slackIntegration: SLACK_INTEGRATION_SCHEMA,
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
      aiconfig: OPTIONAL_AICONFIG,
      promptInstructions: OPTIONAL_STRING,
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
      discordIntegration: DISCORD_INTEGRATION_SCHEMA,
      MSTeamsIntegration: TEAMS_INTEGRATION_SCHEMA,
      slackIntegration: SLACK_INTEGRATION_SCHEMA,
    }).unknown(true)
  )
}

export function syncAgentDiscordCommandsValidator() {
  return chatAppIdBodyValidator()
}

export function provisionAgentMSTeamsChannelValidator() {
  return chatAppIdBodyValidator()
}

export function provisionAgentSlackChannelValidator() {
  return chatAppIdBodyValidator()
}

function chatAppIdBodyValidator() {
  return auth.joiValidator.body(
    Joi.object({
      chatAppId: OPTIONAL_STRING,
    })
      .optional()
      .allow(null)
  )
}

export function toggleAgentDiscordDeploymentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      enabled: Joi.boolean().required(),
    }).required()
  )
}

export function toggleAgentMSTeamsDeploymentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      enabled: Joi.boolean().required(),
    }).required()
  )
}

export function toggleAgentSlackDeploymentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      enabled: Joi.boolean().required(),
    }).required()
  )
}

export function generateAgentInstructionsValidator() {
  return auth.joiValidator.body(
    Joi.object({
      prompt: Joi.string().trim().disallow("").required(),
      agentName: OPTIONAL_STRING,
      goal: OPTIONAL_STRING,
      toolReferences: Joi.array().items(Joi.string()).optional(),
    }).required()
  )
}

export function syncAgentKnowledgeSourcesValidator() {
  return auth.joiValidator.body(
    Joi.object({
      sourceIds: Joi.array().items(Joi.string().trim().disallow("")).optional(),
    }).required()
  )
}

export function setAgentKnowledgeSourcesValidator() {
  return auth.joiValidator.body(
    Joi.object({
      sourceIds: Joi.array().items(Joi.string().trim().disallow("")).required(),
    }).required()
  )
}
