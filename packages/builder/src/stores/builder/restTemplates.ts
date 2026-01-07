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
import ServiceNowLogo from "assets/rest-template-icons/servicenow.svg"
import SlackLogo from "assets/rest-template-icons/slack.svg"
import StripeLogo from "assets/rest-template-icons/stripe.svg"
import TwilioLogo from "assets/rest-template-icons/twilio.svg"
import VirusTotalLogo from "assets/rest-template-icons/virustotal.svg"
import AshbyLogo from "assets/rest-template-icons/ashby.svg"
import BanksapiLogo from "assets/rest-template-icons/banksapi.svg"
import BaremetricsLogo from "assets/rest-template-icons/baremetrics.svg"
import BillsbyLogo from "assets/rest-template-icons/billsby.svg"
import BreezyHRLogo from "assets/rest-template-icons/breezy-hr.svg"
import BrevoLogo from "assets/rest-template-icons/brevo.svg"
import BulksmsComLogo from "assets/rest-template-icons/bulksms-com.svg"
import ButtondownLogo from "assets/rest-template-icons/buttondown.svg"
import CleverLogo from "assets/rest-template-icons/clever.svg"
import ClickupLogo from "assets/rest-template-icons/clickup.svg"
import DeelLogo from "assets/rest-template-icons/deel.svg"
import DixaLogo from "assets/rest-template-icons/dixa.svg"
import DotsLogo from "assets/rest-template-icons/dots.svg"
import FactorialLogo from "assets/rest-template-icons/factorial.svg"
import FastspringLogo from "assets/rest-template-icons/fastspring.svg"
import FountainLogo from "assets/rest-template-icons/fountain.svg"
import GitlabLogo from "assets/rest-template-icons/gitlab.svg"
import GoodyLogo from "assets/rest-template-icons/goody.svg"
import HelcimLogo from "assets/rest-template-icons/helcim.svg"
import HibobLogo from "assets/rest-template-icons/hibob.svg"
import HomerunLogo from "assets/rest-template-icons/homerun.svg"
import HypatosLogo from "assets/rest-template-icons/hypatos.svg"
import IntercomLogo from "assets/rest-template-icons/intercom.svg"
import IroncladLogo from "assets/rest-template-icons/ironclad.svg"
import JinaAILogo from "assets/rest-template-icons/jina-ai.svg"
import JobsoidLogo from "assets/rest-template-icons/jobsoid.svg"
import KeatextAILogo from "assets/rest-template-icons/keatext-ai.svg"
import KenjoLogo from "assets/rest-template-icons/kenjo.svg"
import LambdaLogo from "assets/rest-template-icons/lambda.svg"
import LobLogo from "assets/rest-template-icons/lob.svg"
import LocalizelyLogo from "assets/rest-template-icons/localizely.svg"
import LogisticsosLogo from "assets/rest-template-icons/logisticsos.svg"
import MastercardLogo from "assets/rest-template-icons/mastercard.svg"
import MeasureoneLogo from "assets/rest-template-icons/measureone.svg"
import NanonetsLogo from "assets/rest-template-icons/nanonets.svg"
import NotionLogo from "assets/rest-template-icons/notion.svg"
import OysterLogo from "assets/rest-template-icons/oyster.svg"
import PeachPaymentsLogo from "assets/rest-template-icons/peach-payments.svg"
import PinpointLogo from "assets/rest-template-icons/pinpoint.svg"
import PodiumLogo from "assets/rest-template-icons/podium.svg"
import RemoteLogo from "assets/rest-template-icons/remote.svg"
import ResendLogo from "assets/rest-template-icons/resend.svg"
import RiveryLogo from "assets/rest-template-icons/rivery.svg"
import SageLogo from "assets/rest-template-icons/sage.svg"
import SecodaLogo from "assets/rest-template-icons/secoda.svg"
import ShipengineLogo from "assets/rest-template-icons/shipengine.svg"
import ShippoLogo from "assets/rest-template-icons/shippo.svg"
import ShortcutLogo from "assets/rest-template-icons/shortcut.svg"
import SmartrecruitersLogo from "assets/rest-template-icons/smartrecruiters.svg"
import SoftledgerLogo from "assets/rest-template-icons/softledger.svg"
import SpotdraftLogo from "assets/rest-template-icons/spotdraft.svg"
import SumsubLogo from "assets/rest-template-icons/sumsub.svg"
import SuprsendLogo from "assets/rest-template-icons/suprsend.svg"
import TerminalLogo from "assets/rest-template-icons/terminal.svg"
import TheirstackLogo from "assets/rest-template-icons/theirstack.svg"
import TilledLogo from "assets/rest-template-icons/tilled.svg"
import TrelloLogo from "assets/rest-template-icons/trello.svg"
import TremendousLogo from "assets/rest-template-icons/tremendous.svg"
import VerifiableLogo from "assets/rest-template-icons/verifiable.svg"
import VoltIOLogo from "assets/rest-template-icons/volt-io.svg"
import WorkableLogo from "assets/rest-template-icons/workable.svg"
import XLogo from "assets/rest-template-icons/x.svg"
import serviceNowSpecData from "assets/rest-template-specs/servicenow.yaml?raw"

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
      name: "ServiceNow",
      description:
        "Provisioning operations for users, groups, and supporting resources such as companies, cost centers, departments, and locations.",
      specs: [
        {
          version: "1.0.0",
          data: serviceNowSpecData,
        },
      ],
      icon: ServiceNowLogo,
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
      name: "Ashby",
      description:
        "The public API for accessing resources in your Ashby instance.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/ashby/openapi.yaml",
        },
      ],
      icon: AshbyLogo,
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
      icon: BanksapiLogo,
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
      icon: BaremetricsLogo,
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
      icon: BillsbyLogo,
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
      icon: BreezyHRLogo,
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
      icon: BrevoLogo,
    },
    {
      name: "BulkSMS",
      description: "Allows you to submit and receive BulkSMS messages.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/bulksms-com/openapi.yaml",
        },
      ],
      icon: BulksmsComLogo,
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
      icon: ButtondownLogo,
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
      icon: CleverLogo,
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
      icon: ClickupLogo,
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
      icon: DeelLogo,
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
      icon: DixaLogo,
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
      icon: DotsLogo,
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
      icon: FactorialLogo,
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
      icon: FastspringLogo,
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
      icon: FountainLogo,
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
      icon: GitlabLogo,
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
      icon: GoodyLogo,
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
      icon: HelcimLogo,
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
      icon: HibobLogo,
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
      icon: HomerunLogo,
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
      icon: HypatosLogo,
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
      icon: IntercomLogo,
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
      icon: IroncladLogo,
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
      icon: JinaAILogo,
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
      icon: JobsoidLogo,
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
      icon: KeatextAILogo,
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
      icon: KenjoLogo,
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
      icon: LambdaLogo,
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
      icon: LobLogo,
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
      icon: LocalizelyLogo,
    },
    {
      name: "LogisticsOS",
      description:
        "Powered by world's most powerful route optimization engine.",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/logisticsos/openapi.yaml",
        },
      ],
      icon: LogisticsosLogo,
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
      icon: MastercardLogo,
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
      icon: MeasureoneLogo,
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
      icon: NanonetsLogo,
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
      icon: NotionLogo,
    },
    {
      name: "Oyster HR",
      description:
        "Oyster HR uses OAuth2 to enable customers to grant access to their data to third party applications.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/oyster/openapi.yaml",
        },
      ],
      icon: OysterLogo,
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
      icon: PeachPaymentsLogo,
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
      icon: PinpointLogo,
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
      icon: PodiumLogo,
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
      icon: RemoteLogo,
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
      icon: ResendLogo,
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
      icon: RiveryLogo,
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
      icon: SageLogo,
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
      icon: SecodaLogo,
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
      icon: ShipengineLogo,
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
      icon: ShippoLogo,
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
      icon: ShortcutLogo,
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
      icon: SmartrecruitersLogo,
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
      icon: SoftledgerLogo,
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
      icon: SpotdraftLogo,
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
      icon: SumsubLogo,
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
      icon: SuprsendLogo,
    },
    {
      name: "Terminal",
      description:
        "Terminal is a unified API that makes it easy to integrate with the leading telematics service providers.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/terminal/openapi.yaml",
        },
      ],
      icon: TerminalLogo,
    },
    {
      name: "Theirstack",
      description: "Find your next customer",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/theirstack/openapi.yaml",
        },
      ],
      icon: TheirstackLogo,
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
      icon: TilledLogo,
    },
    {
      name: "Trello",
      description: "Capture, organize, and tackle your to-dos from anywhere.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/konfig-sdks/openapi-examples/main/trello/openapi.yaml",
        },
      ],
      icon: TrelloLogo,
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
      icon: TremendousLogo,
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
      icon: VerifiableLogo,
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
      icon: VoltIOLogo,
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
      icon: WorkableLogo,
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
      icon: XLogo,
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
