import { db as dbCore, tenancy } from "@budibase/backend-core"
import {
  Config,
  InternalTemplateBinding,
  LOGO_URL,
  EmailTemplatePurpose,
} from "../constants"
import { checkSlashesInUrl } from "./index"
const BASE_COMPANY = "Budibase"

export async function getSettingsTemplateContext(
  purpose: EmailTemplatePurpose,
  code?: string
) {
  const db = tenancy.getGlobalDB()
  // TODO: use more granular settings in the future if required
  let settings =
    (await dbCore.getScopedConfig(db, { type: Config.SETTINGS })) || {}
  const URL = settings.platformUrl
  const context: any = {
    [InternalTemplateBinding.LOGO_URL]:
      checkSlashesInUrl(`${URL}/${settings.logoUrl}`) || LOGO_URL,
    [InternalTemplateBinding.PLATFORM_URL]: URL,
    [InternalTemplateBinding.COMPANY]: settings.company || BASE_COMPANY,
    [InternalTemplateBinding.DOCS_URL]:
      settings.docsUrl || "https://docs.budibase.com/",
    [InternalTemplateBinding.LOGIN_URL]: checkSlashesInUrl(
      tenancy.addTenantToUrl(`${URL}/login`)
    ),
    [InternalTemplateBinding.CURRENT_DATE]: new Date().toISOString(),
    [InternalTemplateBinding.CURRENT_YEAR]: new Date().getFullYear(),
  }
  // attach purpose specific context
  switch (purpose) {
    case EmailTemplatePurpose.PASSWORD_RECOVERY:
      context[InternalTemplateBinding.RESET_CODE] = code
      context[InternalTemplateBinding.RESET_URL] = checkSlashesInUrl(
        tenancy.addTenantToUrl(`${URL}/builder/auth/reset?code=${code}`)
      )
      break
    case EmailTemplatePurpose.INVITATION:
      context[InternalTemplateBinding.INVITE_CODE] = code
      context[InternalTemplateBinding.INVITE_URL] = checkSlashesInUrl(
        tenancy.addTenantToUrl(`${URL}/builder/invite?code=${code}`)
      )
      break
  }
  return context
}
