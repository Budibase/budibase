const chalk = require("chalk")
const fs = require("fs")
const axios = require("axios")
const path = require("path")
const progress = require("cli-progress")
const { join } = require("path")

exports.downloadFile = async (url, filePath) => {
  filePath = path.resolve(filePath)
  const writer = fs.createWriteStream(filePath)

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve)
    writer.on("error", reject)
  })
}

exports.httpCall = async (url, method) => {
  const response = await axios({
    url,
    method,
  })
  return response.data
}

exports.getHelpDescription = string => {
  return chalk.cyan(string)
}

exports.getSubHelpDescription = string => {
  return chalk.green(string)
}

exports.error = error => {
  return chalk.red(`Error - ${error}`)
}

exports.success = success => {
  return chalk.green(success)
}

exports.info = info => {
  return chalk.cyan(info)
}

exports.logErrorToFile = (file, error) => {
  fs.writeFileSync(path.resolve(`./${file}`), `Budibase Error\n${error}`)
}

exports.parseEnv = env => {
  const lines = env.toString().split("\n")
  let result = {}
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/)
    if (match) {
      result[match[1].trim()] = match[2].trim()
    }
  }
  return result
}

exports.progressBar = total => {
  const bar = new progress.SingleBar({}, progress.Presets.shades_classic)
  bar.start(total, 0)
  return bar
}

exports.checkSlashesInUrl = url => {
  return url.replace(/(https?:\/\/)|(\/)+/g, "$1$2")
}

exports.moveDirectory = (oldPath, newPath) => {
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

exports.capitaliseFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

exports.stringifyToDotEnv = json => {
  let str = ""
  for (let [key, value] of Object.entries(json)) {
    str += `${key}=${value}\n`
  }
  return str
}
