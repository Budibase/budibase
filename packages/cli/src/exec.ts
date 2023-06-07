import util from "util"
const runCommand = util.promisify(require("child_process").exec)

export async function exec(command: string, dir = "./") {
  const { stdout } = await runCommand(command, { cwd: dir })
  return stdout
}

export async function utilityInstalled(utilName: string) {
  try {
    await exec(`${utilName} --version`)
    return true
  } catch (err) {
    return false
  }
}

export async function runPkgCommand(command: string, dir = "./") {
  const yarn = await exports.utilityInstalled("yarn")
  const npm = await exports.utilityInstalled("npm")
  if (!yarn && !npm) {
    throw new Error("Must have yarn or npm installed to run build.")
  }
  const npmCmd = command === "install" ? `npm ${command}` : `npm run ${command}`
  const cmd = yarn ? `yarn ${command} --ignore-engines` : npmCmd
  await exports.exec(cmd, dir)
}
