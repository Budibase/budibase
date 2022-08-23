const analytics = require("./analytics")
const hosting = require("./hosting")
const backups = require("./backups")

exports.getCommands = () => {
  return [hosting.command, analytics.command, backups.command]
}
