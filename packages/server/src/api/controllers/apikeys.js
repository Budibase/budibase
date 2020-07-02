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
    // Do something with ctx.request.body: <{ value: value }>
    ctx.status = 200
    ctx.message = `Updated ${ctx.params.key} API key succesfully.`
    ctx.body = { [ctx.params.key]: ctx.request.body.value }
}

async function getEnvironmentVariables() {
    const home = require('os').homedir();
    const filePath = `${home}/${ENV_FILE_PATH}`

    return data = fs.readFileSync(filePath, 'utf8');
}

async function extractKeys() {
    // Extract keys here
    return []
}