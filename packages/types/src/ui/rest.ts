export interface RestTemplateSpec {
  version: string
  url?: string
  data?: string
}

export type RestTemplateSpecVersion = RestTemplateSpec["version"]

export type RestTemplateName =
  | "Ansible AWX"
  | "Attio"
  | "BambooHR"
  | "Confluence"
  | "Discord"
  | "Figma"
  | "GitHub"
  | "Jira Cloud"
  | "Okta Management"
  | "PagerDuty"
  | "ServiceNow"
  | "Slack Web API"
  | "Stripe"
  | "VirusTotal"
  | "Ashby"
  | "Banksapi"
  | "Baremetrics"
  | "Billsby"
  | "Breezy HR"
  | "Brevo"
  | "BulkSMS"
  | "Buttondown"
  | "Clever"
  | "Clickup"
  | "Deel"
  | "Dixa"
  | "Dots"
  | "Factorial"
  | "Fastspring"
  | "Fountain"
  | "Gitlab"
  | "Goody"
  | "Helcim"
  | "Hibob"
  | "Homerun"
  | "Hypatos"
  | "Intercom"
  | "Ironclad"
  | "Jina AI"
  | "Jobsoid"
  | "Keatext AI"
  | "Kenjo"
  | "Lambda"
  | "Lob"
  | "Localizely"
  | "LogisticsOS"
  | "Mastercard"
  | "Measureone"
  | "Microsoft Teams"
  | "Nanonets"
  | "Notion"
  | "Oyster HR"
  | "Peach Payments"
  | "Pinpoint"
  | "Podium"
  | "Remote"
  | "Resend"
  | "Rivery"
  | "Sage"
  | "Secoda"
  | "Shipengine"
  | "Shippo"
  | "Shortcut"
  | "Smartrecruiters"
  | "SoftLedger"
  | "SpotDraft"
  | "Sumsub"
  | "SuprSend"
  | "Terminal"
  | "Theirstack"
  | "Tilled"
  | "Trello"
  | "Tremendous"
  | "Verifiable"
  | "Volt IO"
  | "Workable"
  | "X"
  | HubSpotRestTemplateName
  | TwilioRestTemplateName
  | ZendeskRestTemplateName

export type RestTemplateGroupName = "HubSpot" | "Twilio" | "Zendesk"

export type RestTemplateGroups = {
  HubSpot: HubSpotRestTemplateName
  Twilio: TwilioRestTemplateName
  Zendesk: ZendeskRestTemplateName
}

export type HubSpotRestTemplateName =
  | "HubSpot Account Info"
  | "HubSpot Actions V4"
  | "HubSpot App Uninstalls"
  | "HubSpot Appointments"
  | "HubSpot Associations"
  | "HubSpot Associations Schema"
  | "HubSpot Audit Logs"
  | "HubSpot Authors"
  | "HubSpot Automation V4"
  | "HubSpot Blog Settings"
  | "HubSpot Bucket_Test111"
  | "HubSpot Business Units"
  | "HubSpot Calling Extensions"
  | "HubSpot Calls"
  | "HubSpot Campaigns Public Api"
  | "HubSpot Carts"
  | "HubSpot Cms Content Audit"
  | "HubSpot Commerce Payments"
  | "HubSpot Commerce Subscriptions"
  | "HubSpot Communications"
  | "HubSpot Companies"
  | "HubSpot Contacts"
  | "HubSpot Contracts"
  | "HubSpot Conversations"
  | "HubSpot Conversations Inbox & Messages"
  | "HubSpot Courses"
  | "HubSpot CRM Meetings"
  | "HubSpot Crm Owners"
  | "HubSpot Custom Channels"
  | "HubSpot Custom Objects"
  | "HubSpot Deal Splits"
  | "HubSpot Deals"
  | "HubSpot Discounts"
  | "HubSpot Domains"
  | "HubSpot Emails"
  | "HubSpot Events"
  | "HubSpot Exports"
  | "HubSpot Feedback Submissions"
  | "HubSpot Fees"
  | "HubSpot Files"
  | "HubSpot Forms"
  | "HubSpot Goal Targets"
  | "HubSpot Hubdb"
  | "HubSpot Imports"
  | "HubSpot Invoices"
  | "HubSpot Leads"
  | "HubSpot Limits Tracking"
  | "HubSpot Line Items"
  | "HubSpot Listings"
  | "HubSpot Lists"
  | "HubSpot Manage Event Definitions"
  | "HubSpot Marketing Emails"
  | "HubSpot Marketing Emails V3"
  | "HubSpot Marketing Events"
  | "HubSpot Media Bridge"
  | "HubSpot Multicurrency"
  | "HubSpot Notes"
  | "HubSpot Oauth"
  | "HubSpot Object Library"
  | "HubSpot Objects"
  | "HubSpot Orders"
  | "HubSpot Origins"
  | "HubSpot Pages"
  | "HubSpot Partner Clients"
  | "HubSpot Partner Services"
  | "HubSpot Payments"
  | "HubSpot Pipelines"
  | "HubSpot Postal Mail"
  | "HubSpot Posts"
  | "HubSpot Products"
  | "HubSpot Projects"
  | "HubSpot Properties"
  | "HubSpot Property Validations"
  | "HubSpot Public App Crm Cards"
  | "HubSpot Public App Feature Flags V3"
  | "HubSpot Quotes"
  | "HubSpot Scheduler Meetings"
  | "HubSpot Schemas"
  | "HubSpot Send Event Completions"
  | "HubSpot Sequences"
  | "HubSpot Services"
  | "HubSpot Single-send"
  | "HubSpot Site Search"
  | "HubSpot Source Code"
  | "HubSpot Subscription Lifecycle"
  | "HubSpot Subscriptions"
  | "HubSpot Tags"
  | "HubSpot Tasks"
  | "HubSpot Tax Rates"
  | "HubSpot Taxes"
  | "HubSpot Test Child Api"
  | "HubSpot Tickets"
  | "HubSpot Timeline"
  | "HubSpot Transactional Single Send"
  | "HubSpot Transcriptions"
  | "HubSpot Url Redirects"
  | "HubSpot User Provisioning"
  | "HubSpot Users"
  | "HubSpot Video Conferencing Extension"
  | "HubSpot Visitor Identification"
  | "HubSpot Webhooks"

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

export type ZendeskRestTemplateName = "Sunshine Conversations"

export interface RestTemplate {
  name: RestTemplateName
  description: string
  specs: RestTemplateSpec[]
  icon: string
  verified?: true
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
  verified?: true
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
