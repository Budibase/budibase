import type { CustomRestTemplateId } from "../../ui/rest"
import type { Document } from "../document"

export type CustomRestTemplateFileExtension = "json" | "yaml"

export interface CustomRestTemplateDocument extends Document {
  _id: CustomRestTemplateId
  restTemplateId: CustomRestTemplateId
  name: string
  description: string
  objectStoreKey: string
  fileExtension: CustomRestTemplateFileExtension
  operationsCount: number
}
