exports.definition = {
  name: "Cron Trigger",
  event: "cron:trigger",
  icon: "ri-timer-line",
  tagline: "Cron Trigger (<b>{{inputs.cron}}</b>)",
  description: "Triggers automation on a cron schedule.",
  stepId: "CRON",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        cron: {
          type: "string",
          customType: "cron",
          title: "Expression",
        },
      },
      required: ["cron"],
    },
    outputs: {
      properties: {
        timestamp: {
          type: "number",
          description: "Timestamp the cron was executed",
        },
      },
      required: ["timestamp"],
    },
  },
  type: "TRIGGER",
}
