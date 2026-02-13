export interface RestTemplateSpec {
  version: string
  url?: string
}

export interface OpenAPIServerVariable {
  default: string
  enum?: string[]
  description?: string
}

export interface OpenAPIServer {
  url: string
  description?: string
  variables?: Record<string, OpenAPIServerVariable>
}

export type RestTemplateSpecVersion = RestTemplateSpec["version"]

export type RestTemplateId =
  | "ansible-awx"
  | "attio"
  | "bamboohr"
  | "confluence"
  | "discord"
  | "figma"
  | "github"
  | "jira-cloud"
  | "okta-management"
  | "pagerduty"
  | "servicenow"
  | "slack-web-api"
  | "stripe"
  | "virustotal"
  | "ashby"
  | "banksapi"
  | "baremetrics"
  | "billsby"
  | "breezy-hr"
  | "brevo"
  | "bulksms"
  | "buttondown"
  | "clever"
  | "clickup"
  | "deel"
  | "dixa"
  | "dots"
  | "factorial"
  | "fastspring"
  | "fountain"
  | "gitlab"
  | "goody"
  | "helcim"
  | "hibob"
  | "homerun"
  | "hypatos"
  | "intercom"
  | "ironclad"
  | "jina-ai"
  | "jobsoid"
  | "keatext-ai"
  | "kenjo"
  | "lambda"
  | "lob"
  | "localizely"
  | "logisticsos"
  | "mastercard"
  | "measureone"
  | "microsoft-teams"
  | "nanonets"
  | "notion"
  | "oyster-hr"
  | "peach-payments"
  | "pinpoint"
  | "podium"
  | "remote"
  | "resend"
  | "rivery"
  | "sage"
  | "secoda"
  | "shipengine"
  | "shippo"
  | "shortcut"
  | "smartrecruiters"
  | "softledger"
  | "spotdraft"
  | "sumsub"
  | "suprsend"
  | "terminal"
  | "theirstack"
  | "tilled"
  | "trello"
  | "tremendous"
  | "verifiable"
  | "volt-io"
  | "workable"
  | "openrouter"
  | "x"
  | HubSpotRestTemplateId
  | MicrosoftSharepointRestTemplateId
  | SplunkRestTemplateId
  | TwilioRestTemplateId
  | ZendeskRestTemplateId

export type HubSpotRestTemplateId =
  | "hubspot-account-info"
  | "hubspot-actions-v4"
  | "hubspot-app-uninstalls"
  | "hubspot-appointments"
  | "hubspot-associations"
  | "hubspot-associations-schema"
  | "hubspot-audit-logs"
  | "hubspot-authors"
  | "hubspot-automation-v4"
  | "hubspot-blog-settings"
  | "hubspot-bucket-test111"
  | "hubspot-business-units"
  | "hubspot-calling-extensions"
  | "hubspot-calls"
  | "hubspot-campaigns-public-api"
  | "hubspot-carts"
  | "hubspot-cms-content-audit"
  | "hubspot-commerce-payments"
  | "hubspot-commerce-subscriptions"
  | "hubspot-communications"
  | "hubspot-companies"
  | "hubspot-contacts"
  | "hubspot-contracts"
  | "hubspot-conversations"
  | "hubspot-conversations-inbox-messages"
  | "hubspot-courses"
  | "hubspot-crm-meetings"
  | "hubspot-crm-owners"
  | "hubspot-custom-channels"
  | "hubspot-custom-objects"
  | "hubspot-deal-splits"
  | "hubspot-deals"
  | "hubspot-discounts"
  | "hubspot-domains"
  | "hubspot-emails"
  | "hubspot-events"
  | "hubspot-exports"
  | "hubspot-feedback-submissions"
  | "hubspot-fees"
  | "hubspot-files"
  | "hubspot-forms"
  | "hubspot-goal-targets"
  | "hubspot-hubdb"
  | "hubspot-imports"
  | "hubspot-invoices"
  | "hubspot-leads"
  | "hubspot-limits-tracking"
  | "hubspot-line-items"
  | "hubspot-listings"
  | "hubspot-lists"
  | "hubspot-manage-event-definitions"
  | "hubspot-marketing-emails"
  | "hubspot-marketing-emails-v3"
  | "hubspot-marketing-events"
  | "hubspot-media-bridge"
  | "hubspot-multicurrency"
  | "hubspot-notes"
  | "hubspot-oauth"
  | "hubspot-object-library"
  | "hubspot-objects"
  | "hubspot-orders"
  | "hubspot-origins"
  | "hubspot-pages"
  | "hubspot-partner-clients"
  | "hubspot-partner-services"
  | "hubspot-payments"
  | "hubspot-pipelines"
  | "hubspot-postal-mail"
  | "hubspot-posts"
  | "hubspot-products"
  | "hubspot-projects"
  | "hubspot-properties"
  | "hubspot-property-validations"
  | "hubspot-public-app-crm-cards"
  | "hubspot-public-app-feature-flags-v3"
  | "hubspot-quotes"
  | "hubspot-scheduler-meetings"
  | "hubspot-schemas"
  | "hubspot-send-event-completions"
  | "hubspot-sequences"
  | "hubspot-services"
  | "hubspot-single-send"
  | "hubspot-site-search"
  | "hubspot-source-code"
  | "hubspot-subscription-lifecycle"
  | "hubspot-subscriptions"
  | "hubspot-tags"
  | "hubspot-tasks"
  | "hubspot-tax-rates"
  | "hubspot-taxes"
  | "hubspot-test-child-api"
  | "hubspot-tickets"
  | "hubspot-timeline"
  | "hubspot-transactional-single-send"
  | "hubspot-transcriptions"
  | "hubspot-url-redirects"
  | "hubspot-user-provisioning"
  | "hubspot-users"
  | "hubspot-video-conferencing-extension"
  | "hubspot-visitor-identification"
  | "hubspot-webhooks"

