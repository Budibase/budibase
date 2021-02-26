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
    responseType: "stream"
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

exports.getError = error => {
  return chalk.red(`Error - ${error}`)
}
