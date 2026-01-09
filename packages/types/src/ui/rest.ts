export interface RestTemplateSpec {
  version:
    | `${number}-${number}-${number}`
    | `${number}.${number}`
    | `${number}.${number}.${number}`
    | `v${number}`
  url?: string
  data?: string
}

export type RestTemplateSpecVersion = RestTemplateSpec["version"]

export type RestTemplateName =
  | "Attio"
  | "Ansible AWX"
  | "BambooHR"
  | "Confluence"
  | "Discord"
  | "GitHub"
  | "Jira Cloud"
  | "Okta Management"
  | "PagerDuty"
  | "ServiceNow"
  | "Slack Web API"
  | "Stripe"
  | "VirusTotal"
  | TwilioRestTemplateName

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

export type GroupTemplateSelection = {
  kind: "group"
  groupName: RestTemplateGroupName
  template: RestTemplateWithoutIcon<RestTemplateGroups[RestTemplateGroupName]>
}

export type GroupTemplateSelectionDetail = {
  kind: "group"
  groupName: RestTemplateGroupName
  template: RestTemplateWithoutIcon<RestTemplateGroups[RestTemplateGroupName]>
}

export interface TemplateSelectionContext {
  name: string
  description: string
  specs: RestTemplateSpec[]
  icon?: string
  restTemplateName?: RestTemplateName
}

export type TemplateSelectionDetail = {
  kind: "template"
  template: RestTemplate
}

export type TemplateSelectionEventDetail =
  | TemplateSelectionDetail
  | GroupTemplateSelectionDetail

export type TemplateSelection = TemplateSelectionDetail | GroupTemplateSelection

export type ConnectorCard =
  | {
      type: "group"
      name: RestTemplateGroupName
      icon: string
      key: string
      group: RestTemplateGroup<RestTemplateGroupName>
    }
  | {
      type: "template"
      name: RestTemplateName
      icon: string
      key: string
      template: RestTemplate
    }

export type GroupTemplateName = RestTemplateGroups[RestTemplateGroupName]
