import { Document } from "../document"
import type { ProjectImportSetup } from "../../api/web/workspace/project"

export interface Project extends Omit<Document, "createdAt" | "updatedAt"> {
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
  importSetup?: ProjectImportSetup
}
