const { getScopedConfig, getGlobalDB } = require("@budibase/auth/db")
const {
  Configs,
  InternalTemplateBindings,
  LOGO_URL,
  EmailTemplatePurpose,
} = require("../constants")
const { checkSlashesInUrl } = require("./index")
const env = require("../environment")

const LOCAL_URL = `http://localhost:${env.CLUSTER_PORT || 10000}`
const BASE_COMPANY = "Budibase"

exports.getSettingsTemplateContext = async (tenantId, purpose, code = null) => {
  const db = new getGlobalDB(tenantId)
  // TODO: use more granular settings in the future if required
  let settings = (await getScopedConfig(db, { type: Configs.SETTINGS })) || {}
  if (!settings || !settings.platformUrl) {
    settings.platformUrl = LOCAL_URL
  }
  const URL = settings.platformUrl
  const context = {
    [InternalTemplateBindings.LOGO_URL]:
      checkSlashesInUrl(`${URL}/${settings.logoUrl}`) || LOGO_URL,
    [InternalTemplateBindings.PLATFORM_URL]: URL,
    [InternalTemplateBindings.COMPANY]: settings.company || BASE_COMPANY,
    [InternalTemplateBindings.DOCS_URL]:
      settings.docsUrl || "https://docs.budibase.com/",
    [InternalTemplateBindings.LOGIN_URL]: checkSlashesInUrl(`${URL}/login`),
    [InternalTemplateBindings.CURRENT_DATE]: new Date().toISOString(),
    [InternalTemplateBindings.CURRENT_YEAR]: new Date().getFullYear(),
  }
  // attach purpose specific context
  switch (purpose) {
    case EmailTemplatePurpose.PASSWORD_RECOVERY:
      context[InternalTemplateBindings.RESET_CODE] = code
      context[InternalTemplateBindings.RESET_URL] = checkSlashesInUrl(
        `${URL}/builder/auth/reset?code=${code}`
      )
      break
    case EmailTemplatePurpose.INVITATION:
      context[InternalTemplateBindings.INVITE_CODE] = code
      context[InternalTemplateBindings.INVITE_URL] = checkSlashesInUrl(
        `${URL}/builder/invite?code=${code}`
      )
      break
  }
  return context
}
