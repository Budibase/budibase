import chalk from "chalk"
import fs from "fs"
import path from "path"
import { join } from "path"
import fetch from "node-fetch"
const progress = require("cli-progress")

export async function downloadFile(url: string, filePath: string) {
  filePath = path.resolve(filePath)
  const writer = fs.createWriteStream(filePath)

  const response = await fetch(url, {
    method: "GET",
  })
  response.body?.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve)
    writer.on("error", reject)
  })
}

export async function httpCall(url: string, method: string) {
  const response = await fetch(url, {
    method,
  })
  return response.body
}

export function getHelpDescription(str: string) {
  return chalk.cyan(str)
}

export function getSubHelpDescription(str: string) {
  return chalk.green(str)
}

export function error(err: string | number) {
  process.exitCode = -1
  return chalk.red(`Error - ${err}`)
}

export function success(str: string) {
  return chalk.green(str)
}

export function info(str: string) {
  return chalk.cyan(str)
}

export function logErrorToFile(file: string, error: string) {
  fs.writeFileSync(path.resolve(`./${file}`), `Budibase Error\n${error}`)
}

export function parseEnv(env: string) {
  const lines = env.toString().split("\n")
  let result: Record<string, string> = {}
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/)
    if (match) {
      result[match[1].trim()] = match[2].trim()
    }
  }
  return result
}

export function progressBar(total: number) {
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic)
  bar.start(total, 0)
  return bar
}

export function checkSlashesInUrl(url: string) {
  return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}

export function moveDirectory(oldPath: string, newPath: string) {
  const files = fs.readdirSync(oldPath)
  // check any file exists already
  for (let file of files) {
    if (fs.existsSync(join(newPath, file))) {
      throw new Error(
        "Unable to remove top level directory - some skeleton files already exist."
      )
    }
  }
  for (let file of files) {
    fs.renameSync(join(oldPath, file), join(newPath, file))
  }
  fs.rmdirSync(oldPath)
}

export function capitaliseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function stringifyToDotEnv(json: Record<string, string | number>) {
  let str = ""
  for (let [key, value] of Object.entries(json)) {
    str += `${key}=${value}\n`
  }
  return str
}
