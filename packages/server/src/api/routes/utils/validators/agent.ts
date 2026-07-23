import { auth } from "@budibase/backend-core"
import { REVIEWER_TYPES } from "@budibase/shared-core"
import Joi from "joi"

const OPTIONAL_STRING = Joi.string().optional().allow(null).allow("")
const OPTIONAL_NUMBER = Joi.number().optional().allow(null)
const OPTIONAL_AICONFIG = Joi.string().optional().allow("")
const NON_EMPTY_STRING = Joi.string().trim().min(1)

const DISCORD_INTEGRATION_SCHEMA = Joi.object({
  applicationId: OPTIONAL_STRING,
  publicKey: OPTIONAL_STRING,
  botToken: OPTIONAL_STRING,
  guildId: OPTIONAL_STRING,
  chatAppId: OPTIONAL_STRING,
  interactionsEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
  requireUserLink: Joi.boolean().optional(),
})
  .optional()
  .allow(null)

const TEAMS_INTEGRATION_SCHEMA = Joi.object({
  appId: OPTIONAL_STRING,
  appPassword: OPTIONAL_STRING,
  tenantId: NON_EMPTY_STRING.required(),
  chatAppId: OPTIONAL_STRING,
  messagingEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
  requireUserLink: Joi.boolean().optional(),
})
  .optional()
  .allow(null)

const SLACK_INTEGRATION_SCHEMA = Joi.object({
  appId: OPTIONAL_STRING,
  clientId: OPTIONAL_STRING,
  clientSecret: OPTIONAL_STRING,
  botToken: OPTIONAL_STRING,
  botUserId: OPTIONAL_STRING,
  signingSecret: OPTIONAL_STRING,
  teamId: OPTIONAL_STRING,
  teamName: OPTIONAL_STRING,
  chatAppId: OPTIONAL_STRING,
  messagingEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
  requireUserLink: Joi.boolean().optional(),
})
  .optional()
  .allow(null)

const TELEGRAM_INTEGRATION_SCHEMA = Joi.object({
  botToken: OPTIONAL_STRING,
  webhookSecretToken: OPTIONAL_STRING,
  botUserName: OPTIONAL_STRING,
  chatAppId: OPTIONAL_STRING,
  messagingEndpointUrl: OPTIONAL_STRING,
  idleTimeoutMinutes: OPTIONAL_NUMBER.integer().min(1).max(1440),
})
  .optional()
  .allow(null)

const ESCALATION_RECIPIENT_SCHEMA = Joi.object({
  type: Joi.string().required(),
  config: Joi.object().optional(),
})

const AGENT_OPERATION_CONFIG_SCHEMA = Joi.object({
  name: OPTIONAL_STRING,
  live: Joi.boolean().optional(),
  promptInstructions: OPTIONAL_STRING,
  enabledTools: Joi.array().items(Joi.string()).optional(),
  allowKnowledgeSourceDownload: Joi.boolean().optional(),
  escalation: Joi.object({
    recipients: Joi.array().items(ESCALATION_RECIPIENT_SCHEMA).optional(),
    delay: Joi.number().optional(),
  }).optional(),
})

export function createAgentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      name: Joi.string().required(),
      description: OPTIONAL_STRING,
      aiconfig: OPTIONAL_AICONFIG,
      projectIds: Joi.array().items(Joi.string()).optional(),
      promptInstructions: OPTIONAL_STRING,
      operationName: OPTIONAL_STRING,
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
      discordIntegration: DISCORD_INTEGRATION_SCHEMA,
      MSTeamsIntegration: TEAMS_INTEGRATION_SCHEMA,
      slackIntegration: SLACK_INTEGRATION_SCHEMA,
      telegramIntegration: TELEGRAM_INTEGRATION_SCHEMA,
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
      projectIds: Joi.array().items(Joi.string()).optional(),
      promptInstructions: OPTIONAL_STRING,
      operationName: OPTIONAL_STRING,
      live: Joi.boolean().optional(),
      goal: OPTIONAL_STRING,
      icon: OPTIONAL_STRING,
      iconColor: OPTIONAL_STRING,
      createdAt: OPTIONAL_STRING,
      updatedAt: OPTIONAL_STRING,
      publishedAt: OPTIONAL_STRING,
      createdBy: OPTIONAL_STRING,
      discordIntegration: DISCORD_INTEGRATION_SCHEMA,
      MSTeamsIntegration: TEAMS_INTEGRATION_SCHEMA,
      slackIntegration: SLACK_INTEGRATION_SCHEMA,
      telegramIntegration: TELEGRAM_INTEGRATION_SCHEMA,
    }).unknown(true)
  )
}

