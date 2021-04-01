const analytics = require("./analytics")
const hosting = require("./hosting")

exports.getCommands = () => {
  return [hosting.command, analytics.command]
}
