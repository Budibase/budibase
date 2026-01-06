import {
  RestTemplate,
  RestTemplateGroup,
  RestTemplateGroupName,
  RestTemplateName,
} from "@budibase/types"
import { BudiStore } from "../BudiStore"
import AnsibleLogo from "assets/rest-template-icons/ansible.svg"
import AttioLogo from "assets/rest-template-icons/attio.svg"
import BambooHRLogo from "assets/rest-template-icons/bamboohr.svg"
import JiraLogo from "assets/rest-template-icons/jira.svg"
import GitHubLogo from "assets/rest-template-icons/github.svg"
import OktaLogo from "assets/rest-template-icons/okta.svg"
import PagerDutyLogo from "assets/rest-template-icons/pagerduty.svg"
import SlackLogo from "assets/rest-template-icons/slack.svg"
import StripeLogo from "assets/rest-template-icons/stripe.svg"
import TwilioLogo from "assets/rest-template-icons/twilio.svg"
import VirusTotalLogo from "assets/rest-template-icons/virustotal.svg"
import DummyLogo from "assets/rest-template-icons/dummy.svg"

interface RestTemplatesState {
  templates: RestTemplate[]
  templateGroups: RestTemplateGroup<RestTemplateGroupName>[]
}

const twilioRestTemplateGroup: RestTemplateGroup<"Twilio"> = {
  name: "Twilio",
  icon: TwilioLogo,
  description:
    "Combines powerful communications APIs with AI and first-party data.",
  templates: [
    {
      name: "Twilio Accounts",
      description:
        "Core account resources including usage, addresses, and credentials",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_accounts_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Assistants",
      description: "Autopilot assistants, tasks, samples, and field values",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_assistants_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Bulk Exports",
      description:
        "BulkExports API for exporting messaging, voice, and usage data",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_bulkexports_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Chat",
      description: "Programmable Chat channels, members, roles, and messages",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_chat_v3.yaml",
        },
      ],
    },
    {
      name: "Twilio Content",
      description: "Reusable Content API for templates, variants, and media",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_content_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Conversations",
      description: "Conversations services, participants, and messages",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_conversations_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Events",
      description:
        "Event Streams resources for schema, sinks, and subscriptions",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_events_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Flex",
      description: "Flex contact center configuration, users, and integrations",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_flex_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Frontline",
      description:
        "Frontline mobile workforce accounts, users, and conversations",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_frontline_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio IAM",
      description:
        "Identity and access management for keys, services, and policies",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_iam_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio IAM Organizations",
      description: "IAM organization, invitation, and membership management",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_iam_organizations.yaml",
        },
      ],
    },
    {
      name: "Twilio IAM SCIM",
      description: "SCIM directory sync for IAM users and groups",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_iam_scim.yaml",
        },
      ],
    },
    {
      name: "Twilio Insights",
      description: "Voice Insights calls, metrics, and summaries",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_insights_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Intelligence",
      description: "Voice Intelligence transcripts, participants, and insights",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_intelligence_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio IP Messaging",
      description: "Programmable IP Messaging services, users, and messages",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_ip_messaging_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Knowledge",
      description: "Knowledge base content, categories, and documents",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_knowledge_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Lookups",
      description: "Lookup API for phone carrier, caller name, and identity",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_lookups_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Marketplace",
      description: "Marketplace listings, installations, and products",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_marketplace_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Messaging",
      description: "Programmable Messaging services, templates, and compliance",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_messaging_v3.yaml",
        },
      ],
    },
    {
      name: "Twilio Monitor",
      description: "Monitoring alerts, events, and triggers",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_monitor_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Notify",
      description: "Notify bindings, credentials, and notifications",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_notify_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Numbers",
      description: "Phone number inventory, orders, and configurations",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_numbers_v3.yaml",
        },
      ],
    },
    {
      name: "Twilio OAuth",
      description:
        "OAuth 2.0 API for authorization servers, clients, and tokens",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_oauth_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Preview",
      description: "Preview API set for Twilio beta capabilities",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_preview.yaml",
        },
      ],
    },
    {
      name: "Twilio Pricing",
      description: "Pricing API for voice, SMS, and phone numbers",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_pricing_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Proxy",
      description: "Proxy sessions, phone numbers, and short codes",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_proxy_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Routes",
      description: "Routes API for expertise routing and orchestration",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_routes_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Serverless",
      description: "Serverless assets, environments, and deployments",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_serverless_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Studio",
      description: "Studio flows, executions, and steps",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_studio_v2.yaml",
        },
      ],
    },
    {
      name: "Twilio Super SIM",
      description: "Super SIM fleets, commands, and networks",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_supersim_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Sync",
      description: "Sync services, documents, lists, and maps",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_sync_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio TaskRouter",
      description: "TaskRouter workers, tasks, and workflows",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_taskrouter_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Trunking",
      description:
        "Elastic SIP Trunking trunks, phone numbers, and credentials",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_trunking_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio TrustHub",
      description: "TrustHub customer profiles and compliance items",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_trusthub_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Verify",
      description: "Verify services, factors, and challenges",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_verify_v3.yaml",
        },
      ],
    },
    {
      name: "Twilio Video",
      description: "Programmable Video rooms, participants, and recordings",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_video_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Voice",
      description: "Programmable voice calls, conferences, and recordings",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_voice_v1.yaml",
        },
      ],
    },
    {
      name: "Twilio Wireless",
      description: "Programmable Wireless SIM cards, data sessions, and usage",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/twilio/twilio-oai/main/spec/yaml/twilio_wireless_v1.yaml",
        },
      ],
    },
  ],
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
    {
      name: "Ansible AWX",
      description:
        "Automation Controller (AWX) REST API for inventories, projects, jobs, and workflows",
      specs: [
        {
          version: "v2",
          url: "https://s3.amazonaws.com/awx-public-ci-files/devel/schema.json",
        },
      ],
      icon: AnsibleLogo,
    },
    {
      name: "Attio",
      description:
        "CRM platform API for objects, records, lists, tasks, and webhooks",
      specs: [
        {
          version: "2.0.0",
          url: "https://api.attio.com/openapi/api",
        },
      ],
      icon: AttioLogo,
    },
    {
      name: "BambooHR",
      description:
        "HRIS platform for employee records, time off, and performance management",
      specs: [
        {
          version: "1.0",
          url: "https://openapi.bamboohr.io/main/latest/docs/openapi/public-openapi.yaml",
        },
      ],
      icon: BambooHRLogo,
    },
    {
      name: "GitHub",
      description:
        "GitHub REST API for repositories, issues, pull requests, and actions",
      specs: [
        {
          version: "1.1.4",
          url: "https://raw.githubusercontent.com/github/rest-api-description/refs/heads/main/descriptions/api.github.com/api.github.com.2022-11-28.yaml",
        },
      ],
      icon: GitHubLogo,
    },
    {
      name: "Jira Cloud",
      description:
        "Build apps, script interactions with Jira, or develop any other type of integration",
      specs: [
        {
          version: "3.0",
          url: "https://developer.atlassian.com/cloud/jira/platform/swagger-v3.v3.json",
        },
      ],
      icon: JiraLogo,
    },
    {
      name: "Okta Management",
      description:
        "Configure and manage authorization servers and the security policies attached to them, enabling centralized control over API access",
      specs: [
        {
          version: "2025.11.0",
          url: "https://raw.githubusercontent.com/okta/okta-management-openapi-spec/master/dist/current/management-oneOfInheritance.yaml",
        },
      ],
      icon: OktaLogo,
    },
    {
      name: "PagerDuty",
      description:
        "PagerDuty REST resources for services, incidents, and incident automation",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/PagerDuty/api-schema/main/reference/REST/openapiv3.json",
        },
      ],
      icon: PagerDutyLogo,
    },
    {
      name: "Slack Web API",
      description:
        "The Slack Web API is an interface for querying information from and enacting change in a Slack workspace.",
      specs: [
        {
          version: "1.7.0",
          url: "https://api.slack.com/specs/openapi/v2/slack_web.json",
        },
      ],
      icon: SlackLogo,
    },
    {
      name: "Stripe",
      description:
        "Secure payment processing, subscriptions, billing, and reporting APIs",
      specs: [
        {
          version: "2022-11-15",
          url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/stripe.com/2022-11-15/openapi.yaml",
        },
      ],
      icon: StripeLogo,
    },
    {
      name: "VirusTotal",
      description:
        "Analyze files, URLs, IPs, or domains and pull threat intelligence verdicts from VirusTotal",
      specs: [
        {
          version: "3.0",
          url: "https://github.com/VirusTotal/vt-py/files/13278605/vt-api-v3-openapi.json",
        },
      ],
      icon: VirusTotalLogo,
    },
    {
      name: "Aeternity Foundation",
      description: "This is the Aeternity node API.",
      specs: [
        {
          version: "6.13.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/aeternity-foundation/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Apaleo",
      description:
        "Setup and manage properties (hotels, etc.) and all the entities in them to rent out: Units such as rooms, parking lots, beds, meeting rooms, etc. U...",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/apaleo/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "API Video",
      description:
        "api.video is an API that encodes on the go to facilitate immediate playback, enhancing viewer streaming experiences across multiple devices and pla...",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/api-video/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Ashby",
      description:
        "The public API for accessing resources in your Ashby instance.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ashby/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Banksapi",
      description: "BANKS/Connect API Reference",
      specs: [
        {
          version: "2.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/banksapi/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Baremetrics",
      description:
        "Baremetrics provides real-time subscription metrics for teams built with Stripe, Shopify Partners, Braintree, Recurly, Chargebee, Google Play, and...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/baremetrics/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Baseten",
      description: "REST API for management of Baseten resources",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/baseten/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Beam",
      description:
        "Beam is the intelligent way to manage risk with laser precision in real time.",
      specs: [
        {
          version: "0.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/beam/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Beamable",
      description:
        "var Beamable = BeamContext.Default; - That one line of code is a gateway to everything you need to build custom server logic via microservices alon...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/beamable/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Beehiiv",
      description: "Swarm public API",
      specs: [
        {
          version: "2.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/beehiiv/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Billsby",
      description:
        'Billsby is a feature-rich "Saas" recurring payment platform, ranked as the leading subscription billing software by G2.',
      specs: [
        {
          version: "1.3.5",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/billsby/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Bity",
      description:
        "The present document gives the technical details enabling one to make request to and understand the responses of the Exchange API.",
      specs: [
        {
          version: "2.6.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/bity/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "BL Ink",
      description: "Introduction This is version 4 of the BL.INK API.",
      specs: [
        {
          version: "4.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/bl-ink/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Bluesnap",
      description: "At BlueSnap, we look at payments a little differently.",
      specs: [
        {
          version: "8976-Tools",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/bluesnap/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Bluetime",
      description: "Code Version 1.0.7.15",
      specs: [
        {
          version: "Prod",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/bluetime/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Breezy HR",
      description:
        "We specialize in sourcing high quality pilots to meet the needs of 135 operators.",
      specs: [
        {
          version: "3",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/breezy-hr/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Brevo",
      description:
        "Brevo provide a RESTFul API that can be used with any languages.",
      specs: [
        {
          version: "3.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/brevo/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Browse AI",
      description:
        "If you are still using the deprecated API v1 version, you can see its documentation here.",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/browse-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Browsercat",
      description:
        "Providing purr-fect headless browser access via utility endpoints and direct websocket connections.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/browsercat/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Btcpay Server",
      description:
        "Introduction The BTCPay Server Greenfield API is a REST API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/btcpay-server/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Bulksms Com",
      description:
        "Overview The JSON REST API allows you to submit and receive BulkSMS messages.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/bulksms-com/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Buttondown",
      description: "NinjaAPI",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/buttondown/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Chatkitty",
      description:
        "OpenAPI specification (OAS) for the ChatKitty Platform API. See the Interactive Docs to try ChatKitty API methods without writing code, and get the...",
      specs: [
        {
          version: "2.58.3",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/chatkitty/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Circleci",
      description:
        "This describes the resources that make up the CircleCI API v2.",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/circleci/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Clarifai",
      description:
        "Clarifai is an independent artificial intelligence company that specializes in computer vision, natural language processing, and audio recognition.",
      specs: [
        {
          version: "version not set",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/clarifai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Clever",
      description: "Serves the Clever Data API",
      specs: [
        {
          version: "3.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/clever/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Clickfunnels",
      description:
        "Introduction The ClickFunnels v2 API lets you: - import data from other apps and sources into ClickFunnels and export data that you need somewher...",
      specs: [
        {
          version: "V2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/clickfunnels/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Clickup",
      description:
        "This is the ClickUp API Reference where you can learn about specific endpoints and parameters in detail.",
      specs: [
        {
          version: "2.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/clickup/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Coalesce",
      description:
        "REST API for performing operations with the Coalesce backend.",
      specs: [
        {
          version: "6.2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/coalesce/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Connexpay",
      description:
        "REST API for retrieving reporting data. Currently Daily Accounting data only.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/connexpay/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Copper",
      description:
        "The Copper Web API allows you to access and build your own applications that interact with Copper in more complex ways than the integrations we pro...",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/copper/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Crowd 4 Cash",
      description:
        "Access to the Crowd4Cash Crowdlending Platform through an API",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/crowd-4-cash/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Crowdsec",
      description: "CrowdSec local API",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/crowdsec/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Crusoe",
      description:
        "The API Gateway exposes all publicly available API endpoints for Crusoe Cloud products.",
      specs: [
        {
          version: "v1alpha5",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/crusoe/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Currency Alliance",
      description:
        "Introduction The Currency Alliance API facilitates various use cases for Loyalty Commerce.",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/currency-alliance/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Deel",
      description: "API specification for Deel HR user provisioning API.",
      specs: [
        {
          version: "1.25.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/deel/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Dev",
      description: "Access Forem articles, users and other resources via API.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/dev/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Diarupt AI",
      description: "Diarupt Conversation Engine API",
      specs: [
        {
          version: "0.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/diarupt-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Discourse",
      description:
        "This page contains the documentation on how to use Discourse through API calls.",
      specs: [
        {
          version: "latest",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/discourse/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Dixa",
      description:
        "Dixa enables companies to deliver customer service as it is meant to be.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/dixa/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Dots",
      description: "Scalable and Flexible Payouts Infrastructure",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/dots/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Drivewealth",
      description:
        "DriveWealth is the pioneer of fractional equities trading and embedded investing.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/drivewealth/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Ducky",
      description:
        "Ducky Data's APIs provide footprint data for a wide variety of products and circular services, as well as individuals, and consumption-based emissi...",
      specs: [
        {
          version: "3.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ducky/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Ebury",
      description:
        "Ebury API allows customers: to retrieve accounts, balances, beneficiaries, and transactions; to get buy/sell estimates and quotes, book trades and...",
      specs: [
        {
          version: "0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ebury/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Echelon",
      description:
        "Echelon solutions simplify your payment process, and offer a wide range of features & services to help your business run smoothly.",
      specs: [
        {
          version: "2.47",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/echelon/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Edge",
      description:
        "Edge Payment Technologies offers payment solutions for merchants in diverse legal industries.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/edge/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Elevenlabs",
      description: "This is the documentation for the ElevenLabs API.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/elevenlabs/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Epidemic Sound",
      description:
        "Epidemic Sound has transformed the soundtracking experience for global brands and professional creators, with an expansive catalog of world-class m...",
      specs: [
        {
          version: "0.1.17",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/epidemic-sound/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Factorial",
      description:
        "Open Api Specifications available at Guides and support available at # Authentication The public API provides two methods of authentication, ApiKey...",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/factorial/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Fastspring",
      description:
        "The FastSpring API and its supported requests, data, endpoints, and rate limits.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/fastspring/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Finley",
      description: "Finley API documentation",
      specs: [
        {
          version: "0.0.2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/finley/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Finshark",
      description: "Finshark API",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/finshark/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Flickr",
      description: "A subset of Flickr's API defined in Swagger format.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/flickr/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Foodkit",
      description:
        "Foodkit is an end-to-end white-label restaurant platform, and API - Including iOS and Android e-commerce apps, websites and kiosks, enterprise cust...",
      specs: [
        {
          version: "6.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/foodkit/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Fordefi",
      description:
        "The future of institutional web3 wallets. For builders, traders, and operators, Fordefi's comprehensive MPC wallet platform and web3 gateway enable...",
      specs: [
        {
          version: "0.2.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/fordefi/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Fountain",
      description:
        "Fountain's all-in-one high volume hiring platform empowers the world's leading enterprises to find the right people through smart, fast, and seamle...",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/fountain/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Freeagent",
      description: "One product.🤳 17 years.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/freeagent/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Giphy",
      description: "Giphy API",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/giphy/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Gitlab",
      description: "An OpenAPI definition for the GitLab REST API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/gitlab/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Gladly",
      description:
        "Introducing the Gladly API At Gladly, we believe that customer service is best when it's a conversation.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/gladly/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Global Predictions Inc",
      description: "Global Predictions external api",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/global-predictions-inc/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Golioth",
      description: "Built IoT your way without the stress.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/golioth/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Goody",
      description:
        "Goody is a new way to send personal and business gifts as easily as a text message.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/goody/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Gridbees",
      description: "This API is built on HTTP and is a RESTful API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/gridbees/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Griffin",
      description: "OpenAPI example for Griffin.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/griffin/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Hathora",
      description:
        "Welcome to the Hathora Cloud API documentation! Learn how to use the Hathora Cloud APIs to build and scale your game servers globally.",
      specs: [
        {
          version: "0.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hathora/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Height",
      description: "Unofficial Open API 3.1 specification for Height App API.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/height/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Helcim",
      description: "This API covers publicly accessible merchant actions",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/helcim/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Hibob",
      description: "Access your employees data with the Bob API",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hibob/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Hive",
      description: "We help teams move faster.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hive/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Homerun",
      description: "Introduction Welcome to the Homerun API!",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/homerun/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Httpbin",
      description:
        "A simple HTTP Request & Response Service. Run locally: $ docker run -p 80:80 kennethreitz/httpbin",
      specs: [
        {
          version: "0.9.2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/httpbin/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Hypatos",
      description: "Introduction The Hypatos API is organized around REST.",
      specs: [
        {
          version: "2.15.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hypatos/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Hyperplane",
      description: "Hyperplane API Gateway",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hyperplane/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Ilert",
      description: "OpenAPI example for Ilert.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ilert/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Inducedai",
      description: "Building the next evolution of actionable AI.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/inducedai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Inmobile",
      description:
        "Introduction This document is a technical description of our REST API used for external systems to send sms messages and to retrieve a status for...",
      specs: [
        {
          version: "version 4",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/inmobile/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Innoship",
      description: "Api service implementation (version:6.0.1.513)",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/innoship/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Intercom",
      description: "The intercom API reference.",
      specs: [
        {
          version: "2.9",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/intercom/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Interviewstream",
      description: "This is a description of the API.",
      specs: [
        {
          version: "0.3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/interviewstream/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Ironclad",
      description: "Documentation for Ironclad's REST API.",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ironclad/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Jiko",
      description: "Introduction Welcome to the Jiko API Reference!",
      specs: [
        {
          version: "1.29.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/jiko/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Jina AI",
      description:
        "This is the UniversalAPI to access all the Jina embedding models",
      specs: [
        {
          version: "0.0.89",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/jina-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Jobadder",
      description:
        "Getting Started ## Authentication JobAdder uses the OAuth 2.0 authorization code flow to issue API access tokens on behalf of users.",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/jobadder/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Jobsoid",
      description:
        "Jobsoid is an Online Applicant Tracking System (ATS) which simplifies every step of the recruitment process in organizations, streamlining everythi...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/jobsoid/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Keatext AI",
      description:
        "Keatext brings the voice of customer and employee into your day-to-day activities. Easily understand what drives engagement and get tailored AI-bas...",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/keatext-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Keka HR",
      description:
        "Here's our story, It all began with the frustration of using software that sucks.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/keka-hr/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Kenjo",
      description:
        "Before starting to use the Kenjo API, you have to request the API activation for a sandbox or production environment to the Kenjo Customer Success...",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/kenjo/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Lambda",
      description: "API for interacting with the Lambda GPU Cloud",
      specs: [
        {
          version: "1.5.3",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/lambda/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Langfuse",
      description: "OpenAPI example for Langfuse.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/langfuse/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Layer 2 Financial",
      description: "Welcome to the Layer2 Financial Developer Guide!",
      specs: [
        {
          version: "1.0.5",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/layer-2-financial/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Leaflink",
      description: "OpenAPI example for Leaflink.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/leaflink/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Lob",
      description:
        "The Lob API is organized around REST. Our API is designed to have predictable, resource-oriented URLs and uses HTTP response codes to indicate any...",
      specs: [
        {
          version: "1.19.28",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/lob/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Localizely",
      description: "Getting startedLocalizely API is built on REST<...",
      specs: [
        {
          version: "1.2.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/localizely/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Logisticsos",
      description:
        "Powered by world's most powerful route optimization engine. Find out more at",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/logisticsos/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Malga",
      description:
        "Authentication Os serviços de API da Malga são protegidos através de chaves de acesso.",
      specs: [
        {
          version: "0.5",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/malga/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Marketdata",
      description:
        "Somos un centro de información que analiza el mercado bursátil, financiero y econonómico.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/marketdata/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Mastercard",
      description:
        "OpenAPI specification for Finicity APIs. Open Banking solutions in the US are provided by Finicity, a Mastercard company.",
      specs: [
        {
          version: "1.16.2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/mastercard/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Measureone",
      description:
        "Automate your business workflows and lower your costs with MeasureOne, the most comprehensive and accurate platform for income, employment, educati...",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/measureone/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Megaapi",
      description: "This is a sample documentation for a new API.",
      specs: [
        {
          version: "6.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/megaapi/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Meilisearch",
      description:
        "Search documents, configure and manage the Meilisearch engine.",
      specs: [
        {
          version: "1.7.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/meilisearch/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Melodie Music",
      description: "Track API",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/melodie-music/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Miso",
      description:
        "Overview Miso’s approach to personalization is to train machine learning Engines on three core data sets: 1.",
      specs: [
        {
          version: "1.1.4",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/miso/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Modrinth",
      description:
        "This documentation doesn\\'t provide a way to test our API.",
      specs: [
        {
          version: "v2.7.0/15cf3fc",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/modrinth/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Monto",
      description:
        'About this API The API is built as a \\\\\\\\"RESTFUL\\\\\\\\" API with JSON as data transfer.',
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/monto/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Multiwoven",
      description:
        "Open-source Reverse ETL that makes data segmentation, sync and activation both easy and fully secure.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/multiwoven/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Namely",
      description: "OpenAPI example for Namely.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/namely/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Nanonets",
      description: "Welcome to the NanoNets API!",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/nanonets/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Netvyne",
      description: "Moderation API Service",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/netvyne/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Nfe IO",
      description:
        "Introducão Seja bem-vindo a documentação da API de consulta de Notas Fiscais!",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/nfe-io/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Nocodb",
      description: "OpenAPI example for Nocodb.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/nocodb/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Notabene",
      description: "The Notabene API is organized around REST.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/notabene/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Notion",
      description:
        "Notion is a new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/notion/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Nuapay",
      description:
        "Swagger Spec for the Nuapay TPP OpenBanking/PSD2. Provides PISP and Banks Endpoints",
      specs: [
        {
          version: "1.16.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/nuapay/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Officient",
      description:
        "Officient offers an intuitive HRIS which helps manage all personnel administration through our HR platform & personalized employee self-services.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/officient/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Okta",
      description: "Allows customers to easily access the Okta API",
      specs: [
        {
          version: "2.16.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/okta/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Onedoc",
      description:
        "Onedoc is an innovative API solution for developers, offering a simple and secure way to create and manage PDF documents using familiar technologie...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/onedoc/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Onelogin",
      description: "This is an administrative API for OneLogin customers",
      specs: [
        {
          version: "1.0.0-oas3",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/onelogin/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Onna",
      description:
        'Introduction ![Onna]( "Diagram showing how Onna connects to various appli...',
      specs: [
        {
          version: "v1.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/onna/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Oxford Dictionaries",
      description:
        "Oxford Dictionaries, part of the Oxford Language Division, is a leading authority on the English language.",
      specs: [
        {
          version: "1.11.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/oxford-dictionaries/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Oyster",
      description:
        "Oyster uses OAuth2 to enable customers to grant access to their data to third party applications. Customers also need to use this API to authentica...",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/oyster/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Pappers",
      description:
        "L'API de Pappers vous permet de récupérer des informations et documents sur les entreprises françaises à partir de leur numéro SIREN ou SIRET.",
      specs: [
        {
          version: "2.13.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/pappers/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Partna",
      description: "Coinprofile business API",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/partna/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Pay Com",
      description: "Pay.com API",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/pay-com/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Paychex",
      description:
        "Developer Resources Refer Developer Resources for more details on API specification",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/paychex/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Paycor",
      description: "OpenAPI example for Paycor.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/paycor/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Payfactory",
      description:
        "Payfactory specializes in embedded payment facilitation (payfac) services for ISVs and SaaS companies.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/payfactory/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Payfit",
      description:
        "A Semi-Private API to let third parties communicate with PayFit",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/payfit/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Peach Payments",
      description: "Documentation for the Reconciliation API endpoints",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/peach-payments/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Peoplehr",
      description: "Introduction We think it's good to share.",
      specs: [
        {
          version: "3.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/peoplehr/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Pinpoint",
      description: "Applicant tracking software that’s ready for anything.",
      specs: [
        {
          version: "1.0.23",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/pinpoint/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Podium",
      description:
        "A few years back, Eric (Co-Founder and CEO) got a frustrated call from his dad.",
      specs: [
        {
          version: "2021.04.01",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/podium/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Posthog",
      description: "OpenAPI example for Posthog.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/posthog/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Postmark",
      description:
        "Postmark makes sending and receiving email incredibly easy.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/postmark/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Procurify",
      description: "OpenAPI example for Procurify.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/procurify/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Proliant",
      description:
        "Our customer - facing API allows clients to view and manage company and employee data with features that integrate customers' systems with ours. Th...",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/proliant/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Prolific",
      description: "Prolific API for researchers",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/prolific/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Proovid",
      description:
        "Proovid API is a RESTful application that specializes in electronic verification (Proof of address and Proof of Identity) by employing an advanced...",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/proovid/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Pulze AI",
      description:
        "At Pulze it's our mission to supercharge today's workforce with AI to maximize the world's prosperity.",
      specs: [
        {
          version: "0.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/pulze-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Quivr",
      description: "Open-source RAG Framework",
      specs: [
        {
          version: "0.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/quivr/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Radix",
      description:
        "API Support: support@radix.ai Website: Job and profile matching using Artificial Intelligence.",
      specs: [
        {
          version: "2024-04-02",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/radix/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Rated",
      description: "Welcome to Rated API Swagger doc for developers!",
      specs: [
        {
          version: "0.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/rated/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Recruiterflow",
      description:
        "All requests to any Recruiterflow API must include the RF-Api-Key header.",
      specs: [
        {
          version: "0.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/recruiterflow/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Redkik",
      description:
        "Redkik is a global InsurTech company with the mission to transform and improve the insurance industry for all parties within logistics and transpor...",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/redkik/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Relynk",
      description:
        "Relynk empowers PropTech companies by providing seamless access to a commercial building's real-time data.",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/relynk/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Relysia",
      description: "Relysia makes blockchain adoption frictionless and easy.",
      specs: [
        {
          version: "2.4.8",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/relysia/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Remote",
      description: "Talent is everywhere.",
      specs: [
        {
          version: "0.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/remote/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Resend",
      description: "Resend is the email platform for developers.",
      specs: [
        {
          version: "1.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/resend/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Resistant AI",
      description:
        "Resistant Documents provides this API to programmatically interact with its document analysis engine.",
      specs: [
        {
          version: "2.0.0b",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/resistant-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Retell AI",
      description: "API for voice AI.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/retell-ai/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Revenium",
      description: "Revenium Metering API",
      specs: [
        {
          version: "1.14.0-SNAPSHOT",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/revenium/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Rivery",
      description:
        "Rivery API documentation Welcome to the Rivery API Documentation.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/rivery/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Rook",
      description:
        "Intro ROOK is a set of services that simplifies the collection, processing, and delivering of Users' HealthData from various data sources. ### Test...",
      specs: [
        {
          version: "2.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/rook/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Rotten Tomatoes",
      description: "Test our API services using I/O Docs.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/rotten-tomatoes/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Sage",
      description:
        "All requests are required to be sent to your subdomain. To learn how to enable API in your Sage HR account, please visit",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/sage/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Secoda",
      description:
        "Use this API to programmatically use Secoda's data enablement features.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/secoda/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Seel",
      description: "Seel API",
      specs: [
        {
          version: "1.3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/seel/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Seomonitor",
      description: "We have now released the new API 3.0!",
      specs: [
        {
          version: "1.2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/seomonitor/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Sesame HR",
      description: "Sesame Public API",
      specs: [
        {
          version: "3.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/sesame-hr/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Seyna",
      description: "documentation seyna - OpenAPI 3.0",
      specs: [
        {
          version: "2024-02",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/seyna/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Shipengine",
      description:
        "ShipEngine's easy-to-use REST API lets you manage all of your shipping needs without worrying about the complexities of different carrier APIs and...",
      specs: [
        {
          version: "1.1.202403211903",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/shipengine/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Shippo",
      description: "Use this API to integrate with the Shippo service",
      specs: [
        {
          version: "2018-02-08",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/shippo/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Shortcut",
      description: "Shortcut API",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/shortcut/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Shutterstock",
      description:
        "The Shutterstock API provides access to Shutterstock's library of media, as well as information about customers' accounts and the contributors that...",
      specs: [
        {
          version: "1.1.32",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/shutterstock/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Signwell",
      description:
        "When I started SignWell in 2019, I saw there was a need for an alternative to the hard-to-use and expensive e-signature software already out there.",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/signwell/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Smartrecruiters",
      description: "SmartOnboard Public API",
      specs: [
        {
          version: "201911.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/smartrecruiters/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Softledger",
      description:
        "SoftLedger provides real-time visibility to critical financial data.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/softledger/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Soundcloud",
      description:
        "Discover and play over 320 million music tracks. Join the world’s largest online community of artists, bands, DJs, and audio creators.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/soundcloud/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Space Invoices",
      description: "space-invoices-api",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/space-invoices/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Spotdraft",
      description:
        "SpotDraft Public API ## API Reference The SpotDraft API is organized around REST.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/spotdraft/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Spotify",
      description:
        "You can use Spotify\\'s Web API to discover music and podcasts, manage your Spotify library, control audio playback, and much more.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/spotify/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Sqala",
      description:
        "At Sqala, we believe that everyone deserves access to financial services, and we are committed to providing secure and reliable payment solutions t...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/sqala/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Stark Bank",
      description: "Stark Bank API for financial services in Brazil",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/stark-bank/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Sumsub",
      description:
        "Sumsub is the one verification platform to secure the whole user journey.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/sumsub/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Suprsend",
      description:
        "SuprSend is a central communication stack for easily creating, managing and delivering notifications to your end users on multiple channels. Our si...",
      specs: [
        {
          version: "1.2.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/suprsend/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Surfly",
      description:
        "By using the REST API, you can integrate our Co-browsing technology into your own application or build a thin layer around our technology.",
      specs: [
        {
          version: "2.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/surfly/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Sync Labs",
      description:
        "Synchronize API allows you to lipsync a video to any audio in any language.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/sync-labs/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Tavus",
      description:
        "We're an AI video research company making personalized video possible at scale.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/tavus/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Terminal",
      description:
        "Terminal is a unified API that makes it easy to integrate with the leading telematics service providers. Contact Support: Name: Terminal Email: con...",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/terminal/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Text Request",
      description:
        "This page contains documentation for Text Request\\'s v3 API.",
      specs: [
        {
          version: "3.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/text-request/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Theirstack",
      description: "Introduction Welcome to TheirStack’s API!",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/theirstack/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Tilled",
      description: "The Tilled API is organized around REST.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/tilled/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Token",
      description:
        "Token.io\\\\\\'s Open Banking APIToken.io Support: support.token.ioThe...",
      specs: [
        {
          version: "v1.2.3.8",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/token/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Tramitapp",
      description:
        "Introducción Aquí se describen los recursos que conforman el API de TramitApp.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/tramitapp/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Trello",
      description:
        "This document describes the REST API of Trello as published by Trello.com. - Official Documentation - The HTML pages that were scraped in order to...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/trello/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Tremendous",
      description:
        "Deliver monetary rewards and incentives to employees, customers, survey participants, and more through the Tremendous API. For organizational tasks...",
      specs: [
        {
          version: "2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/tremendous/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Tribepad",
      description:
        "Tribepad developer docs Before you get started you'll need to contact our Support Team and request access to our APIs.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/tribepad/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Tripadd",
      description:
        "TripAdd API enables you to create personalized travel ancillary product bundles and make orders.",
      specs: [
        {
          version: "1.8.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/tripadd/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Unit",
      description: "An OpenAPI specifications for unit-sdk clients",
      specs: [
        {
          version: "0.0.2",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/unit/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Unstructured",
      description:
        "At Unstructured, we're on a mission to give organizations access to all of their data.",
      specs: [
        {
          version: "0.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/unstructured/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Uploadcare",
      description:
        "Summary Upload API provides several ways of uploading files to Uploadcare servers in a secure and reliable way.",
      specs: [
        {
          version: "2024-02-12",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/uploadcare/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Uploadthing",
      description:
        'UploadThing is the easiest way to add file uploads to your full stack TypeScript application. Many services have tried to build a "better S3", but...',
      specs: [
        {
          version: "6.4.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/uploadthing/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Vantage",
      description: "Vantage API",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/vantage/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Vegapay",
      description:
        "Vegapay is creating the credit card stack for regulated entities across globe",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/vegapay/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Verifiable",
      description:
        "Introduction This document contains the official documentation for the latest version of the Verifiable API.",
      specs: [
        {
          version: "24.14.3.683",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/verifiable/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Volt IO",
      description: "Join the real-time revolution!",
      specs: [
        {
          version: "2024.04.11",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/volt-io/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Wannme",
      description: "Welcome to WANNME Integration API",
      specs: [
        {
          version: "2.7.8",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/wannme/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Weavy",
      description:
        "Weavy is a complete toolkit for developers to add collaboration, productivity, and community features to web and mobile apps at a fraction of the c...",
      specs: [
        {
          version: "22.1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/weavy/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Wefitter",
      description: "This is the WeFitter API",
      specs: [
        {
          version: "v1.3",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/wefitter/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Wikimedia",
      description:
        "This API provides cacheable and straightforward access to Wikimedia content and data, in machine-readable formats.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/wikimedia/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Wink",
      description: "APIs Not every integrator needs every APIs.",
      specs: [
        {
          version: "29.54.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/wink/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Workable",
      description:
        "Workable develops a cloud-based recruitment platform for companies to post jobs, track applicants and schedule interviews.",
      specs: [
        {
          version: "3.8",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/workable/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "X",
      description: "Twitter API v2 available endpoints",
      specs: [
        {
          version: "2.62",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/x/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Xkcd",
      description: "Webcomic of romance, sarcasm, math, and language.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/xkcd/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Xyte",
      description:
        "Xyte's Device Cloud is the first all-in-one servitization platform designed for device and hardware manufacturers to cloudify, operate, support, an...",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/xyte/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "You Need A Budget",
      description:
        "Our API uses a REST based design, leverages the JSON data format, and relies upon HTTPS for transport.",
      specs: [
        {
          version: "1.68.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/you-need-a-budget/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
  ],
  templateGroups: [twilioRestTemplateGroup],
}

export class RestTemplatesStore extends BudiStore<RestTemplatesState> {
  constructor() {
    super(INITIAL_REST_TEMPLATES_STATE)
  }

  get templates(): RestTemplate[] {
    let templates: RestTemplate[] = []
    this.subscribe(state => {
      templates = state.templates
    })()
    return templates
  }

  get templateGroups(): RestTemplateGroup<RestTemplateGroupName>[] {
    let templateGroups: RestTemplateGroup<RestTemplateGroupName>[] = []
    this.subscribe(state => {
      templateGroups = state.templateGroups
    })()
    return templateGroups
  }

  getByName(name?: RestTemplateName) {
    if (!name) {
      return undefined
    }
    const template = this.templates.find(template => template.name === name)
    if (template) {
      return template
    }
    for (const group of this.templateGroups) {
      const groupTemplate = group.templates.find(
        template => template.name === name
      )
      if (groupTemplate) {
        return {
          ...groupTemplate,
          icon: group.icon,
        }
      }
    }
    return undefined
  }
}

export const restTemplates = new RestTemplatesStore()
