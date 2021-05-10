const CouchDB = require("../db")
const { getScopedConfig, StaticDatabases } = require("@budibase/auth").db
const {
  Configs,
  TemplateBindings,
  LOGO_URL,
  EmailTemplatePurpose,
} = require("../constants")
const { checkSlashesInUrl } = require("./index")
const env = require("../environment")

const LOCAL_URL = `http://localhost:${env.PORT}`
const BASE_COMPANY = "Budibase"

exports.getSettingsTemplateContext = async (purpose, code = null) => {
  const db = new CouchDB(StaticDatabases.GLOBAL.name)
  // TODO: use more granular settings in the future if required
  const settings = await getScopedConfig(db, { type: Configs.SETTINGS })
  if (!settings.platformUrl) {
    settings.platformUrl = LOCAL_URL
  }
  const URL = settings.platformUrl
  const context = {
    [TemplateBindings.LOGO_URL]:
      checkSlashesInUrl(`${URL}/${settings.logoUrl}`) || LOGO_URL,
    [TemplateBindings.PLATFORM_URL]: URL,
    [TemplateBindings.COMPANY]: settings.company || BASE_COMPANY,
    [TemplateBindings.DOCS_URL]:
      settings.docsUrl || "https://docs.budibase.com/",
    [TemplateBindings.LOGIN_URL]: checkSlashesInUrl(`${URL}/login`),
    [TemplateBindings.CURRENT_DATE]: new Date().toISOString(),
    [TemplateBindings.CURRENT_YEAR]: new Date().getFullYear(),
  }
  // attach purpose specific context
  switch (purpose) {
    case EmailTemplatePurpose.PASSWORD_RECOVERY:
      context[TemplateBindings.RESET_CODE] = code
      context[TemplateBindings.RESET_URL] = checkSlashesInUrl(
        `${URL}/reset?code=${code}`
      )
      break
    case EmailTemplatePurpose.INVITATION:
      context[TemplateBindings.INVITE_CODE] = code
      context[TemplateBindings.INVITE_URL] = checkSlashesInUrl(
        `${URL}/invite?code=${code}`
      )
      break
  }
  return context
}
