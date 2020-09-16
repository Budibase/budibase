let accessLevels = require("../../../utilities/accessLevels")
let conditions = require("../../../workflows/logic").LogicConditions

const ACTION = {
  SAVE_RECORD: {
    name: "Save Record",
    tagline: "Save a {{inputs.enriched.model.name}} record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database",
    type: "ACTION",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          record: {
            type: "object",
            properties: {
              modelId: {
                type: "string",
                customType: "model",
                title: "Table",
              },
            },
            customType: "record",
            title: "The record to be written",
            default: {},
            required: ["modelId"],
          },
        },
        required: ["record"],
      },
      outputs: {
        properties: {
          response: {
            type: "object",
            description: "The response from the table",
          },
          success: {
            type: "boolean",
            description: "Whether the action was successful",
          },
          id: {
            type: "string",
            description: "The identifier of the new record",
          },
          revision: {
            type: "string",
            description: "The revision of the new record",
          },
        },
        required: ["success", "id", "revision"],
      },
    },
  },
  DELETE_RECORD: {
    description: "Delete a record from your database",
    icon: "ri-delete-bin-line",
    name: "Delete Record",
    tagline: "Delete a {{inputs.enriched.model.name}} record",
    type: "ACTION",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          modelId: {
            type: "string",
            customType: "model",
            title: "Table",
          },
          id: {
            type: "string",
            title: "Record ID",
          },
          revision: {
            type: "string",
            title: "Record Revision",
          },
        },
        required: ["modelId", "id", "revision"],
      },
      outputs: {
        properties: {
          record: {
            type: "object",
            customType: "record",
            description: "The deleted record",
          },
          response: {
            type: "object",
            description: "The response from the table",
          },
          success: {
            type: "boolean",
            description: "Whether the action was successful",
          },
        },
        required: ["record", "success"],
      },
    },
  },
  CREATE_USER: {
    description: "Create a new user",
    tagline: "Create user {{inputs.username}}",
    icon: "ri-user-add-fill",
    name: "Create User",
    type: "ACTION",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          username: {
            type: "string",
            title: "Username",
          },
          password: {
            type: "string",
            customType: "password",
            title: "Password",
          },
          accessLevelId: {
            type: "string",
            title: "Access Level",
            default: accessLevels.POWERUSER_LEVEL_ID,
            enum: accessLevels.ACCESS_LEVELS,
          },
        },
        required: ["username", "password", "accessLevelId"],
      },
      outputs: {
        properties: {
          id: {
            type: "string",
            description: "The identifier of the new user",
          },
          revision: {
            type: "string",
            description: "The revision of the new user",
          },
          response: {
            type: "object",
            description: "The response from the user table",
          },
          success: {
            type: "boolean",
            description: "Whether the action was successful",
          },
        },
        required: ["id", "revision", "success"],
      },
    },
  },
  SEND_EMAIL: {
    description: "Send an email.",
    tagline: "Send email to {{inputs.to}}",
    icon: "ri-mail-open-fill",
    name: "Send Email",
    type: "ACTION",
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
          subject: {
            type: "string",
            title: "Email Subject",
          },
          contents: {
            type: "string",
            title: "Email Contents",
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
            description:
              "A response from the email client, this may be an error",
          },
        },
        required: ["success"],
      },
    },
  },
}

const LOGIC = {
  FILTER: {
    name: "Filter",
    tagline: "{{inputs.filter}} {{inputs.condition}} {{inputs.value}}",
    icon: "ri-git-branch-line",
    description: "Filter any workflows which do not meet certain conditions",
    type: "LOGIC",
    inputs: {},
    schema: {
      inputs: {
        filter: {
          type: "string",
          title: "Reference Value",
        },
        condition: {
          type: "string",
          title: "Condition",
          enum: conditions,
          default: "equals",
        },
        value: {
          type: "string",
          title: "Comparison Value",
        },
        required: ["filter", "condition", "value"],
      },
      outputs: {
        properties: {
          success: {
            type: "boolean",
            description: "Whether the logic block passed",
          },
        },
        required: ["success"],
      },
    },
  },
  DELAY: {
    name: "Delay",
    icon: "ri-time-fill",
    tagline: "Delay for {{inputs.time}} milliseconds",
    description: "Delay the workflow until an amount of time has passed",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          time: {
            type: "number",
            title: "Delay in milliseconds",
          },
        },
        required: ["time"],
      },
    },
    type: "LOGIC",
  },
}

const TRIGGER = {
  RECORD_SAVED: {
    name: "Record Saved",
    event: "record:save",
    icon: "ri-save-line",
    tagline: "Record is added to {{inputs.enriched.model.name}}",
    description: "Fired when a record is saved to your database",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          modelId: {
            type: "string",
            customType: "model",
            title: "Table",
          },
        },
        required: ["modelId"],
      },
      outputs: {
        properties: {
          record: {
            type: "object",
            customType: "record",
            description: "The new record that was saved",
          },
        },
        required: ["record"],
      },
    },
    type: "TRIGGER",
  },
  RECORD_DELETED: {
    name: "Record Deleted",
    event: "record:delete",
    icon: "ri-delete-bin-line",
    tagline: "Record is deleted from {{inputs.enriched.model.name}}",
    description: "Fired when a record is deleted from your database",
    inputs: {},
    schema: {
      inputs: {
        properties: {
          modelId: {
            type: "string",
            customType: "model",
            title: "Table",
          },
        },
        required: ["modelId"],
      },
      outputs: {
        properties: {
          record: {
            type: "object",
            customType: "record",
            description: "The record that was deleted",
          },
        },
        required: ["record"],
      },
    },
    type: "TRIGGER",
  },
}

// This contains the definitions for the steps and triggers that make up a workflow, a workflow comprises
// of many steps and a single trigger
module.exports = {
  ACTION,
  LOGIC,
  TRIGGER,
}
