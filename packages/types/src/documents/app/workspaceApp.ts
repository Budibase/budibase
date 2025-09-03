import { Document } from "../document"
import { AppNavigation } from "./workspace"

export interface WorkspaceApp extends Document {
  name: string
  url: string
  navigation: AppNavigation
  isDefault: boolean
  disabled?: boolean
}
