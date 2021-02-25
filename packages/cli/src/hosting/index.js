const Option = require("../utils/Option")

const option = new Option("-h", "hosting")
  .addHelp("Controls self hosting on the Budibase platform.")
  .addSubOption("init", "Configure a self hosted platform in current directory.")
  .addSubOption("start", "Start the configured platform in current directory.")
  .addSubOption("stop", "Stop the configured platform in the current directory.")
  .addSubOption("update", "Updates the Budibase images to the latest version.")

exports.option = option
