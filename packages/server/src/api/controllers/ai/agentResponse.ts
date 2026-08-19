import type { Agent, MSTeamsAgentIntegration } from "@budibase/types"

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

const toMSTeamsIntegrationResponse = (
  integration: MSTeamsAgentIntegration
): MSTeamsAgentIntegration => {
  const { appPackageVersion: _appPackageVersion, ...response } = integration
  return maskSecretFields(response, ["appPassword"])
}

export const obfuscateAgentSecrets = (agent: Agent): Agent => ({
  ...agent,
  ...(agent.MSTeamsIntegration && {
    MSTeamsIntegration: toMSTeamsIntegrationResponse(agent.MSTeamsIntegration),
  }),
  ...(agent.slackIntegration && {
    slackIntegration: maskSecretFields(agent.slackIntegration, [
      "clientSecret",
      "botToken",
      "signingSecret",
    ]),
  }),
})

export const toAgentResponse = (agent: Agent): Agent =>
  obfuscateAgentSecrets(agent)
