// What this script does:
// 1. Removes the old test folder if it exists (.budibase-cypress)
// 2. Initialises using `.budibase-cypress`
// 3. Runs the server using said folder

const rimraf = require("rimraf");
const homedir = require('os').homedir() + '/.budibase-cypress';
const { exec } = require("child_process")

rimraf(homedir, function (error) {
    console.log('Error: ', error);
})

exec(`../../packages/cli/bin/budi init -d ${homedir}`)
exec(`../../packages/cli/bin/budi run -d ${homedir}`)