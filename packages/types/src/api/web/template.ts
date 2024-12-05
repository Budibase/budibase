export enum TemplateType {
  APP = "app",
}

export interface TemplateMetadata {
  background: string
  icon: string
  category: string
  description: string
  name: string
  url: string
  type: TemplateType
  key: string
  image: string
}

export type FetchTemplateResponse = TemplateMetadata[]

export interface DownloadTemplateResponse {
  message: string
}
