const hosting = require("./hosting")

exports.getOptions = () => {
  return [hosting.option]
}

exports.addHelp = program => {
  program.option("-h", "help")
}

exports.displayHelp = () => {

}
