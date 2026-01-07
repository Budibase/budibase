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
      name: "API Video",
      description:
        "Encodes on the go to facilitate immediate playback, enhancing viewer streaming experiences across multiple devices",
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
        "Gateway to everything you need to build custom server logic via microservices",
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
        "Import data from other apps and sources into ClickFunnels and export data that you need somewhere",
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
        "Use the Hathora Cloud APIs to build and scale your game servers globally.",
      specs: [
        {
          version: "0.0.1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hathora/openapi.yaml",
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
      description: "Homerun API",
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
      description: "A simple HTTP Request & Response Service.",
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
      description: "The Hypatos API is organized around REST.",
      specs: [
        {
          version: "2.15.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/hypatos/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Inmobile",
      description:
        "Used for external systems to send sms messages and to retrieve a status for...",
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
      description: "The intercom API.",
      specs: [
        {
          version: "2.9",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/intercom/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Ironclad",
      description: "Ironclad's REST API.",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ironclad/openapi.yaml",
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
      description: "Getting startedLocalizely API is built on REST",
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
        "Powered by world's most powerful route optimization engine.",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/logisticsos/openapi.yaml",
        },
      ],
      icon: DummyLogo,
    },
    {
      name: "Mastercard",
      description:
        "Open Banking solutions in the US are provided by Finicity, a Mastercard company.",
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
      name: "Miso",
      description:
        "Overview Miso's approach to personalization is to train machine learning Engines on three core data sets: 1.",
      specs: [
        {
          version: "1.1.4",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/miso/openapi.yaml",
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
        "The Nuapay TPP OpenBanking/PSD2. Provides PISP and Banks Endpoints",
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
      name: "Peach Payments",
      description: "Reconciliation API",
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
      description: "We think it's good to share.",
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
      description: "Applicant tracking software that's ready for anything.",
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
      description: "AI that converts leads and makes you money.",
      specs: [
        {
          version: "2021.04.01",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/podium/openapi.yaml",
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
      description: "Job and profile matching using Artificial Intelligence.",
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
      description: "Welcome to Rated API for developers!",
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
      name: "Verifiable",
      description: "Verifiable API.",
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
