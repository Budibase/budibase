interface OpenAPI {
  version:
    | `v${number}`
    | "latest"
    | `${number}-${number}-${number}`
    | `${number}.${number}`
  url: string
}

export type RestTemplateName =
  | "GitHub"
  | "PagerDuty"
  | "Slack Web API"
  | "Stripe"

export interface RestTemplate {
  name: RestTemplateName
  description: string
  specs: OpenAPI[]
  icon: string
}
