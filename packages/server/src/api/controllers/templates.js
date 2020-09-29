const fetch = require("node-fetch")
const {
  downloadTemplate,
  exportTemplateFromApp,
} = require("../../utilities/templates")

const DEFAULT_TEMPLATES_BUCKET =
  "prod-budi-templates.s3-eu-west-1.amazonaws.com"

exports.fetch = async function(ctx) {
  const { type = "app" } = ctx.query

  const response = await fetch(
    `https://${DEFAULT_TEMPLATES_BUCKET}/manifest.json`
  )
  const json = await response.json()
  ctx.body = Object.values(json.templates[type])
}

exports.downloadTemplate = async function(ctx) {
  const { type, name } = ctx.params

  await downloadTemplate(type, name)

  ctx.body = {
    message: `template ${type}:${name} downloaded successfully.`,
  }
}

exports.exportTemplateFromApp = async function(ctx) {
  const { appId, instanceId } = ctx.user
  const { templateName } = ctx.request.body

  await exportTemplateFromApp({
    appId,
    instanceId,
    templateName,
  })

  ctx.status = 200
  ctx.body = {
    message: `Created template: ${templateName}`,
  }
}
