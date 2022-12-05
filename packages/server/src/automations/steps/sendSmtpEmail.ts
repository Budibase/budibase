import { sendSmtpEmail } from "../../utilities/workerRequests"
import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  description: "Send an email using SMTP",
  tagline: "Send SMTP email to {{inputs.to}}",
  icon: "Email",
  name: "Send Email (SMTP)",
  type: "ACTION",
  internal: true,
  stepId: AutomationActionStepId.SEND_EMAIL_SMTP,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        to: {
          type: "string",
          title: "Send To",
        },
        from: {
          type: "string",
          title: "Send From",
        },
        cc: {
          type: "string",
          title: "CC",
        },
        bcc: {
          type: "string",
          title: "BCC",
        },
        subject: {
          type: "string",
          title: "Email Subject",
        },
        contents: {
          type: "string",
          title: "HTML Contents",
        },
      },
      required: ["to", "from", "subject", "contents"],
    },
    outputs: {
      properties: {
        success: {
          type: "boolean",
          description: "Whether the email was sent",
        },
        response: {
          type: "object",
          description: "A response from the email client, this may be an error",
        },
      },
      required: ["success"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  let { to, from, subject, contents, cc, bcc } = inputs
  if (!contents) {
    contents = "<h1>No content</h1>"
  }
  to = to || undefined
  try {
    let response = await sendSmtpEmail(
      to,
      from,
      subject,
      contents,
      cc,
      bcc,
      true
    )
    return {
      success: true,
      response,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
