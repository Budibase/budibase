const fs = require("fs")
const ENV_FILE_PATH = ".budibase/.env"

exports.fetch = async function (ctx) {
    ctx.status = 200
    ctx.body = {
        budibase: process.env.BUDIBASE_API_KEY,
        sendgrid: process.env.SENDGRID_API_KEY
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
    console.log(lines)
    // Extract keys here
    return lines
}