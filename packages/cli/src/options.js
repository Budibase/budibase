const hosting = require("./hosting")

exports.getCommands = () => {
  return [hosting.command]
}
