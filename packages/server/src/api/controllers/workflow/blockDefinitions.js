const ACTION = {
  SAVE_RECORD: {
    name: "Save Record",
    tagline: "<b>Save</b> a <b>{{record.model.name}}</b> record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database.",
    environment: "SERVER",
    params: {
      record: "record",
    },
    args: {
      record: {},
    },
  },
  DELETE_RECORD: {
    description: "Delete a record from your database.",
    icon: "ri-delete-bin-line",
    name: "Delete Record",
    tagline: "<b>Delete</b> a <b>{{record.model.name}}</b> record",
    environment: "SERVER",
    params: {
      record: "record",
    },
    args: {
      record: {},
    },
  },
  // FIND_RECORD: {
  //   description: "Find a record in your database.",
  //   tagline: "<b>Find</b> a <b>{{record.model.name}}</b> record",
  //   icon: "ri-search-line",
  //   name: "Find Record",
  //   environment: "SERVER",
  //   params: {
  //     record: "string",
  //   },
  // },
  CREATE_USER: {
    description: "Create a new user.",
    tagline: "Create user <b>{{username}}</b>",
    icon: "ri-user-add-fill",
    name: "Create User",
    environment: "SERVER",
    params: {
      username: "string",
      password: "password",
      accessLevelId: "accessLevel",
    },
  },
  SEND_EMAIL: {
    description: "Send an email.",
    tagline: "Send email to <b>{{to}}</b>",
    icon: "ri-mail-open-fill",
    name: "Send Email",
    environment: "SERVER",
    params: {
      to: "string",
      from: "string",
      subject: "longText",
      text: "longText",
    },
  },
}

const TRIGGER = {
  RECORD_SAVED: {
    name: "Record Saved",
    event: "record:save",
    icon: "ri-save-line",
    tagline: "Record is added to <b>{{model.name}}</b>",
    description: "Save a record to your database.",
    environment: "SERVER",
    params: {
      model: "model",
    },
  },
  RECORD_DELETED: {
    name: "Record Deleted",
    event: "record:delete",
    icon: "ri-delete-bin-line",
    tagline: "Record is deleted from <b>{{model.name}}</b>",
    description: "Fired when a record is deleted from your database.",
    environment: "SERVER",
    params: {
      model: "model",
    },
  },
}

const LOGIC = {
  FILTER: {
    name: "Filter",
    tagline: "{{field}} <b>{{condition}}</b> {{value}}",
    icon: "ri-git-branch-line",
    description: "Filter any workflows which do not meet certain conditions.",
    environment: "CLIENT",
    params: {
      filter: "string",
      condition: ["equals"],
      value: "string",
    },
  },
  DELAY: {
    name: "Delay",
    icon: "ri-time-fill",
    tagline: "Delay for <b>{{time}}</b> milliseconds",
    description: "Delay the workflow until an amount of time has passed.",
    environment: "CLIENT",
    params: {
      time: "number",
    },
  },
}

module.exports = {
  ACTION,
  TRIGGER,
  LOGIC,
}
