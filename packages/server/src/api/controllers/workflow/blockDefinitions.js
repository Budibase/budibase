const ACTION = {
  SAVE_RECORD: {
    name: "Save Record",
    tagline: "<b>Save</b> a <b>{{record.model.name}}</b> record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database.",
    params: {
      record: "record",
    },
    args: {
      record: {},
    },
    type: "ACTION",
  },
  DELETE_RECORD: {
    description: "Delete a record from your database.",
    icon: "ri-delete-bin-line",
    name: "Delete Record",
    tagline: "<b>Delete</b> a <b>{{record.model.name}}</b> record",
    params: {
      record: "record",
    },
    args: {
      record: {},
    },
    type: "ACTION",
  },
  CREATE_USER: {
    description: "Create a new user.",
    tagline: "Create user <b>{{username}}</b>",
    icon: "ri-user-add-fill",
    name: "Create User",
    params: {
      username: "string",
      password: "password",
      accessLevelId: "accessLevel",
    },
    type: "ACTION",
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
  },
}

const LOGIC = {
  FILTER: {
    name: "Filter",
    tagline: "{{field}} <b>{{condition}}</b> {{value}}",
    icon: "ri-git-branch-line",
    description: "Filter any workflows which do not meet certain conditions.",
    params: {
      filter: "string",
      condition: ["equals"],
      value: "string",
    },
    type: "LOGIC",
  },
  DELAY: {
    name: "Delay",
    icon: "ri-time-fill",
    tagline: "Delay for <b>{{time}}</b> milliseconds",
    description: "Delay the workflow until an amount of time has passed.",
    params: {
      time: "number",
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
    description: "Save a record to your database.",
    params: {
      model: "model",
    },
    type: "TRIGGER",
  },
  RECORD_DELETED: {
    name: "Record Deleted",
    event: "record:delete",
    icon: "ri-delete-bin-line",
    tagline: "Record is deleted from <b>{{model.name}}</b>",
    description: "Fired when a record is deleted from your database.",
    params: {
      model: "model",
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
