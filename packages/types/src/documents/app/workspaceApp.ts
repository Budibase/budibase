import { Document } from "../document"
import { AppNavigation } from "./app"

export interface WorkspaceApp extends Document {
  name: string
  url: string
  navigation: AppNavigation
  // TODO: remove when cleaning the flag FeatureFlag.WORKSPACE_APPS
  isDefault: boolean
  disabled?: boolean
}
