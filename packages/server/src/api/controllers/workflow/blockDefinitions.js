let accessLevels = require("../../../utilities/accessLevels")
let conditions = require("../../../workflows/logic").LogicConditions

const ACTION = {
  SAVE_RECORD: {
    name: "Save Record",
    tagline: "<b>Save</b> a <b>{{record.model.name}}</b> record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database",
    type: "ACTION",
    input: {
      record: {
        type: "record",
        label: "The record to be written",
        default: {},
      },
      model: {
        type: "model",
        label: "The table to save a record to",
      },
    },
    output: {
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
    tagline: "<b>Delete</b> a <b>{{record.model.name}}</b> record",
    type: "ACTION",
    input: {
      id: {
        type: "string",
        label: "The identifier of the record to be deleted",
      },
      revision: {
        type: "string",
        label: "The revision of the record to be deleted",
      },
    },
    output: {
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
    tagline: "Create user <b>{{username}}</b>",
    icon: "ri-user-add-fill",
    name: "Create User",
    params: {
      username: "string",
      password: "password",
      accessLevelId: "accessLevel",
    },
    args: {
      accessLevelId: "POWER_USER",
    },
    type: "ACTION",
    input: {
      username: {
        type: "string",
        label: "The username of the new user to create",
      },
      password: {
        type: "password",
        label: "The password of the new user to create",
      },
      accessLevelId: {
        type: "string",
        label: "The level of access to the system the new user will have",
        default: accessLevels.POWERUSER_LEVEL_ID,
        options: accessLevels.ACCESS_LEVELS,
      },
    },
    output: {
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
    input: {
      to: {
        type: "string",
        label: "Email address to send email to",
      },
      from: {
        type: "string",
        label: "Email address to send email from",
      },
      subject: {
        type: "string",
        label: "The subject of the email",
      },
      contents: {
        type: "string",
        label: "The contents of the email",
      },
    },
    output: {
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
    tagline: "{{filter}} <b>{{condition}}</b> {{value}}",
    icon: "ri-git-branch-line",
    description: "Filter any workflows which do not meet certain conditions",
    params: {
      filter: "string",
      condition: ["equals"],
      value: "string",
    },
    args: {
      condition: "equals",
    },
    type: "LOGIC",
    input: {
      field: {
        type: "string",
        label: "The input to filter on",
      },
      condition: {
        type: "string",
        label: "The condition to use for filtering",
        options: conditions,
      },
      value: {
        type: "string",
        label: "The value to compare against",
      },
    },
    output: {
      success: {
        type: "boolean",
        label: "Whether the logic block passed",
      },
    },
  },
  DELAY: {
    name: "Delay",
    icon: "ri-time-fill",
    tagline: "Delay for <b>{{time}}</b> milliseconds",
    description: "Delay the workflow until an amount of time has passed",
    input: {
      time: {
        type: "number",
        label: "The duration of the delay in milliseconds",
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
    tagline: "Record is added to <b>{{model.name}}</b>",
    description: "Fired when a record is saved to your database",
    input: {
      model: {
        type: "model",
        label: "The table to trigger on when a new record is saved",
      },
    },
    output: {
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
    tagline: "Record is deleted from <b>{{model.name}}</b>",
    description: "Fired when a record is deleted from your database",
    input: {
      model: {
        type: "model",
        label: "The table to trigger on when a record is deleted",
      },
    },
    output: {
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
