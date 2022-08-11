const util = require("util")
const exec = util.promisify(require("child_process").exec)

exports.exec = async command => {
  const { stdout } = await exec(command)
  return stdout
}

exports.utilityInstalled = async utilName => {
  try {
    await exports.exec(`${utilName} --version`)
    return true
  } catch (err) {
    return false
  }
}

exports.runPkgCommand = async command => {
  const yarn = await exports.utilityInstalled("yarn")
  const npm = await exports.utilityInstalled("npm")
  if (!yarn && !npm) {
    throw new Error("Must have yarn or npm installed to run build.")
  }
  const npmCmd = command === "install" ? `npm ${command}` : `npm run ${command}`
  await exports.exec(yarn ? `yarn ${command}` : npmCmd)
}
