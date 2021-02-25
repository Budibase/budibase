class Option {
  constructor(short, long) {
    this.short = short
    this.long = long
    this.opts = []
  }

  addHelp(help) {
    this.help = help
    return this
  }

  addSubOption(command, help) {
    this.opts.push({command, help})
    return this
  }

  configure(program) {
    if (this.opts.length !== 0) {
      const opts = this.opts.map(opt => opt.command)
      // add a help option to all sub-options
      if (opts.indexOf("help") === -1) {
        opts.push("help")
      }
      program.option(this.short, this.long, opts)
    } else {
      program.option(this.short, this.long)
    }
  }

  getHelp() {
    return this.help
  }

  getSubOptions() {
    if (this.opts) {
      return [{command: "help", help: "Display help for this command."}].concat(this.opts)
    } else {
      return []
    }
  }

  isItThisOption(userInput) {
    return !!userInput[this.long]
  }

  execute(userInput) {

  }
}

module.exports = Option
