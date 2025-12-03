export interface RestTemplateSpec {
  version: string
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
  | "Splunk Collect"
  | "Stripe"

export interface RestTemplate {
  name: RestTemplateName
  description: string
  specs: RestTemplateSpec[]
  icon: string
}
