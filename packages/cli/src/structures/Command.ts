import {
  getSubHelpDescription,
  getHelpDescription,
  error,
  capitaliseFirstLetter,
} from "../utils"

type CommandOpt = {
  command: string
  help: string
  func?: Function
  extras: any[]
}

export class Command {
  command: string
  opts: CommandOpt[]
  func?: Function
  help?: string

  constructor(command: string, func?: Function) {
    // if there are options, need to just get the command name
    this.command = command
    this.opts = []
    this.func = func
  }

  convertToCommander(lookup: string) {
    const parts = lookup.toLowerCase().split("-")
    // camel case, separate out first
    const first = parts.shift()
    return [first]
      .concat(parts.map(part => capitaliseFirstLetter(part)))
      .join("")
  }

  addHelp(help: string) {
    this.help = help
    return this
  }

  addSubOption(
    command: string,
    help: string,
    func?: Function,
    extras: any[] = []
  ) {
    this.opts.push({ command, help, func, extras })
    return this
  }

  configure(program: any) {
    const thisCmd = this
    let command = program.command(thisCmd.command)
    if (this.help) {
      command = command.description(getHelpDescription(thisCmd.help!))
    }
    for (let opt of thisCmd.opts) {
      command = command.option(opt.command, getSubHelpDescription(opt.help))
    }
    command.helpOption(
      "--help",
      getSubHelpDescription(`Get help with ${this.command} options`)
    )
    command.action(async (options: Record<string, string>) => {
      try {
        let executed = false,
          found = false
        for (let opt of thisCmd.opts) {
          let lookup = opt.command.split(" ")[0].replace("--", "")
          // need to handle how commander converts watch-plugin-dir to watchPluginDir
          lookup = this.convertToCommander(lookup)
          found = !executed && !!options[lookup]
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
      } catch (err: any) {
        console.log(error(err))
      }
    })
  }
}
