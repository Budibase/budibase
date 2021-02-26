const inquirer = require("inquirer")

exports.confirmation = async question => {
  const config = {
    type: "confirm",
    message: question,
    default: true,
    name: "confirmation",
  }
  return (await inquirer.prompt(config)).confirmation
}

exports.string = async (question, defaultString = null) => {
  const config = {
    type: "input",
    name: "string",
    message: question,
  }
  if (defaultString) {
    config.default = defaultString
  }
  return (await inquirer.prompt(config)).string
}

exports.number = async (question, defaultNumber) => {
  const config = {
    type: "input",
      name: "number",
    message: question,
    validate: (value) => {
      let valid = !isNaN(parseFloat(value))
      return valid || "Please enter a number"
    },
    filter: Number,
  }
  if (defaultNumber) {
    config.default = defaultNumber
  }
  return (await inquirer.prompt(config)).number
}
