import { Document } from "../document"

export interface WorkspaceApp extends Document {
  name: string
  urlPrefix: string
  icon: string
  iconColor?: string
}
