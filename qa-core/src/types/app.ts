// TODO: Integrate with budibase
export interface CreateAppRequest {
  name: string
  url: string
  useTemplate?: string
  templateName?: string
  templateKey?: string
  templateFile?: string
  includeSampleData?: boolean
}
