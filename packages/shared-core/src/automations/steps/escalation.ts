import {
  AutomationActionStepId,
  AutomationCustomIOType,
  AutomationIOType,
  AutomationStepDefinition,
  AutomationStepType,
} from "@budibase/types"

// NOTE: User context at escalation time depends on the trigger type - row/app/action triggers
// carry the authenticated user in ctx.trigger.user, but cron/webhook/email triggers have no user.
// Notification target should be explicitly configured as a step input rather than inferred from
// the triggering user, to ensure escalations work correctly regardless of trigger type.
export const definition: AutomationStepDefinition = {
  name: "Escalation",
  icon: "Alert",
  tagline: "Pause and wait for human approval",
  description:
    "Suspend the automation and wait for a human to review and resolve before continuing",
  stepId: AutomationActionStepId.ESCALATION,
  internal: true,
  features: {},
  inputs: {
    message: "test",
    delay: "10",
  },
  schema: {
    inputs: {
      properties: {
        operationId: {
          type: AutomationIOType.STRING,
          title: "OperationId",
          description: "The Id of running operation",
        },
        agentId: {
          type: AutomationIOType.STRING,
          title: "Agent",
          description:
            "The agent whose Slack integration is used for notifications",
        },
        message: {
          type: AutomationIOType.STRING,
          title: "Escalation message",
          description: "Context shown to the reviewer",
        },
        delay: {
          type: AutomationIOType.NUMBER,
          title: "Expiry (seconds)",
          description:
            "How long to wait before automatically resolving if not manually actioned",
        },
        notifications: {
          type: AutomationIOType.JSON,
          title: "Notifications",
          description: 'Notification configuration e.g. { "recipients": [] }',
        },
        resolutionStrategy: {
          type: AutomationIOType.STRING,
          customType: AutomationCustomIOType.CODE,
          title: "Resolution strategy",
          description:
            "JavaScript that receives responses[] (all notification responses so far) and returns a value. A truthy result resolves the escalation.",
        },
      },
      required: ["message", "delay"],
    },
    outputs: {
      properties: {
        success: {
          type: AutomationIOType.BOOLEAN,
          description: "Whether the escalation was created successfully",
        },
        escalationId: {
          type: AutomationIOType.STRING,
          description: "The unique ID of the escalation",
        },
        resolution: {
          type: AutomationIOType.STRING,
          description:
            "How the escalation was resolved: resolved, expired, or cancelled",
        },
        resolvedAt: {
          type: AutomationIOType.STRING,
          description: "ISO timestamp when the escalation was resolved",
        },
        response: {
          type: AutomationIOType.JSON,
          description:
            "The strategy result: { resolved: boolean, data?: Record<string, any> }",
        },
      },
      required: ["success"],
    },
  },
  type: AutomationStepType.LOGIC,
}
