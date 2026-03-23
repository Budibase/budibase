import { SettingsBrandingConfig, SettingsInnerConfig } from "@budibase/types"
import * as features from "../features"

const DEFAULT_BRANDING_CONFIG: SettingsBrandingConfig = {
  faviconUrl: undefined,
  faviconUrlEtag: undefined,

  emailBrandingEnabled: true,
  platformTitle: undefined,
  loginHeading: undefined,
  loginButton: undefined,

  metaDescription: undefined,
  metaImageUrl: undefined,
  metaTitle: undefined,
}

export async function getBrandingConfig(
  config: SettingsInnerConfig & SettingsBrandingConfig
): Promise<SettingsBrandingConfig> {
  // when branding is disabled we always return the default
  // values no matter what is in the database
  if (!(await features.isBrandingEnabled())) {
    return DEFAULT_BRANDING_CONFIG
  } else {
    return {
      faviconUrl: config.faviconUrl,
      faviconUrlEtag: config.faviconUrlEtag,
      emailBrandingEnabled: config.emailBrandingEnabled,
      platformTitle: config.platformTitle,
      loginHeading: config.loginHeading,
      loginButton: config.loginButton,
      metaDescription: config.metaDescription,
      metaImageUrl: config.metaImageUrl,
      metaTitle: config.metaTitle,
    }
  }
}
