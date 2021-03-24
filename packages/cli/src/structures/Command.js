const { getSubHelpDescription, getHelpDescription, error } = require("../utils")

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
      try {
        let executed = false
        for (let opt of thisCmd.opts) {
          const lookup = opt.command.split(" ")[0].replace("--", "")
          if (options[lookup]) {
            await opt.func(options[lookup])
            executed = true
          }
        }
        if (!executed) {
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
