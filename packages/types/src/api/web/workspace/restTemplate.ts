import type { RestTemplate } from "../../../ui/rest"

export interface UploadCustomRestTemplateRequest {
  name: string
  description: string
}

export interface UploadCustomRestTemplateResponse {
  template: RestTemplate
}

export type FetchCustomRestTemplatesResponse = RestTemplate[]

export interface DeleteCustomRestTemplateResponse {
  message: string
}
