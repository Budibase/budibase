const ACTIONS = {
  SET_STATE: {
    name: "Update UI State",
    icon: "",
    description: "Update your User Interface with some data.",
    type: "CLIENT",
  },
  NAVIGATE: {
    name: "Navigate",
    icon: "ri-navigation-line",
    description: "Navigate to another page.",
    type: "CLIENT"
  },
  SAVE_RECORD: {
    name: "Save Record",
    icon: "ri-save-3-fill",
    description: "Save a record to your database.",
    type: "SERVER",
  },
  DELETE_RECORD: {
    description: "Delete a record from your database.",
    icon: "ri-delete-bin-line",
    name: "Delete Record",
    type: "SERVER",
  },
  FIND_RECORD: {
    description: "Delete a record from your database.",
    icon: "ri-delete-bin-line",
    name: "Find Record",
    type: "SERVER",
  },
  CREATE_USER: {
    description: "Create a new user.",
    icon: "ri-user-add-fill",
    name: "Create User",
    type: "SERVER",
  },
  SEND_EMAIL: {
    description: "Send an email.",
    icon: "ri-mail-open-fill",
    name: "Send Email",
    type: "SERVER",
  }
};

const TRIGGERS = {
  SAVE_RECORD: {
    name: "Record Saved",
    icon: "ri-delete-bin-line",
    description: "Save a record to your database.",
    type: "SERVER",
  },
  CLICK: {
    name: "Click",
    icon: "ri-cursor-line",
    description: "Trigger when you click on an element in the UI."
  },
  LOAD: {
    name: "Load",
    icon: "ri-loader-line",
    description: "Trigger an element has finished loading."
  },
  INPUT: {
    name: "Input",
    icon: "ri-text",
    description: "Trigger when you type into an input box."
  },
};

const LOGIC = {
  FILTER: {
    name: "Filter",
    icon: "ri-git-branch-line",
    description: "Filter any workflows which do not meet certain conditions.",
    type: "CLIENT"
  },
  DELAY: {
    name: "Delay",
    icon: "ri-git-branch-line",
    description: "Delay the workflow until an amount of time has passed.",
    type: "CLIENT"
  },
}

export default {
  ACTIONS,
  TRIGGERS,
  LOGIC
}