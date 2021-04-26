const CouchDB = require("../db")
const { getConfigParams, StaticDatabases } = require("@budibase/auth").db
const { Configs, TemplateBindings, LOGO_URL } = require("../constants")
const { checkSlashesInUrl } = require("./index")
const env = require("../environment")

const LOCAL_URL = `http://localhost:${env.PORT}`
const BASE_COMPANY = "Budibase"

exports.getSettingsTemplateContext = async () => {
  const db = new CouchDB(StaticDatabases.GLOBAL.name)
  const response = await db.allDocs(
    getConfigParams(Configs.SETTINGS, {
      include_docs: true,
    })
  )
  let settings = response.rows.map(row => row.doc)[0] || {}
  if (!settings.platformUrl) {
    settings.platformUrl = LOCAL_URL
  }
  // TODO: need to fully spec out the context
  const URL = settings.platformUrl
  return {
    [TemplateBindings.LOGO_URL]: settings.logoUrl || LOGO_URL,
    [TemplateBindings.PLATFORM_URL]: URL,
    [TemplateBindings.REGISTRATION_URL]: checkSlashesInUrl(
      `${URL}/registration`
    ),
    [TemplateBindings.RESET_URL]: checkSlashesInUrl(`${URL}/reset`),
    [TemplateBindings.COMPANY]: settings.company || BASE_COMPANY,
    [TemplateBindings.DOCS_URL]:
      settings.docsUrl || "https://docs.budibase.com/",
    [TemplateBindings.LOGIN_URL]: checkSlashesInUrl(`${URL}/login`),
  }
}