export function createAgentOperationValidator() {
  return auth.joiValidator.body(
    AGENT_OPERATION_CONFIG_SCHEMA.keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      allowKnowledgeSourceDownload: Joi.boolean().required(),
    }).required()
  )
}

export function updateAgentOperationValidator() {
  return auth.joiValidator.body(AGENT_OPERATION_CONFIG_SCHEMA.min(1).required())
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

export function createAgentSlackAppValidator() {
  return auth.joiValidator.body(Joi.object().optional().allow(null))
}

export function provisionAgentTelegramChannelValidator() {
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

export function toggleAgentTelegramDeploymentValidator() {
  return auth.joiValidator.body(
    Joi.object({
      enabled: Joi.boolean().required(),
    }).required()
  )
}

export function generateAgentInstructionsValidator() {
  return auth.joiValidator.body(
    Joi.object({
      prompt: NON_EMPTY_STRING.required(),
      agentName: OPTIONAL_STRING,
      goal: OPTIONAL_STRING,
      toolReferences: Joi.array().items(Joi.string()).optional(),
    }).required()
  )
}

const AGENT_TEST_REVIEWER_SCHEMA = Joi.alternatives().try(
  ...REVIEWER_TYPES.map(type =>
    Joi.object({
      id: Joi.string().required(),
      type: Joi.string().valid(type).required(),
      value: Joi.string().trim().min(1).required(),
    })
  )
)

const AGENT_TEST_CASE_SCHEMA = Joi.object({
  id: Joi.string().required(),
  groupId: Joi.string().required(),
  name: Joi.string().required(),
  input: Joi.string().required(),
  context: Joi.string().allow("").optional(),
  aiConfigIds: Joi.array().items(Joi.string().trim().disallow("")).max(3),
  reviewers: Joi.array().items(AGENT_TEST_REVIEWER_SCHEMA).required(),
  lastResults: Joi.any().optional().strip(),
})

const AGENT_TEST_GROUP_SCHEMA = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().trim().required(),
})

export function updateAgentTestSuiteValidator() {
  return auth.joiValidator.body(
    Joi.object({
      _rev: OPTIONAL_STRING,
      groups: Joi.array().items(AGENT_TEST_GROUP_SCHEMA).required(),
      cases: Joi.array().items(AGENT_TEST_CASE_SCHEMA).required(),
    }).required()
  )
}

export function runAgentTestSuiteValidator() {
  return auth.joiValidator.body(
    Joi.object({
      caseId: OPTIONAL_STRING,
      groupId: OPTIONAL_STRING,
      aiConfigIds: Joi.array().items(Joi.string().trim().disallow("")).max(3),
    }).required()
  )
}

export function syncAgentKnowledgeSourcesValidator() {
  return auth.joiValidator.body(Joi.object({}).optional())
}

export function connectAgentSharePointSiteValidator() {
  return auth.joiValidator.body(
    Joi.object({
      site: Joi.object({
        id: NON_EMPTY_STRING.required(),
        name: OPTIONAL_STRING,
        webUrl: OPTIONAL_STRING,
      }).required(),
      datasourceId: NON_EMPTY_STRING.required(),
      authConfigId: NON_EMPTY_STRING.required(),
      filters: Joi.array().items(NON_EMPTY_STRING).optional(),
    }).required()
  )
}

export function updateAgentSharePointSiteValidator() {
  return auth.joiValidator.body(
    Joi.object({
      filters: Joi.array().items(NON_EMPTY_STRING).optional(),
    }).required()
  )
}
