import { FetchMessageObject, ImapFlow } from "imapflow"

const fetchQuery = {
  uid: true,
  flags: true,
  envelope: true,
  bodyStructure: true,
  internalDate: true,
  size: true,
  source: true,
}

export const fetchMessages = async (
  client: ImapFlow,
  mailboxKey: string,
  lastSeenUid?: number
): Promise<FetchMessageObject[]> => {
  await client.connect()
  const mailbox = await client.mailboxOpen(mailboxKey)

  if (!mailbox.exists) {
    return []
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
