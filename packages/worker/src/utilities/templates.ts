import { tenancy, configs } from "@budibase/backend-core"
import { SettingsInnerConfig } from "@budibase/types"
import {
  InternalTemplateBinding,
  LOGO_URL,
  EmailTemplatePurpose,
} from "../constants"
import { checkSlashesInUrl } from "./index"
import { getLicensedConfig } from "./configs"

const BASE_COMPANY = "Budibase"

export async function getSettingsTemplateContext(
  purpose: EmailTemplatePurpose,
  code?: string | null
) {
  let settings = await configs.getSettingsConfig()
  const URL = settings.platformUrl
  const context: any = {
    [InternalTemplateBinding.LOGO_URL]:
      checkSlashesInUrl(`${URL}/${settings.logoUrl}`) || LOGO_URL,
    [InternalTemplateBinding.PLATFORM_URL]: URL,
    [InternalTemplateBinding.COMPANY]: settings.company || BASE_COMPANY,
    [InternalTemplateBinding.DOCS_URL]: "https://docs.budibase.com/",
    [InternalTemplateBinding.LOGIN_URL]: checkSlashesInUrl(
      tenancy.addTenantToUrl(`${URL}/login`)
    ),
    [InternalTemplateBinding.CURRENT_DATE]: new Date().toISOString(),
    [InternalTemplateBinding.CURRENT_YEAR]: new Date().getFullYear(),
  }

  try {
    const config: SettingsInnerConfig = await getLicensedConfig()
    context["enableEmailBranding"] = config?.emailBrandingEnabled || true
  } catch (e) {
    context["enableEmailBranding"] = true
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
