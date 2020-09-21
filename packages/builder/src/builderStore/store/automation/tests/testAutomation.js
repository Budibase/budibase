export default {
  name: "Test automation",
  definition: {
    steps: [
      {
        id: "ANBDINAPS",
        description: "Send an email.",
        tagline: "Send email to <b>{{to}}</b>",
        icon: "ri-mail-open-fill",
        name: "Send Email",
        params: {
          to: "string",
          from: "string",
          subject: "longText",
          text: "longText",
        },
        type: "ACTION",
        args: {
          text: "A user was created!",
          subject: "New Budibase User",
          from: "budimaster@budibase.com",
          to: "test@test.com",
        },
        stepId: "SEND_EMAIL",
      },
    ],
    trigger: {
      id: "iRzYMOqND",
      name: "Record Saved",
      event: "record:save",
      icon: "ri-save-line",
      tagline: "Record is added to <b>{{model.name}}</b>",
      description: "Fired when a record is saved to your database.",
      params: { model: "model" },
      type: "TRIGGER",
      args: {
        model: {
          type: "model",
          views: {},
          name: "users",
          schema: {
            name: {
              type: "string",
              constraints: {
                type: "string",
                length: { maximum: 123 },
                presence: { allowEmpty: false },
              },
              name: "name",
            },
            age: {
              type: "number",
              constraints: {
                type: "number",
                presence: { allowEmpty: false },
                numericality: {
                  greaterThanOrEqualTo: "",
                  lessThanOrEqualTo: "",
                },
              },
              name: "age",
            },
          },
          _id: "c6b4e610cd984b588837bca27188a451",
          _rev: "7-b8aa1ce0b53e88928bb88fc11bdc0aff",
        },
      },
      stepId: "RECORD_SAVED",
    },
  },
  type: "automation",
  ok: true,
  id: "b384f861f4754e1693835324a7fcca62",
  rev: "1-aa1c2cbd868ef02e26f8fad531dd7e37",
  live: false,
  _id: "b384f861f4754e1693835324a7fcca62",
  _rev: "108-4116829ec375e0481d0ecab9e83a2caf",
}
