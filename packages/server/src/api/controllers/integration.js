const { cloneDeep } = require("lodash")
const { definitions } = require("../../integrations")
const { SourceNames } = require("../../definitions/datasource")
const googlesheets = require("../../integrations/googlesheets")
const { featureFlags } = require("@budibase/backend-core")

exports.fetch = async function (ctx) {
  ctx.status = 200
  const defs = cloneDeep(definitions)

  // for google sheets integration google verification
  if (featureFlags.isEnabled(featureFlags.FeatureFlag.GOOGLE_SHEETS)) {
    defs[SourceNames.GOOGLE_SHEETS] = googlesheets.schema
  }

  ctx.body = defs
}

exports.find = async function (ctx) {
  ctx.status = 200
  ctx.body = definitions[ctx.params.type]
}
