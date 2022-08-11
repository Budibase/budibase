const { cloneDeep } = require("lodash")
const { definitions } = require("../../integrations")
const { SourceName } = require("@budibase/types")
const googlesheets = require("../../integrations/googlesheets")
const { featureFlags } = require("@budibase/backend-core")

exports.fetch = async function (ctx) {
  ctx.status = 200
  const defs = cloneDeep(definitions)

  // for google sheets integration google verification
  if (featureFlags.isEnabled(featureFlags.FeatureFlag.GOOGLE_SHEETS)) {
    defs[SourceName.GOOGLE_SHEETS] = googlesheets.schema
  }

  ctx.body = defs
}

exports.find = async function (ctx) {
  ctx.status = 200
  ctx.body = definitions[ctx.params.type]
}
