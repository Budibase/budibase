const fetch = require("node-fetch")
const { downloadTemplate } = require("../../utilities/fileSystem")

// development flag, can be used to test against templates exported locally
const DEFAULT_TEMPLATES_BUCKET =
  "prod-budi-templates.s3-eu-west-1.amazonaws.com"

exports.fetch = async function (ctx) {
  const { type = "app" } = ctx.query
  let response,
    error = false
  try {
    response = await fetch(`https://${DEFAULT_TEMPLATES_BUCKET}/manifest.json`)
    if (response.status !== 200) {
      error = true
    }
  } catch (err) {
    error = true
  }
  // if there is an error, simply return no templates
  if (!error && response) {
    const json = await response.json()
    ctx.body = Object.values(json.templates[type])
  } else {
    ctx.body = []
  }
}

// can't currently test this, have to ignore from coverage
/* istanbul ignore next */
exports.downloadTemplate = async function (ctx) {
  const { type, name } = ctx.params

  await downloadTemplate(type, name)

  ctx.body = {
    message: `template ${type}:${name} downloaded successfully.`,
  }
}
