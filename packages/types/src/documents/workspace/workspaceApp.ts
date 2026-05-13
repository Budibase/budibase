import { Document } from "../document"
import { Theme } from "./theme"
import { AppCustomTheme, AppNavigation } from "./workspace"

export interface WorkspaceApp extends Document {
  name: string
  url: string
  navigation: AppNavigation
  theme?: Theme
  customTheme?: AppCustomTheme
  isDefault: boolean
  disabled?: boolean
}
