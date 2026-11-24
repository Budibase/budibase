import { PlanType } from "@budibase/types"
import type { FetchAppPackageResponse } from "@budibase/types"

export const appPackage = (
  overrides: Partial<FetchAppPackageResponse> = {}
): FetchAppPackageResponse => ({
  application: {
    appId: "app_test",
    type: "app",
    version: "1.0.0",
    componentLibraries: [],
    name: "Test workspace",
    url: undefined,
    template: undefined,
    instance: { _id: "app_test" },
    tenantId: "default",
    status: "development",
  },
  licenseType: PlanType.FREE,
  screens: [],
  layouts: [],
  clientLibPath: "",
  hasLock: false,
  ...overrides,
})
