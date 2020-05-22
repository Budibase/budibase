const ACTIONS = {
  SET_STATE: {
    name: "Update UI",
    icon: "",
    description: "Update your User Interface with some data.",
    type: "CLIENT",
  },
  NAVIGATE: {
    name: "Navigate",
    icon: "",
    description: "Navigate to another page.",
    type: "CLIENT"
  },
  CREATE_RECORD: {
    name: "Save Record",
    icon: "",
    description: "Save a record to your database.",
    type: "SERVER",
  },
  DELETE_RECORD: {
    description: "Delete a record from your database.",
    icon: "",
    name: "Delete Record",
    type: "SERVER",
  }
};

const TRIGGERS = {
  CLICK: {
    name: "Click",
    icon: "",
    description: "Trigger when you click on an element in the UI."
  },
  LOAD: {
    name: "Load",
    icon: "",
    description: "Trigger an element has finished loading."
  },
  INPUT: {
    name: "Input",
    icon: "",
    description: "Trigger when you type into an input box."
  },
};

const UTILITIES = {

}

export default {
  ACTIONS,
  TRIGGERS,
  UTILITIES
}