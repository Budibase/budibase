const ACTIONS = {
  SET_STATE: {
    name: "Update UI",
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

const UTILITIES = {
  IFELSE: {
    name: "If/Else",
    icon: "ri-git-branch-line",
    description: "Perform different actions based on a condition",
    type: "CLIENT"
  },
}

export default {
  ACTIONS,
  TRIGGERS,
  UTILITIES
}