const fs = require("fs")

const ENV_FILE_PATH = ".budibase/.env"

exports.fetch = async function (ctx) {
    // Check if structure of call makes sense, if not, return error


    // Read File
    const fileContent = await getEnvironmentVariables()
    const keys = await extractKeys(fileContent)

    // Temporary while "real" infrastructure to store keys is created
    ctx.status = 200
    ctx.message = "API Keys"
    ctx.body = {
        budibase: 'testFromBackEnd',
        sendgrid: 'testFromBackEnd'
    }
}

exports.update = async function (ctx) {
    // Set process.env
    const envKeyName = `${ctx.params.key.toUpperCase()}_API_KEY`
    process.env[envKeyName] = ctx.request.body.value

    // Write to file
    // TODO

    ctx.status = 200
    ctx.message = `Updated ${ctx.params.key} API key succesfully.`
    ctx.body = { [ctx.params.key]: ctx.request.body.value }
}

async function getEnvironmentVariables() {
    const home = require('os').homedir();
    const filePath = `${home}/${ENV_FILE_PATH}`

    return data = fs.readFileSync(filePath, 'utf8');
}

async function extractKeys(content) {
    const lines = content.split(/\r?\n/)
    // Extract keys here
    return []
}