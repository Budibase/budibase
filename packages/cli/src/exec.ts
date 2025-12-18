import util from "util"
import childProcess from "child_process"
import fs from "fs"
import path from "path"

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

type PackageManager = "yarn" | "npm" | "pnpm" | "auto"

function resolvePackageManager(dir = "./"): PackageManager {
  const pkgPath = path.join(dir, "package.json")
  const yarnLock = path.join(dir, "yarn.lock")
  const npmLock = path.join(dir, "package-lock.json")
  const pnpmLock = path.join(dir, "pnpm-lock.yaml")

  // Prefer explicit packageManager field if present
  try {
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"))
      const pm =
        typeof pkg?.packageManager === "string" ? pkg.packageManager : ""
      if (pm.startsWith("yarn@")) return "yarn"
      if (pm.startsWith("npm@")) return "npm"
      if (pm.startsWith("pnpm@")) return "pnpm"
    }
  } catch {
    // ignore
  }

  // Otherwise select based on lock files. Default to yarn if multiple exist.
  if (fs.existsSync(yarnLock)) return "yarn"
  if (fs.existsSync(pnpmLock)) return "pnpm"
  if (fs.existsSync(npmLock)) return "npm"

  return "auto"
}

export async function runPkgCommand(command: string, dir = "./") {
  const preferred = resolvePackageManager(dir)
  const yarn = await utilityInstalled("yarn")
  const npm = await utilityInstalled("npm")
  const pnpm = await utilityInstalled("pnpm")

  // Use the plugin's lockfile/packageManager when available, otherwise default to yarn.
  if (preferred === "pnpm") {
    if (!pnpm) {
      throw new Error(
        "pnpm is required to run this project (pnpm-lock.yaml or packageManager indicates pnpm)."
      )
    }
    const pnpmCmd =
      command === "install" ? "pnpm install" : `pnpm run ${command}`
    await exec(pnpmCmd, dir)
    return
  }

  if (preferred === "npm") {
    if (!npm) {
      throw new Error(
        "npm is required to run this project (package-lock.json or packageManager indicates npm)."
      )
    }
    const npmCmd =
      command === "install" ? `npm ${command}` : `npm run ${command}`
    await exec(npmCmd, dir)
    return
  }

  // If the project indicates yarn, use it (with npm fallback).
  if (preferred === "yarn") {
    if (yarn) {
      await exec(`yarn ${command} --ignore-engines`, dir)
      return
    }
    if (!npm) {
      throw new Error(
        "yarn is required to run this project (yarn.lock or packageManager indicates yarn)."
      )
    }
    const npmCmd =
      command === "install" ? `npm ${command}` : `npm run ${command}`
    await exec(npmCmd, dir)
    return
  }

  // Default to npm when the project has no lockfile/packageManager signal.
  if (npm) {
    const npmCmd =
      command === "install" ? `npm ${command}` : `npm run ${command}`
    await exec(npmCmd, dir)
    return
  }

  if (yarn) {
    await exec(`yarn ${command} --ignore-engines`, dir)
    return
  }

  throw new Error("Must have yarn or npm installed to run build.")
}
