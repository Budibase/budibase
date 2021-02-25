const { getOptions, addHelp, displayHelp } = require("./options")
const { Command } = require("commander")

// add hosting config
function init() {
  const program = new Command()
  addHelp(program)
  for (let option of getOptions()) {
    option.configure(program)
  }
  program.parse(process.argv)
  const userInput = program.opts()
  for (let option of getOptions()) {
    if (option.isItThisOption(userInput)) {
      option.execute(userInput)
    }
  }
}