export type TwilioRestTemplateId =
  | "twilio-accounts"
  | "twilio-assistants"
  | "twilio-bulk-exports"
  | "twilio-chat"
  | "twilio-content"
  | "twilio-conversations"
  | "twilio-events"
  | "twilio-flex"
  | "twilio-frontline"
  | "twilio-iam"
  | "twilio-iam-organizations"
  | "twilio-iam-scim"
  | "twilio-insights"
  | "twilio-intelligence"
  | "twilio-ip-messaging"
  | "twilio-knowledge"
  | "twilio-lookups"
  | "twilio-marketplace"
  | "twilio-messaging"
  | "twilio-monitor"
  | "twilio-notify"
  | "twilio-numbers"
  | "twilio-oauth"
  | "twilio-preview"
  | "twilio-pricing"
  | "twilio-proxy"
  | "twilio-routes"
  | "twilio-serverless"
  | "twilio-studio"
  | "twilio-super-sim"
  | "twilio-sync"
  | "twilio-taskrouter"
  | "twilio-trunking"
  | "twilio-trusthub"
  | "twilio-verify"
  | "twilio-video"
  | "twilio-voice"
  | "twilio-wireless"

export type SplunkRestTemplateId =
  | "splunk-admin-config-service"
  | "splunk-enterprise-security"
  | "splunk-mission-control-automation"

export type ZendeskRestTemplateId = "zendesk-sunshine-conversations"

export type MicrosoftSharepointRestTemplateId =
  | "microsoft-sharepoint-drives"
  | "microsoft-sharepoint-shares"
  | "microsoft-sharepoint-sites"

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
  | "OpenRouter"
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
  | MicrosoftSharepointRestTemplateName
  | SplunkRestTemplateName
  | TwilioRestTemplateName
  | ZendeskRestTemplateName

export type RestTemplateGroupName =
  | "HubSpot"
  | "Microsoft SharePoint"
  | "Splunk"
  | "Twilio"
  | "Zendesk"

export type RestTemplateGroups = {
  HubSpot: HubSpotRestTemplateName
  "Microsoft SharePoint": MicrosoftSharepointRestTemplateName
  Splunk: SplunkRestTemplateName
  Twilio: TwilioRestTemplateName
  Zendesk: ZendeskRestTemplateName
}

export type RestTemplateGroupIds = {
  HubSpot: HubSpotRestTemplateId
  "Microsoft SharePoint": MicrosoftSharepointRestTemplateId
  Splunk: SplunkRestTemplateId
  Twilio: TwilioRestTemplateId
  Zendesk: ZendeskRestTemplateId
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

export type SplunkRestTemplateName =
  | "Splunk Admin Config Service"
  | "Splunk Enterprise Security"
  | "Splunk Mission Control Automation"

export type ZendeskRestTemplateName = "Sunshine Conversations"

export type MicrosoftSharepointRestTemplateName = "Drives" | "Shares" | "Sites"

export interface RestTemplate {
  id: RestTemplateId
  name: RestTemplateName
  description: string
  specs: RestTemplateSpec[]
  icon: string
  operationsCount: number
  verified?: true
}

export interface RestTemplateWithoutIcon<Name, Id = RestTemplateId> {
  id: Id
  name: Name
  description: string
  specs: RestTemplateSpec[]
  operationsCount: number
}

export interface RestTemplateGroup<
  TemplateGroupName extends keyof RestTemplateGroups,
> {
  name: TemplateGroupName
  description: string
  icon: string
  operationsCount: number
  verified?: true
  templates: RestTemplateWithoutIcon<
    RestTemplateGroups[TemplateGroupName],
    RestTemplateGroupIds[TemplateGroupName]
  >[]
}

export type GroupTemplateSelection = {
  kind: "group"
  groupName: RestTemplateGroupName
  template: RestTemplateWithoutIcon<
    RestTemplateGroups[RestTemplateGroupName],
    RestTemplateGroupIds[RestTemplateGroupName]
  >
}

export type GroupTemplateSelectionDetail = {
  kind: "group"
  groupName: RestTemplateGroupName
  template: RestTemplateWithoutIcon<
    RestTemplateGroups[RestTemplateGroupName],
    RestTemplateGroupIds[RestTemplateGroupName]
  >
}

export interface TemplateSelectionContext {
  name: string
  description: string
  specs: RestTemplateSpec[]
  icon?: string
  restTemplateId?: RestTemplateId
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
