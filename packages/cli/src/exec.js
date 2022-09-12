const util = require("util")
const exec = util.promisify(require("child_process").exec)

exports.exec = async (command, dir = "./") => {
  const { stdout } = await exec(command, { cwd: dir })
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

exports.runPkgCommand = async (command, dir = "./") => {
  const yarn = await exports.utilityInstalled("yarn")
  const npm = await exports.utilityInstalled("npm")
  if (!yarn && !npm) {
    throw new Error("Must have yarn or npm installed to run build.")
  }
  const npmCmd = command === "install" ? `npm ${command}` : `npm run ${command}`
  const cmd = yarn ? `yarn ${command}` : npmCmd
  await exports.exec(cmd, dir)
}
