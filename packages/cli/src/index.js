const hosting = require("./hosting")

const { Command } = require("commander")

const program = new Command()

program
  .option(hosting.Config.short, hosting.Config.)
