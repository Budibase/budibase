import { Template } from "../../../documents"

export interface GlobalTemplateDefinition {
  name: string
  description: string
  category: string
}

export interface GlobalTemplateBinding {
  name: string
  description: string
}

export interface FetchGlobalTemplateDefinitionResponse {
  info: Record<string, GlobalTemplateDefinition>
  bindings: Record<string, GlobalTemplateBinding[]>
}

export interface SaveGlobalTemplateRequest extends Template {}
export interface SaveGlobalTemplateResponse extends Template {}

export type FetchGlobalTemplateResponse = Template[]
export type FetchGlobalTemplateByTypeResponse = Template[]
export type FetchGlobalTemplateByOwnerIDResponse = Template[]

export interface FindGlobalTemplateResponse extends Template {}

export interface DeleteGlobalTemplateResponse {
  message: string
}
