import { Document } from "../document"
import type { ProjectImportSetup } from "../../api/web/workspace/project"

export const MAX_PROJECT_README_LENGTH = 100000

export interface Project extends Omit<Document, "createdAt" | "updatedAt"> {
  name: string
  description?: string
  readme?: string
  color?: string
  createdAt: string
  updatedAt: string
  importSetup?: ProjectImportSetup
}
