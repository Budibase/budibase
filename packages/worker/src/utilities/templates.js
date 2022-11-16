const { getScopedConfig } = require("@budibase/backend-core/db")
const {
  Config,
  InternalTemplateBindings,
  LOGO_URL,
  EmailTemplatePurpose,
} = require("../constants")
const { checkSlashesInUrl } = require("./index")
const {
  getGlobalDB,
  addTenantToUrl,
} = require("@budibase/backend-core/tenancy")
const BASE_COMPANY = "Budibase"

exports.getSettingsTemplateContext = async (purpose, code = null) => {
  const db = getGlobalDB()
  // TODO: use more granular settings in the future if required
  let settings = (await getScopedConfig(db, { type: Config.SETTINGS })) || {}
  const URL = settings.platformUrl
  const context = {
    [InternalTemplateBindings.LOGO_URL]:
      checkSlashesInUrl(`${URL}/${settings.logoUrl}`) || LOGO_URL,
    [InternalTemplateBindings.PLATFORM_URL]: URL,
    [InternalTemplateBindings.COMPANY]: settings.company || BASE_COMPANY,
    [InternalTemplateBindings.DOCS_URL]:
      settings.docsUrl || "https://docs.budibase.com/",
    [InternalTemplateBindings.LOGIN_URL]: checkSlashesInUrl(
      addTenantToUrl(`${URL}/login`)
    ),
    [InternalTemplateBindings.CURRENT_DATE]: new Date().toISOString(),
    [InternalTemplateBindings.CURRENT_YEAR]: new Date().getFullYear(),
  }
  // attach purpose specific context
  switch (purpose) {
    case EmailTemplatePurpose.PASSWORD_RECOVERY:
      context[InternalTemplateBindings.RESET_CODE] = code
      context[InternalTemplateBindings.RESET_URL] = checkSlashesInUrl(
        addTenantToUrl(`${URL}/builder/auth/reset?code=${code}`)
      )
      break
    case EmailTemplatePurpose.INVITATION:
      context[InternalTemplateBindings.INVITE_CODE] = code
      context[InternalTemplateBindings.INVITE_URL] = checkSlashesInUrl(
        addTenantToUrl(`${URL}/builder/invite?code=${code}`)
      )
      break
  }
  return context
}
