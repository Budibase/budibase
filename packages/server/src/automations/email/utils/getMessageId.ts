import { FetchMessageObject } from "imapflow"

// we need this because the id is a BigInt
export const getMessageId = (message: FetchMessageObject) => {
  const messageUidRaw = message.uid
  const messageUid =
    typeof messageUidRaw === "bigint"
      ? Number(messageUidRaw)
      : Number(messageUidRaw || 0)

  return messageUid
}
