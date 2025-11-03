import { FetchMessageObject, ImapFlow } from "imapflow"

const fetchQuery = {
  uid: true,
  flags: true,
  envelope: true,
  bodyStructure: true,
  internalDate: true,
  size: true,
}

export const fetchMessages = async (
  client: ImapFlow,
  lockKey: string,
  lastSeenUid?: number
): Promise<FetchMessageObject[]> => {
  await client.connect()
  const mailbox = await client.mailboxOpen(lockKey)

  if (!mailbox.exists) {
    throw new Error("Mailbox does not exist")
  }

  if (lastSeenUid == null) {
    const message = await client.fetchOne(mailbox.exists, fetchQuery)
    return message ? [message] : []
  }

  const nextUid = lastSeenUid + 1
  if (nextUid >= mailbox.uidNext) {
    return []
  }

  return client.fetchAll({ uid: `${nextUid}:*` }, fetchQuery)
}
