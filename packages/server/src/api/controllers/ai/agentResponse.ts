import { Agent } from "@budibase/types"

const SECRET_MASK = "********"

const maskSecretFields = <T extends object>(obj: T, fields: (keyof T)[]): T => {
  const result = { ...obj }
  for (const field of fields) {
    if (result[field]) {
      result[field] = SECRET_MASK as T[typeof field]
    }
  }
  return result
}

export const obfuscateAgentSecrets = (agent: Agent): Agent => ({
  ...agent,
  ...(agent.discordIntegration && {
    discordIntegration: maskSecretFields(agent.discordIntegration, [
      "publicKey",
      "botToken",
    ]),
  }),
  ...(agent.MSTeamsIntegration && {
    MSTeamsIntegration: maskSecretFields(agent.MSTeamsIntegration, [
      "appPassword",
    ]),
  }),
  ...(agent.slackIntegration && {
    slackIntegration: maskSecretFields(agent.slackIntegration, [
      "botToken",
      "signingSecret",
    ]),
  }),
  ...(agent.telegramIntegration && {
    telegramIntegration: maskSecretFields(agent.telegramIntegration, [
      "botToken",
      "webhookSecretToken",
    ]),
  }),
})

export const toAgentResponse = (agent: Agent): Agent =>
  obfuscateAgentSecrets(agent)
