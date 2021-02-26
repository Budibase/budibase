const chalk = require("chalk")

exports.getHelpDescription = string => {
  return chalk.cyan(string)
}

exports.getSubHelpDescription = string => {
  return chalk.green(string)
}

exports.getError = error => {
  return chalk.red(`Error - ${error}`)
}
