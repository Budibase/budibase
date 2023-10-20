import util from "util"
import childProcess from "child_process"
const runCommand = util.promisify(childProcess.exec)

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
  const yarn = await utilityInstalled("yarn")
  const npm = await utilityInstalled("npm")
  if (!yarn && !npm) {
    throw new Error("Must have yarn or npm installed to run build.")
  }
  const npmCmd = command === "install" ? `npm ${command}` : `npm run ${command}`
  const cmd = yarn ? `yarn ${command} --ignore-engines` : npmCmd
  await exec(cmd, dir)
}
