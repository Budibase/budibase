import { EmailTriggerOutputs } from "@budibase/types"

// we need the nullable / undefined messages to make the descriminated union work
export type CheckMailOutput =
  | {
      proceed: false
      reason: string
      messages?: undefined
    }
  | {
      proceed: true
      messages: EmailTriggerOutputs[]
      reason?: undefined
    }
