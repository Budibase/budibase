import type { RestAuthConfig } from "../documents/workspace/datasource"

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
  | "dodo-payments"
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
  | "hubspot"
  | HubSpotRestTemplateId
  | "microsoft-sharepoint"
  | MicrosoftSharepointRestTemplateId
  | "splunk"
  | SplunkRestTemplateId
  | "twilio"
  | TwilioRestTemplateId
  | "zendesk"
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

export type RestTemplateName = string

export type ConnectionMode = "shared" | "independent"

export interface RestTemplateMixin {
  servers?: OpenAPIServer[]
  auth?: RestAuthConfig[]
}

export interface RestTemplate {
  id: RestTemplateId
  name: RestTemplateName
  icon?: string
  description: string
  operationsCount: number
  specs?: RestTemplateSpec[]
  templates?: RestTemplate[]
  connectionMode?: ConnectionMode
  mixin?: RestTemplateMixin
}

export interface TemplateSelectionContext {
  name: string
  description: string
  specs: RestTemplateSpec[]
  icon?: string
  restTemplateId?: RestTemplateId
}
