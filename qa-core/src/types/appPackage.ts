import { Application } from "../types"
import { Layout, Screen } from "@budibase/types"
// Create type for getAppPackage response
export interface AppPackageResponse {
  application: Partial<Application>
  layout: Layout
  screens: Screen[]
}
