import { FetchMessageObject } from "imapflow"

export const toOutputFields = (message: FetchMessageObject) => {
  return {
    from: message.envelope?.from?.map(f => f.address).join(", ") || "unknown",
    to: message.envelope?.to?.map(f => f.address).join(", ") || "unknown",
    subject: message.envelope?.subject,
    sentAt: message.envelope?.date,
  }
}
