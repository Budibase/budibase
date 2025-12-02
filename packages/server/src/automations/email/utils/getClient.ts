import { EmailTriggerInputs } from "@budibase/types"
import { ImapFlow } from "imapflow"

export const getClient = async (inputs: EmailTriggerInputs) => {
  if (!inputs) {
    throw new Error("Email trigger inputs are required")
  }

  const client = new ImapFlow({
    host: inputs.host,
    port: inputs.port,
    secure: inputs.secure,
    auth: {
      user: inputs.username,
      pass: inputs.password,
    },
    // imap flow has its own pino instance enabled by default and is very very chatty!
    logger: false,
  })

  return client
}
