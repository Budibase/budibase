let accessLevels = require("../../../utilities/accessLevels")
let conditions = require("../../../workflows/logic").LogicConditions

const ACTION = {
  SAVE_RECORD: {
    name: "Save Record",
    tagline: "Save a {{inputs.record.model.name}} record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database",
    type: "ACTION",
    inputs: {
      record: {
        type: "record",
        label: "The record to be written",
        default: {},
      },
      model: {
        type: "model",
        label: "Table",
      },
    },
    outputs: {
      response: {
        type: "object",
        label: "The response from the table",
      },
      success: {
        type: "boolean",
        label: "Whether the action was successful",
      },
      id: {
        type: "string",
        label: "The identifier of the new record",
      },
      revision: {
        type: "string",
        label: "The revision of the new record",
      },
    },
  },
  DELETE_RECORD: {
    description: "Delete a record from your database",
    icon: "ri-delete-bin-line",
    name: "Delete Record",
    tagline: "Delete a {{inputs.record.model.name}} record",
    type: "ACTION",
    inputs: {
      id: {
        type: "string",
        label: "Record ID",
      },
      revision: {
        type: "string",
        label: "Record Revision",
      },
    },
    outputs: {
      response: {
        type: "object",
        label: "The response from the table",
      },
      success: {
        type: "boolean",
        label: "Whether the action was successful",
      },
    },
  },
  CREATE_USER: {
    description: "Create a new user",
    tagline: "Create user {{inputs.username}}",
    icon: "ri-user-add-fill",
    name: "Create User",
    type: "ACTION",
    inputs: {
      username: {
        type: "string",
        label: "Username",
      },
      password: {
        type: "password",
        label: "Password",
      },
      accessLevelId: {
        type: "string",
        label: "Access Level",
        default: accessLevels.POWERUSER_LEVEL_ID,
        options: accessLevels.ACCESS_LEVELS,
      },
    },
    outputs: {
      id: {
        type: "string",
        label: "The identifier of the new user",
      },
      revision: {
        type: "string",
        label: "The revision of the new user",
      },
      response: {
        type: "object",
        label: "The response from the user table",
      },
      success: {
        type: "boolean",
        label: "Whether the action was successful",
      },
    },
  },
  SEND_EMAIL: {
    description: "Send an email.",
    tagline: "Send email to {{inputs.to}}",
    icon: "ri-mail-open-fill",
    name: "Send Email",
    type: "ACTION",
    inputs: {
      to: {
        type: "string",
        label: "Send To",
      },
      from: {
        type: "string",
        label: "Send From",
      },
      subject: {
        type: "string",
        label: "Email Subject",
      },
      contents: {
        type: "string",
        label: "Email Contents",
      },
    },
    outputs: {
      success: {
        type: "boolean",
        label: "Whether the email was sent",
      },
      response: {
        type: "object",
        label: "A response from the email client, this may be an error",
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
    inputs: {
      filter: {
        type: "string",
        label: "Reference Value",
      },
      condition: {
        type: "string",
        label: "Condition",
        options: conditions,
        default: "equals",
      },
      value: {
        type: "string",
        label: "Comparison Value",
      },
    },
    outputs: {
      success: {
        type: "boolean",
        label: "Whether the logic block passed",
      },
    },
  },
  DELAY: {
    name: "Delay",
    icon: "ri-time-fill",
    tagline: "Delay for {{inputs.time}} milliseconds",
    description: "Delay the workflow until an amount of time has passed",
    inputs: {
      time: {
        type: "number",
        label: "Delay in milliseconds",
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
    tagline: "Record is added to {{inputs.model.name}}",
    description: "Fired when a record is saved to your database",
    inputs: {
      model: {
        type: "model",
        label: "Table",
      },
    },
    outputs: {
      record: {
        type: "record",
        label: "The new record that was saved",
      },
    },
    type: "TRIGGER",
  },
  RECORD_DELETED: {
    name: "Record Deleted",
    event: "record:delete",
    icon: "ri-delete-bin-line",
    tagline: "Record is deleted from {{inputs.model.name}}",
    description: "Fired when a record is deleted from your database",
    inputs: {
      model: {
        type: "model",
        label: "Table",
      },
    },
    outputs: {
      record: {
        type: "record",
        label: "The record that was deleted",
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
