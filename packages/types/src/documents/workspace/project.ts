import { Document } from "../document"

export interface Project extends Omit<Document, "createdAt" | "updatedAt"> {
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
}
