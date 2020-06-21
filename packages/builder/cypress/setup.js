// What this script does:
// 1. Removes the old test folder if it exists (.budibase-cypress)
// 2. Initialises using `.budibase-cypress`
// 3. Runs the server using said folder

const rimraf = require("rimraf")
const { join } = require("path")
const homedir = join(require("os").homedir(), ".budibase-cypress")
const init = require("../../cli/src/commands/init/initHandler")
const run = require("../../cli/src/commands/run/runHandler")

rimraf.sync(homedir)

init({ dir: homedir, clientId: "cypress-test" })
.then(() => {
  run({ dir: homedir })
})
