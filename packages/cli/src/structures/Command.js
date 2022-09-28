const {
  getSubHelpDescription,
  getHelpDescription,
  error,
  capitaliseFirstLetter,
} = require("../utils")

class Command {
  constructor(command, func = null) {
    // if there are options, need to just get the command name
    this.command = command
    this.opts = []
    this.func = func
  }

  convertToCommander(lookup) {
    const parts = lookup.toLowerCase().split("-")
    // camel case, separate out first
    const first = parts.shift()
    return [first]
      .concat(parts.map(part => capitaliseFirstLetter(part)))
      .join("")
  }

  addHelp(help) {
    this.help = help
    return this
  }

  addSubOption(command, help, func, extras = []) {
    this.opts.push({ command, help, func, extras })
    return this
  }

  configure(program) {
    const thisCmd = this
    let command = program.command(thisCmd.command)
    if (this.help) {
      command = command.description(getHelpDescription(thisCmd.help))
    }
    for (let opt of thisCmd.opts) {
      command = command.option(opt.command, getSubHelpDescription(opt.help))
    }
    command.helpOption(
      "--help",
      getSubHelpDescription(`Get help with ${this.command} options`)
    )
    command.action(async options => {
      try {
        let executed = false,
          found = false
        for (let opt of thisCmd.opts) {
          let lookup = opt.command.split(" ")[0].replace("--", "")
          // need to handle how commander converts watch-plugin-dir to watchPluginDir
          lookup = this.convertToCommander(lookup)
          found = !executed && options[lookup]
          if (found && opt.func) {
            const input =
              Object.keys(options).length > 1 ? options : options[lookup]
            await opt.func(input)
            executed = true
          }
        }
        if (found && !executed) {
          console.log(
            error(`${Object.keys(options)[0]} is an option, not an operation.`)
          )
        } else if (!executed) {
          console.log(error(`Unknown ${this.command} option.`))
          command.help()
        }
      } catch (err) {
        console.log(error(err))
      }
    })
  }
}

module.exports = Command
