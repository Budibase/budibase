import {
  AutomationActionStepId,
  AutomationStepDefinition,
  AutomationStepType,
  AutomationIOType,
  AutomationFeature,
  AutomationCustomIOType,
} from "@budibase/types"

export const definition: AutomationStepDefinition = {
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
        attachments: {
          type: AutomationIOType.ATTACHMENT,
          customType: AutomationCustomIOType.MULTI_ATTACHMENTS,
          title: "Attachments",
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
