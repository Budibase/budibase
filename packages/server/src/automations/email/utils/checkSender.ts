import { FetchMessageObject } from "imapflow"

export const checkSender = (
  expectedSender: string | undefined,
  message: FetchMessageObject
) => {
  const actualSender = message.envelope?.from?.[0]?.address?.toLowerCase()
  return expectedSender === actualSender
}
