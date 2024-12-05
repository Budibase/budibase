import { Document, Template } from "../../../documents"

export interface TemplateDefinition {
  name: string
  description: string
  category: string
}

export interface TemplateBinding {
  name: string
  description: string
}

export interface FetchTemplateDefinitionResponse {
  info: Record<string, TemplateDefinition>
  bindings: Record<string, TemplateBinding[]>
}

export interface SaveTemplateRequest extends Template {}
export interface SaveTemplateResponse extends Template {}

export type FetchTemplateResponse = Template[]
export type FetchTemplateByTypeResponse = Template[]
export type FetchTemplateByOwnerIDResponse = Template[]

export interface FindTemplateResponse extends Template {}

export interface DeleteTemplateResponse {
  message: string
}
