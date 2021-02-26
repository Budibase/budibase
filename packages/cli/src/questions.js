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
