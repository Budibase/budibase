export interface RestTemplateSpec {
  version:
    | `${number}-${number}-${number}`
    | `${number}.${number}`
    | `${number}.${number}.${number}`
    | `v${number}`
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

export type RestTemplateGroupName = "Twilio"

export type RestTemplateGroups = {
  Twilio: TwilioRestTemplateName
}

export type TwilioRestTemplateName =
  | "Twilio Accounts"
  | "Twilio Assistants"
  | "Twilio Bulk Exports"
  | "Twilio Chat"
  | "Twilio Content"
  | "Twilio Conversations"
  | "Twilio Events"
  | "Twilio Flex"
  | "Twilio Frontline"
  | "Twilio IAM"
  | "Twilio IAM Organizations"
  | "Twilio IAM SCIM"
  | "Twilio Insights"
  | "Twilio Intelligence"
  | "Twilio IP Messaging"
  | "Twilio Knowledge"
  | "Twilio Lookups"
  | "Twilio Marketplace"
  | "Twilio Messaging"
  | "Twilio Monitor"
  | "Twilio Notify"
  | "Twilio Numbers"
  | "Twilio OAuth"
  | "Twilio Preview"
  | "Twilio Pricing"
  | "Twilio Proxy"
  | "Twilio Routes"
  | "Twilio Serverless"
  | "Twilio Studio"
  | "Twilio Super SIM"
  | "Twilio Sync"
  | "Twilio TaskRouter"
  | "Twilio Trunking"
  | "Twilio TrustHub"
  | "Twilio Verify"
  | "Twilio Video"
  | "Twilio Voice"
  | "Twilio Wireless"

export interface RestTemplate {
  name: RestTemplateName
  description: string
  specs: RestTemplateSpec[]
  icon: string
}

export interface RestTemplateWithoutIcon<Name> {
  name: Name
  description: string
  specs: RestTemplateSpec[]
}

export interface RestTemplateGroup<
  TemplateGroupName extends keyof RestTemplateGroups,
> {
  name: TemplateGroupName
  description: string
  icon: string
  templates: RestTemplateWithoutIcon<RestTemplateGroups[TemplateGroupName]>[]
}
