import { sendSmtpEmail } from "../../utilities/workerRequests"
import * as automationUtils from "../automationUtils"
import {
  AutomationActionStepId,
  AutomationStepSchema,
  AutomationStepInput,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
} from "@budibase/types"

export const definition: AutomationStepSchema = {
  description: "Send an email using SMTP",
  tagline: "Send SMTP email to {{inputs.to}}",
  icon: "Email",
  name: "Send Email (SMTP)",
  type: AutomationStepType.ACTION,
  internal: true,
  features: {
    [AutomationFeature.LOOPING]: true,
  },
  stepId: AutomationActionStepId.SEND_EMAIL_SMTP,
  inputs: {},
  schema: {
    inputs: {
      properties: {
        to: {
          type: AutomationIOType.STRING,
          title: "Send To",
        },
        from: {
          type: AutomationIOType.STRING,
          title: "Send From",
        },
        cc: {
          type: AutomationIOType.STRING,
          title: "CC",
        },
        bcc: {
          type: AutomationIOType.STRING,
          title: "BCC",
        },
        subject: {
          type: AutomationIOType.STRING,
          title: "Email Subject",
        },
        contents: {
          type: AutomationIOType.STRING,
          title: "HTML Contents",
        },
        addInvite: {
          type: AutomationIOType.BOOLEAN,
          title: "Add calendar invite",
        },
        startTime: {
          type: AutomationIOType.DATE,
          title: "Start Time",
          dependsOn: "addInvite",
        },
        endTime: {
          type: AutomationIOType.DATE,
          title: "End Time",
          dependsOn: "addInvite",
        },
        summary: {
          type: AutomationIOType.STRING,
          title: "Meeting Summary",
          dependsOn: "addInvite",
        },
        location: {
          type: AutomationIOType.STRING,
          title: "Location",
          dependsOn: "addInvite",
        },
        url: {
          type: AutomationIOType.STRING,
          title: "URL",
          dependsOn: "addInvite",
        },
      },
      required: ["to", "from", "subject", "contents"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the email was sent",
        },
        response: {
          type: AutomationIOType.OBJECT,
          description: "A response from the email client, this may be an error",
        },
      },
      required: ["success"],
    },
  },
}

export async function run({ inputs }: AutomationStepInput) {
  let {
    to,
    from,
    subject,
    contents,
    cc,
    bcc,
    addInvite,
    startTime,
    endTime,
    summary,
    location,
    url,
  } = inputs
  if (!contents) {
    contents = "<h1>No content</h1>"
  }
  to = to || undefined
  try {
    let response = await sendSmtpEmail({
      to,
      from,
      subject,
      contents,
      cc,
      bcc,
      automation: true,
      invite: addInvite
        ? {
            startTime,
            endTime,
            summary,
            location,
            url,
          }
        : undefined,
    })
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
