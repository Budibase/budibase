import { configs } from "@budibase/backend-core"
import { SMTPInnerConfig } from "@budibase/types"
import { ImapFlow } from "imapflow"

export const getClient = async (config?: SMTPInnerConfig) => {
  const smtpConfig = config || (await configs.getSMTPConfig(true))
  if (!smtpConfig) throw new Error("no available SMTP config")

  const client = new ImapFlow({
    ...smtpConfig,
    // imap flow has its own pino instance enabled by default and is very very chatty!
    logger: false,
  })
  return client
}
