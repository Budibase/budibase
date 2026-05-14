import { EmailTriggerAuthType, EmailTriggerInputs } from "@budibase/types"
import { ImapFlow } from "imapflow"
import { getAccessToken } from "../../../sdk/workspace/oauth2"

const getAuthConfig = async (inputs: EmailTriggerInputs) => {
  const authType = inputs.authType || EmailTriggerAuthType.PASSWORD

  if (authType === EmailTriggerAuthType.OAUTH2) {
    if (!inputs.oauth2ConfigId) {
      throw new Error("OAuth2 connection is required")
    }
    const accessToken = await getAccessToken(inputs.oauth2ConfigId)
    return {
      user: inputs.username,
      accessToken,
    }
  }

  if (!inputs.password) {
    throw new Error("IMAP password is required")
  }

  return {
    user: inputs.username,
    pass: inputs.password,
  }
}

export const getClient = async (inputs: EmailTriggerInputs) => {
  if (!inputs) {
    throw new Error("Email trigger inputs are required")
  }

  const client = new ImapFlow({
    host: inputs.host,
    port: inputs.port,
    secure: inputs.secure,
    auth: await getAuthConfig(inputs),
    // imap flow has its own pino instance enabled by default and is very very chatty!
    logger: false,
  })

  return client
}
