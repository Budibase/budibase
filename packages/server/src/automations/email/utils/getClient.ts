import { configs } from "@budibase/backend-core"
import { IMAPInnerConfig } from "@budibase/types"
import { ImapFlow } from "imapflow"

export const getClient = async (config?: IMAPInnerConfig) => {
  const imapConfig = config || (await configs.getIMAPConfig())
  if (!imapConfig) throw new Error("no available IMAP config")

  const client = new ImapFlow({
    ...imapConfig,
    // imap flow has its own pino instance enabled by default and is very very chatty!
    logger: false,
  })
  return client
}
