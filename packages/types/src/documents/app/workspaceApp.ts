import { Document } from "../document"
import { AppNavigation } from "./app"

export interface WorkspaceApp extends Document {
  name: string
  url: string
  navigation: AppNavigation
  isDefault: boolean
  disabled?: boolean
}
