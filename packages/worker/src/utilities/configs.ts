import * as pro from "@budibase/pro"

export async function getLicensedConfig() {
  let licensedConfig: object = {}
  const defaults = {
    emailBrandingEnabled: true,
    testimonialsEnabled: true,
    platformTitle: undefined,
    metaDescription: undefined,
    loginHeading: undefined,
    loginButton: undefined,
    metaImageUrl: undefined,
    metaTitle: undefined,
  }

  try {
    // License/Feature Checks
    const enabled = await pro.features.isBrandingEnabled()
    if (!enabled) {
      licensedConfig = { ...defaults }
    }
  } catch (e) {
    licensedConfig = { ...defaults }
    console.info("Could not retrieve license", e)
  }
  return licensedConfig
}
