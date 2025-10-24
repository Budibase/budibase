import { ImapFlow } from "imapflow"

export const fetchMessage = async (client: ImapFlow, lockKey: string) => {
  await client.connect()
  const mailbox = await client.mailboxOpen(lockKey)
  const message = await client.fetchOne(mailbox.exists, {
    uid: true,
    flags: true,
    envelope: true,
    bodyStructure: true,
    internalDate: true,
    size: true,
  })
  return message
}
