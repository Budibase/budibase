exports.definition = {
  name: "App Action",
  event: "app:trigger",
  icon: "Apps",
  tagline: "Automation fired from the frontend",
  description: "Trigger an automation from an action inside your app",
  stepId: "APP",
  inputs: {},
  schema: {
    inputs: {
      properties: {
        fields: {
          type: "object",
          customType: "triggerSchema",
          title: "Fields",
        },
      },
      required: [],
    },
    outputs: {
      properties: {
        fields: {
          type: "object",
          description: "Fields submitted from the app frontend",
          customType: "triggerSchema",
        },
      },
      required: ["fields"],
    },
  },
  type: "TRIGGER",
}
