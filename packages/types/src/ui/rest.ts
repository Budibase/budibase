export interface RestTemplateSpec {
  version: `${number}-${number}-${number}` | `${number}.${number}`
  url: string
}

export type RestTemplateSpecVersion = RestTemplateSpec["version"]

export type RestTemplateName =
  | "BambooHR"
  | "GitHub"
  | "Jira Cloud"
  | "Okta Management"
  | "PagerDuty"
  | "Slack Web API"
  | "Stripe"
  | "VirusTotal"

export interface RestTemplate {
  name: RestTemplateName
  description: string
  specs: RestTemplateSpec[]
  icon: string
}
