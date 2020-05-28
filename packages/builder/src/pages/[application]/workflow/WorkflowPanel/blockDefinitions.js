const ACTION = {
  SET_STATE: {
    name: "Update UI State",
    tagline: "Update <b>{{path}}</b> to <b>{{value}}</b>",
    icon: "",
    description: "Update your User Interface with some data.",
    environment: "CLIENT",
    params: {
      path: "string",
      value: "string",
    },
  },
  NAVIGATE: {
    name: "Navigate",
    icon: "ri-navigation-line",
    description: "Navigate to another page.",
    environment: "CLIENT",
    params: {
      url: "string",
    },
  },
  SAVE_RECORD: {
    name: "Save Record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database.",
    environment: "SERVER",
    params: {
      model: "string",
    },
  },
  DELETE_RECORD: {
    description: "Delete a record from your database.",
    icon: "ri-delete-bin-line",
    name: "Delete Record",
    environment: "SERVER",
    params: {
      record: "string",
    },
  },
  FIND_RECORD: {
    description: "Delete a record from your database.",
    icon: "ri-delete-bin-line",
    name: "Find Record",
    environment: "SERVER",
    params: {
      record: "string",
    },
  },
  CREATE_USER: {
    description: "Create a new user.",
    icon: "ri-user-add-fill",
    name: "Create User",
    environment: "SERVER",
    params: {
      name: "string",
      password: "password",
      accessLevel: "accessLevel",
    },
  },
  SEND_EMAIL: {
    description: "Send an email.",
    tagline: "Send email to {{to}}",
    icon: "ri-mail-open-fill",
    name: "Send Email",
    environment: "SERVER",
    params: {
      to: "string",
      from: "string",
      subject: "string",
      text: "string",
    },
  },
}

const TRIGGER = {
  SAVE_RECORD: {
    name: "Record Saved",
    icon: "ri-delete-bin-line",
    tagline: "Record is added to {{model}}",
    description: "Save a record to your database.",
    environment: "SERVER",
    params: {
      model: "model",
    },
  },
  CLICK: {
    name: "Click",
    icon: "ri-cursor-line",
    description: "Trigger when you click on an element in the UI.",
  },
  LOAD: {
    name: "Load",
    icon: "ri-loader-line",
    description: "Trigger an element has finished loading.",
  },
  INPUT: {
    name: "Input",
    icon: "ri-text",
    description: "Trigger when you environment into an input box.",
  },
}

const LOGIC = {
  FILTER: {
    name: "Filter",
    tagline: "{{key}} {{condition}} {{value}}",
    icon: "ri-git-branch-line",
    description: "Filter any workflows which do not meet certain conditions.",
    environment: "CLIENT",
    params: {
      if: "string",
    },
  },
  DELAY: {
    name: "Delay",
    icon: "ri-git-branch-line",
    description: "Delay the workflow until an amount of time has passed.",
    environment: "CLIENT",
  },
}

export default {
  ACTION,
  TRIGGER,
  LOGIC,
}
