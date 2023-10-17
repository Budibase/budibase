const inquirer = require("inquirer")

export async function confirmation(question: string) {
  const config = {
    type: "confirm",
    message: question,
    default: true,
    name: "confirmation",
  }
  return (await inquirer.prompt(config)).confirmation
}

export async function string(question: string, defaultString?: string) {
  const config: any = {
    type: "input",
    name: "string",
    message: question,
  }
  if (defaultString) {
    config.default = defaultString
  }
  return (await inquirer.prompt(config)).string
}

export async function number(question: string, defaultNumber?: number) {
  const config: any = {
    type: "input",
    name: "number",
    message: question,
    validate: (value: string) => {
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
