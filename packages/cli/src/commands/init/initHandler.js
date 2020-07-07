const { xPlatHomeDir } = require("../../common")
const initialiseBudibase = require("@budibase/server/src/utilities/initialiseBudibase")

module.exports = opts => {
  opts.dir = xPlatHomeDir(opts.dir)
  return initialiseBudibase(opts)
}
