const chalk = require("chalk")
const fs = require("fs")
const axios = require("axios")
const path = require("path")

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
  fs.writeFileSync(path.resolve(`./${file}`), `Budiase Error\n${error}`)
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
