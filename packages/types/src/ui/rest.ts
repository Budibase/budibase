export interface RestTemplateSpec {
  version: `${number}-${number}-${number}` | `${number}.${number}`
  url: string
}

export type RestTemplateSpecVersion = RestTemplateSpec["version"]

export type RestTemplateName =
  | "BambooHR"
  | "GitHub"
  | "PagerDuty"
  | "Slack Web API"
  | "Stripe"

export interface RestTemplate {
  name: RestTemplateName
  description: string
  specs: RestTemplateSpec[]
  icon: string
}
