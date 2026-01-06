export interface RestTemplateSpec {
  version: string
  url: string
}

export type RestTemplateSpecVersion = RestTemplateSpec["version"]

export type RestTemplateName =
  | "Ansible AWX"
  | "Attio"
  | "BambooHR"
  | "GitHub"
  | "Jira Cloud"
  | "Okta Management"
  | "PagerDuty"
  | "Slack Web API"
  | "Stripe"
  | "VirusTotal"
  | "2 C 2 P"
  | "Aeternity Foundation"
  | "Affinity"
  | "Agrimetrics"
  | "Alexishr"
  | "Apaleo"
  | "API Video"
  | "Ashby"
  | "Banksapi"
  | "Baremetrics"
  | "Baseten"
  | "Beam"
  | "Beamable"
  | "Beehiiv"
  | "Billsby"
  | "Bity"
  | "BL Ink"
  | "Bluesnap"
  | "Bluetime"
  | "Breezy HR"
  | "Brevo"
  | "Browse AI"
  | "Browsercat"
  | "Btcpay Server"
  | "Bulksms Com"
  | "Buttondown"
  | "Chatkitty"
  | "Circleci"
  | "Clarifai"
  | "Clever"
  | "Clickfunnels"
  | "Clickup"
  | "Coalesce"
  | "Connexpay"
  | "Copper"
  | "Crowd 4 Cash"
  | "Crowdsec"
  | "Crusoe"
  | "Currency Alliance"
  | "Deel"
  | "Dev"
  | "Diarupt AI"
  | "Discourse"
  | "Dixa"
  | "Dots"
  | "Drivewealth"
  | "Ducky"
  | "Ebury"
  | "Echelon"
  | "Edge"
  | "Elevenlabs"
  | "Epidemic Sound"
  | "Factorial"
  | "Fastspring"
  | "Finley"
  | "Finshark"
  | "Flickr"
  | "Foodkit"
  | "Fordefi"
  | "Fountain"
  | "Freeagent"
  | "Giphy"
  | "Gitlab"
  | "Gladly"
  | "Global Predictions Inc"
  | "Golioth"
  | "Goody"
  | "Gridbees"
  | "Griffin"
  | "Hathora"
  | "Height"
  | "Helcim"
  | "Hibob"
  | "Hive"
  | "Homerun"
  | "Httpbin"
  | "Hypatos"
  | "Hyperplane"
  | "Ilert"
  | "Inducedai"
  | "Inmobile"
  | "Innoship"
  | "Intercom"
  | "Interviewstream"
  | "Ironclad"
  | "Jiko"
  | "Jina AI"
  | "Jobadder"
  | "Jobsoid"
  | "Keatext AI"
  | "Keka HR"
  | "Kenjo"
  | "Lambda"
  | "Langfuse"
  | "Layer 2 Financial"
  | "Leaflink"
  | "Lob"
  | "Localizely"
  | "Logisticsos"
  | "Malga"
  | "Marketdata"
  | "Mastercard"
  | "Measureone"
  | "Megaapi"
  | "Meilisearch"
  | "Melodie Music"
  | "Miso"
  | "Modrinth"
  | "Monto"
  | "Multiwoven"
  | "Namely"
  | "Nanonets"
  | "Netvyne"
  | "Nfe IO"
  | "Nocodb"
  | "Notabene"
  | "Notion"
  | "Nuapay"
  | "Officient"
  | "Okta"
  | "Onedoc"
  | "Onelogin"
  | "Onna"
  | "Oxford Dictionaries"
  | "Oyster"
  | "Pappers"
  | "Partna"
  | "Pay Com"
  | "Paychex"
  | "Paycor"
  | "Payfactory"
  | "Payfit"
  | "Peach Payments"
  | "Peoplehr"
  | "Pinpoint"
  | "Podium"
  | "Posthog"
  | "Postmark"
  | "Procurify"
  | "Proliant"
  | "Prolific"
  | "Proovid"
  | "Pulze AI"
  | "Quivr"
  | "Radix"
  | "Rated"
  | "Recruiterflow"
  | "Redkik"
  | "Relynk"
  | "Relysia"
  | "Remote"
  | "Resend"
  | "Resistant AI"
  | "Retell AI"
  | "Revenium"
  | "Rivery"
  | "Rook"
  | "Rotten Tomatoes"
  | "Sage"
  | "Secoda"
  | "Seel"
  | "Seomonitor"
  | "Sesame HR"
  | "Seyna"
  | "Shipengine"
  | "Shippo"
  | "Shortcut"
  | "Shutterstock"
  | "Signwell"
  | "Smartrecruiters"
  | "Softledger"
  | "Soundcloud"
  | "Space Invoices"
  | "Spotdraft"
  | "Spotify"
  | "Sqala"
  | "Stark Bank"
  | "Sumsub"
  | "Suprsend"
  | "Surfly"
  | "Svix"
  | "Sync Labs"
  | "Tavus"
  | "Terminal"
  | "Text Request"
  | "Theirstack"
  | "Tilled"
  | "Token"
  | "Tramitapp"
  | "Trello"
  | "Tremendous"
  | "Tribepad"
  | "Tripadd"
  | "Unit"
  | "Unstructured"
  | "Uploadcare"
  | "Uploadthing"
  | "Vantage"
  | "Vegapay"
  | "Verifiable"
  | "Volt IO"
  | "Wannme"
  | "Weavy"
  | "Wefitter"
  | "Wikimedia"
  | "Wink"
  | "Workable"
  | "X"
  | "Xkcd"
  | "Xyte"
  | "You Need A Budget"
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
