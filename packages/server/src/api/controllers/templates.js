const fetch = require("node-fetch")
const {
  downloadTemplate,
  exportTemplateFromApp,
  getLocalTemplates,
} = require("../../utilities/templates")
const env = require("../../environment")

// development flag, can be used to test against templates exported locally
const DEFAULT_TEMPLATES_BUCKET =
  "prod-budi-templates.s3-eu-west-1.amazonaws.com"

exports.fetch = async function(ctx) {
  const { type = "app" } = ctx.query

  if (env.LOCAL_TEMPLATES) {
    ctx.body = Object.values(getLocalTemplates()[type])
  } else {
    const response = await fetch(
      `https://${DEFAULT_TEMPLATES_BUCKET}/manifest.json`
    )
    const json = await response.json()
    ctx.body = Object.values(json.templates[type])
  }
}

// can't currently test this, have to ignore from coverage
/* istanbul ignore next */
exports.downloadTemplate = async function(ctx) {
  const { type, name } = ctx.params

  if (!env.LOCAL_TEMPLATES) {
    await downloadTemplate(type, name)
  }

  ctx.body = {
    message: `template ${type}:${name} downloaded successfully.`,
  }
}

exports.exportTemplateFromApp = async function(ctx) {
  const { appId } = ctx.user
  const { templateName } = ctx.request.body

  await exportTemplateFromApp({
    appId,
    templateName,
  })

  ctx.status = 200
  ctx.body = {
    message: `Created template: ${templateName}`,
  }
}
