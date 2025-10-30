interface OpenAPI {
  version:
    | `v${number}`
    | "latest"
    | `${number}-${number}-${number}`
    | `${number}.${number}`
  url: string
}

export interface RestTemplate {
  name: string
  description: string
  specs: OpenAPI[]
  icon: string
}
