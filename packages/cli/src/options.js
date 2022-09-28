const analytics = require("./analytics")
const hosting = require("./hosting")
const backups = require("./backups")
const plugins = require("./plugins")

exports.getCommands = () => {
  return [hosting.command, analytics.command, backups.command, plugins.command]
}
