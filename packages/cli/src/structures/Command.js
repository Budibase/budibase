const {
  getSubHelpDescription,
  getHelpDescription,
  getError,
} = require("../utils")

class Command {
  constructor(command, func = null) {
    // if there are options, need to just get the command name
    this.command = command
    this.opts = []
    this.func = func
  }

  addHelp(help) {
    this.help = help
    return this
  }

  addSubOption(command, help, func) {
    this.opts.push({ command, help, func })
    return this
  }

  configure(program) {
    const thisCmd = this
    let command = program.command(thisCmd.command)
    if (this.help) {
      command = command.description(getHelpDescription(thisCmd.help))
    }
    for (let opt of thisCmd.opts) {
      command = command.option(
        `${opt.command}`,
        getSubHelpDescription(opt.help)
      )
    }
    command.helpOption(
      "--help",
      getSubHelpDescription(`Get help with ${this.command} options`)
    )
    command.action(async options => {
      let executed = false
      if (thisCmd.func) {
        await thisCmd.func(options)
        executed = true
      }
      for (let opt of thisCmd.opts) {
        if (options[opt.command.replace("--", "")]) {
          await opt.func(options)
          executed = true
        }
      }
      if (!executed) {
        console.log(getError(`Unknown ${this.command} option.`))
        command.help()
      }
    })
  }
}

module.exports = Command
