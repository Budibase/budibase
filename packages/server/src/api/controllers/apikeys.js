const fs = require("fs")
const { join } = require("../../utilities/centralPath")
const readline = require("readline")
const { budibaseAppsDir } = require("../../utilities/budibaseDir")
const ENV_FILE_PATH = "/.env"

exports.fetch = async function(ctx) {
  ctx.status = 200
  ctx.body = {
    budibase: process.env.BUDIBASE_API_KEY,
    userId: process.env.USERID_API_KEY,
  }
}

exports.update = async function(ctx) {
  const key = `${ctx.params.key.toUpperCase()}_API_KEY`
  const value = ctx.request.body.value
  // Set process.env
  process.env[key] = value

  // Write to file
  await updateValues([key, value])

  ctx.status = 200
  ctx.message = `Updated ${ctx.params.key} API key succesfully.`
  ctx.body = { [ctx.params.key]: ctx.request.body.value }
}

async function updateValues([key, value]) {
  let newContent = ""
  let keyExists = false
  let envPath = join(budibaseAppsDir(), ENV_FILE_PATH)
  const readInterface = readline.createInterface({
    input: fs.createReadStream(envPath),
    output: process.stdout,
    console: false,
  })
  readInterface.on("line", function(line) {
    // Mutate lines and change API Key
    if (line.startsWith(key)) {
      line = `${key}=${value}`
      keyExists = true
    }
    newContent = `${newContent}\n${line}`
  })
  readInterface.on("close", function() {
    // Write file here
    if (!keyExists) {
      // Add API Key if it doesn't exist in the file at all
      newContent = `${newContent}\n${key}=${value}`
    }
    fs.writeFileSync(envPath, newContent)
  })
}
