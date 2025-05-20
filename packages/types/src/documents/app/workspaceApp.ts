import { Document } from "../document"
import { AppNavigation } from "./app"

export interface WorkspaceApp extends Document {
  name: string
  urlPrefix: string
  icon: string
  iconColor?: string

  navigation: AppNavigation
}
