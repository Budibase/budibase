import { FetchMessageObject } from "imapflow"

export const checkSender = (
  expectedSender: string | undefined,
  message: FetchMessageObject
) => {
  const normalizedExpected = expectedSender?.trim().toLowerCase()
  if (!normalizedExpected) {
    return true
  }

  const actualSender = message.envelope?.from?.[0]?.address?.toLowerCase()
  return actualSender === normalizedExpected
}
