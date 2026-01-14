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
import ConfluenceLogo from "assets/rest-template-icons/confluence.svg"
import DiscordLogo from "assets/rest-template-icons/discord.svg"
import FigmaLogo from "assets/rest-template-icons/figma.svg"
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
import HubSpotLogo from "assets/rest-template-icons/hubspot.svg"
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
import MicrosoftTeamsLogo from "assets/rest-template-icons/microsoft-teams.svg"
import NanonetsLogo from "assets/rest-template-icons/nanonets.svg"
import NotionLogo from "assets/rest-template-icons/notion.svg"
import OysterLogo from "assets/rest-template-icons/oyster.svg"
import PeachPaymentsLogo from "assets/rest-template-icons/peach-payments.svg"
import PinpointLogo from "assets/rest-template-icons/pinpoint.svg"
import PodiumLogo from "assets/rest-template-icons/podium.svg"
import RemoteLogo from "assets/rest-template-icons/remote.svg"
import ResendLogo from "assets/rest-template-icons/resend.svg"
import RiveryLogo from "assets/rest-template-icons/rivery.svg"
import RocketChatLogo from "assets/rest-template-icons/rocketchat.svg"
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
import ZendeskLogo from "assets/rest-template-icons/zendesk.svg"
import serviceNowSpecData from "assets/rest-template-specs/servicenow.yaml?raw"

interface RestTemplatesState {
  templates: RestTemplate[]
  templateGroups: RestTemplateGroup<RestTemplateGroupName>[]
}

const hubspotRestTemplateGroup: RestTemplateGroup<"HubSpot"> = {
  name: "HubSpot",
  icon: HubSpotLogo,
  verified: true,
  description:
    "CRM, marketing, CMS, and automation APIs for HubSpot's platform.",
  templates: [
    {
      name: "HubSpot Account Info",
      description: "Get information about a HubSpot account and its API usage.",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Account/Account%20Info/Rollouts/144923/2025-09/accountInfo.json",
        },
      ],
    },
    {
      name: "HubSpot Actions V4",
      description: "HubSpot Automation Actions V4 API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Automation/Actions%20V4/Rollouts/148901/v4/actionsV4.json",
        },
      ],
    },
    {
      name: "HubSpot App Uninstalls",
      description: "HubSpot CRM App Uninstalls API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/App%20Uninstalls/Rollouts/209039/v3/appUninstalls.json",
        },
      ],
    },
    {
      name: "HubSpot Appointments",
      description: "HubSpot Appointments API.",
      specs: [
        {
          version: "2026-03",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Appointments/Rollouts/424/2026-03/appointments.json",
        },
      ],
    },
    {
      name: "HubSpot Associations",
      description: "HubSpot Associations API.",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Associations/Rollouts/130902/2025-09/associations.json",
        },
      ],
    },
    {
      name: "HubSpot Associations Schema",
      description: "HubSpot CRM Associations Schema API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Associations%20Schema/Rollouts/130902/v4/associationsSchema.json",
        },
      ],
    },
    {
      name: "HubSpot Audit Logs",
      description: "Get information about a HubSpot account and its API usage.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Account/Audit%20Logs/Rollouts/144923/v3/auditLogs.json",
        },
      ],
    },
    {
      name: "HubSpot Authors",
      description:
        "Use these endpoints for interacting with Blog Posts, Blog Authors, and Blog Tags",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Authors/Rollouts/635/v3/authors.json",
        },
      ],
    },
    {
      name: "HubSpot Automation V4",
      description: "HubSpot Automation V4 API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Automation/Automation%20V4/Rollouts/144908/v4/automationV4.json",
        },
      ],
    },
    {
      name: "HubSpot Blog Settings",
      description: "Use these endpoints for interacting with Blog objects",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Blog%20Settings/Rollouts/635/v3/blogSettings.json",
        },
      ],
    },
    {
      name: "HubSpot Bucket_Test111",
      description: "HubSpot Bucket_Test111 API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Bucket_Test111/Rollouts/424/v3/buckettest111.json",
        },
      ],
    },
    {
      name: "HubSpot Business Units",
      description: "Retrieve Business Unit information.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Business%20Units/Business%20Units/Rollouts/140946/v3/businessUnits.json",
        },
      ],
    },
    {
      name: "HubSpot Calling Extensions",
      description: "HubSpot CRM Calling Extensions API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Calling%20Extensions/Rollouts/145891/v3/callingExtensions.json",
        },
      ],
    },
    {
      name: "HubSpot Calls",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Calls/Rollouts/424/2025-09/calls.json",
        },
      ],
    },
    {
      name: "HubSpot Campaigns Public Api",
      description: "HubSpot Marketing Campaigns Public Api API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Campaigns%20Public%20Api/Rollouts/177944/v3/campaignsPublicApi.json",
        },
      ],
    },
    {
      name: "HubSpot Carts",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Carts/Rollouts/424/2025-09/carts.json",
        },
      ],
    },
    {
      name: "HubSpot Cms Content Audit",
      description:
        "Use this endpoint to query audit logs of CMS changes that occurred on your HubSpot account.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Cms%20Content%20Audit/Rollouts/144888/v3/cmsContentAudit.json",
        },
      ],
    },
    {
      name: "HubSpot Commerce Payments",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Commerce%20Payments/Rollouts/424/2025-09/commercePayments.json",
        },
      ],
    },
    {
      name: "HubSpot Commerce Subscriptions",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Commerce%20Subscriptions/Rollouts/206901/2025-09/commerceSubscriptions.json",
        },
      ],
    },
    {
      name: "HubSpot Communications",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Communications/Rollouts/424/2025-09/communications.json",
        },
      ],
    },
    {
      name: "HubSpot Companies",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Companies/Rollouts/424/2025-09/companies.json",
        },
      ],
    },
    {
      name: "HubSpot Contacts",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2026-03",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Contacts/Rollouts/424/2026-03/contacts.json",
        },
      ],
    },
    {
      name: "HubSpot Contracts",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Contracts/Rollouts/424/2025-09/contracts.json",
        },
      ],
    },
    {
      name: "HubSpot Conversations",
      description: "HubSpot Conversations Inbox & Messages API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Conversations/Conversations/Rollouts/54902/v3/conversations.json",
        },
      ],
    },
    {
      name: "HubSpot Conversations Inbox & Messages",
      description: "HubSpot Conversations Inbox & Messages API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Conversations/Conversations%20Inbox%20&%20Messages/Rollouts/54902/v3/conversationsInboxMessages.json",
        },
      ],
    },
    {
      name: "HubSpot Courses",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Courses/Rollouts/424/2025-09/courses.json",
        },
      ],
    },
    {
      name: "HubSpot CRM Meetings",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Meetings/Rollouts/424/2025-09/meetings.json",
        },
      ],
    },
    {
      name: "HubSpot Crm Owners",
      description:
        "HubSpot uses **owners** to assign CRM objects to specific people in your organization. The endpoints described here are used to get a list of the owners that...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Crm%20Owners/Rollouts/146888/v3/crmOwners.json",
        },
      ],
    },
    {
      name: "HubSpot Custom Channels",
      description: "HubSpot Conversations Custom Channels API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Conversations/Custom%20Channels/Rollouts/160898/v3/customChannels.json",
        },
      ],
    },
    {
      name: "HubSpot Custom Objects",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2026-03",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Custom%20Objects/Rollouts/424/2026-03/customObjects.json",
        },
      ],
    },
    {
      name: "HubSpot Deal Splits",
      description: "HubSpot CRM Deal Splits API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Deal%20Splits/Rollouts/157885/v3/dealSplits.json",
        },
      ],
    },
    {
      name: "HubSpot Deals",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Deals/Rollouts/424/2025-09/deals.json",
        },
      ],
    },
    {
      name: "HubSpot Discounts",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2026-03",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Discounts/Rollouts/424/2026-03/discounts.json",
        },
      ],
    },
    {
      name: "HubSpot Domains",
      description: "HubSpot Domains API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Domains/Rollouts/149894/v3/domains.json",
        },
      ],
    },
    {
      name: "HubSpot Emails",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Emails/Rollouts/424/2025-09/emails.json",
        },
      ],
    },
    {
      name: "HubSpot Events",
      description: "HubSpot Events Events API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Events/Events/Rollouts/147897/v3/events.json",
        },
      ],
    },
    {
      name: "HubSpot Exports",
      description: "HubSpot CRM Exports API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Exports/Rollouts/95922/v3/exports.json",
        },
      ],
    },
    {
      name: "HubSpot Feedback Submissions",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Feedback%20Submissions/Rollouts/424/2025-09/feedbackSubmissions.json",
        },
      ],
    },
    {
      name: "HubSpot Fees",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Fees/Rollouts/424/2025-09/fees.json",
        },
      ],
    },
    {
      name: "HubSpot Files",
      description: "Upload and manage files.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Files/Files/Rollouts/140950/v3/files.json",
        },
      ],
    },
    {
      name: "HubSpot Forms",
      description: "HubSpot Forms API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Forms/Rollouts/144909/v3/forms.json",
        },
      ],
    },
    {
      name: "HubSpot Goal Targets",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Goal%20Targets/Rollouts/424/2025-09/goalTargets.json",
        },
      ],
    },
    {
      name: "HubSpot Hubdb",
      description: "HubSpot Hubdb API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Hubdb/Rollouts/243927/v3/hubdb.json",
        },
      ],
    },
    {
      name: "HubSpot Imports",
      description: "HubSpot CRM Imports API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Imports/Rollouts/144903/v3/imports.json",
        },
      ],
    },
    {
      name: "HubSpot Invoices",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Invoices/Rollouts/424/2025-09/invoices.json",
        },
      ],
    },
    {
      name: "HubSpot Leads",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Leads/Rollouts/424/2025-09/leads.json",
        },
      ],
    },
    {
      name: "HubSpot Limits Tracking",
      description: "HubSpot Limits Tracking API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Limits%20Tracking/Rollouts/199890/v3/limitsTracking.json",
        },
      ],
    },
    {
      name: "HubSpot Line Items",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Line%20Items/Rollouts/424/2025-09/lineItems.json",
        },
      ],
    },
    {
      name: "HubSpot Listings",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Listings/Rollouts/424/2025-09/listings.json",
        },
      ],
    },
    {
      name: "HubSpot Lists",
      description: "CRUD operations to manage lists and list memberships",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Lists/Rollouts/144891/v3/lists.json",
        },
      ],
    },
    {
      name: "HubSpot Manage Event Definitions",
      description: "HubSpot Events Manage Event Definitions API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Events/Manage%20Event%20Definitions/Rollouts/138888/v3/manageEventDefinitions.json",
        },
      ],
    },
    {
      name: "HubSpot Marketing Emails",
      description: "HubSpot Marketing Emails API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Marketing%20Emails/Rollouts/145892/v3/marketingEmails.json",
        },
      ],
    },
    {
      name: "HubSpot Marketing Emails V3",
      description: "HubSpot Marketing Emails V3 API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Marketing%20Emails%20V3/Rollouts/155892/v3/marketingEmailsV3.json",
        },
      ],
    },
    {
      name: "HubSpot Marketing Events",
      description: "HubSpot Marketing Marketing Events API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Marketing%20Events/Rollouts/129888/v3/marketingEvents.json",
        },
      ],
    },
    {
      name: "HubSpot Media Bridge",
      description: "HubSpot CMS Media Bridge API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Media%20Bridge/Rollouts/787/v1/mediaBridge.json",
        },
      ],
    },
    {
      name: "HubSpot Multicurrency",
      description: "HubSpot Settings Multicurrency API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Settings/Multicurrency/Rollouts/145897/v3/multicurrency.json",
        },
      ],
    },
    {
      name: "HubSpot Notes",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Notes/Rollouts/424/2025-09/notes.json",
        },
      ],
    },
    {
      name: "HubSpot Oauth",
      description: "HubSpot Auth Oauth API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Auth/Oauth/Rollouts/155908/v1/oauth.json",
        },
      ],
    },
    {
      name: "HubSpot Object Library",
      description: "HubSpot CRM Object Library API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Object%20Library/Rollouts/196908/v3/objectLibrary.json",
        },
      ],
    },
    {
      name: "HubSpot Objects",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Objects/Rollouts/424/2025-09/objects.json",
        },
      ],
    },
    {
      name: "HubSpot Orders",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Orders/Rollouts/424/2025-09/orders.json",
        },
      ],
    },
    {
      name: "HubSpot Origins",
      description: "HubSpot Meta Origins API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Meta/Origins/Rollouts/277913/v1/origins.json",
        },
      ],
    },
    {
      name: "HubSpot Pages",
      description:
        "Use these endpoints for interacting with Landing Pages and Site Pages",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Pages/Rollouts/59888/v3/pages.json",
        },
      ],
    },
    {
      name: "HubSpot Partner Clients",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Partner%20Clients/Rollouts/424/2025-09/partnerClients.json",
        },
      ],
    },
    {
      name: "HubSpot Partner Services",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Partner%20Services/Rollouts/424/2025-09/partnerServices.json",
        },
      ],
    },
    {
      name: "HubSpot Payments",
      description: "HubSpot Payments API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Payments/Rollouts/424/v3/payments.json",
        },
      ],
    },
    {
      name: "HubSpot Pipelines",
      description:
        "Pipelines represent distinct stages in a workflow, like closing a deal or servicing a support ticket. These endpoints provide access to read and modify pipel...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Pipelines/Rollouts/145896/v3/pipelines.json",
        },
      ],
    },
    {
      name: "HubSpot Postal Mail",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Postal%20Mail/Rollouts/424/2025-09/postalMail.json",
        },
      ],
    },
    {
      name: "HubSpot Posts",
      description:
        "Use these endpoints for interacting with Blog Posts, Blog Authors, and Blog Tags",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Posts/Rollouts/635/v3/posts.json",
        },
      ],
    },
    {
      name: "HubSpot Products",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Products/Rollouts/424/2025-09/products.json",
        },
      ],
    },
    {
      name: "HubSpot Projects",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Projects/Rollouts/260890/v3/projects.json",
        },
      ],
    },
    {
      name: "HubSpot Properties",
      description:
        "All HubSpot objects store data in default and custom properties. These endpoints provide access to read and modify object properties in HubSpot.",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Properties/Rollouts/145899/2025-09/properties.json",
        },
      ],
    },
    {
      name: "HubSpot Property Validations",
      description: "HubSpot CRM Property Validations API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Property%20Validations/Rollouts/215885/v3/propertyValidations.json",
        },
      ],
    },
    {
      name: "HubSpot Public App Crm Cards",
      description:
        "Allows an app to extend the CRM UI by surfacing custom cards in the sidebar of record pages. These cards are defined up-front as part of app configuration, t...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Public%20App%20Crm%20Cards/Rollouts/147892/v3/publicAppCrmCards.json",
        },
      ],
    },
    {
      name: "HubSpot Public App Feature Flags V3",
      description: "HubSpot CRM Public App Feature Flags V3 API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Public%20App%20Feature%20Flags%20V3/Rollouts/195919/v3/publicAppFeatureFlagsV3.json",
        },
      ],
    },
    {
      name: "HubSpot Quotes",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Quotes/Rollouts/424/2025-09/quotes.json",
        },
      ],
    },
    {
      name: "HubSpot Scheduler Meetings",
      description: "Meetings Service For HubSpot Sales",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Scheduler/Meetings/Rollouts/177892/v3/meetings.json",
        },
      ],
    },
    {
      name: "HubSpot Schemas",
      description:
        "The CRM uses schemas to define how custom objects should store and represent information in the HubSpot CRM. Schemas define details about an object's type, p...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Schemas/Rollouts/145900/v3/schemas.json",
        },
      ],
    },
    {
      name: "HubSpot Send Event Completions",
      description: "HubSpot Events Send Event Completions API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Events/Send%20Event%20Completions/Rollouts/669/v3/sendEventCompletions.json",
        },
      ],
    },
    {
      name: "HubSpot Sequences",
      description: "HubSpot Sequences API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Automation/Sequences/Rollouts/177891/v4/sequences.json",
        },
      ],
    },
    {
      name: "HubSpot Services",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Services/Rollouts/424/2025-09/services.json",
        },
      ],
    },
    {
      name: "HubSpot Single-send",
      description: "HubSpot Single-send API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Single-send/Rollouts/106894/v4/singlesend.json",
        },
      ],
    },
    {
      name: "HubSpot Site Search",
      description:
        "Use these endpoints for searching content on your HubSpot hosted CMS website(s).",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Site%20Search/Rollouts/144890/v3/siteSearch.json",
        },
      ],
    },
    {
      name: "HubSpot Source Code",
      description:
        "API for managing and retrieving source code files and metadata",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Source%20Code/Rollouts/140886/v3/sourceCode.json",
        },
      ],
    },
    {
      name: "HubSpot Subscription Lifecycle",
      description: "HubSpot CRM Subscription Lifecycle API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Subscription%20Lifecycle/Rollouts/206901/v1/subscriptionLifecycle.json",
        },
      ],
    },
    {
      name: "HubSpot Subscriptions",
      description: "HubSpot Communication Preferences Subscriptions API.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Communication%20Preferences/Subscriptions/Rollouts/176901/v4/subscriptions.json",
        },
      ],
    },
    {
      name: "HubSpot Tags",
      description:
        "Use these endpoints for interacting with Blog Posts, Blog Authors, and Blog Tags",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Tags/Rollouts/635/v3/tags.json",
        },
      ],
    },
    {
      name: "HubSpot Tasks",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Tasks/Rollouts/424/2025-09/tasks.json",
        },
      ],
    },
    {
      name: "HubSpot Tax Rates",
      description: "HubSpot Settings Tax Rates API.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Settings/Tax%20Rates/Rollouts/207908/v1/taxRates.json",
        },
      ],
    },
    {
      name: "HubSpot Taxes",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Taxes/Rollouts/424/2025-09/taxes.json",
        },
      ],
    },
    {
      name: "HubSpot Test Child Api",
      description: "Get information about a HubSpot account and its API usage.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Account/Test%20Child%20Api/Rollouts/144923/v3/testChildApi.json",
        },
      ],
    },
    {
      name: "HubSpot Tickets",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Tickets/Rollouts/424/2025-09/tickets.json",
        },
      ],
    },
    {
      name: "HubSpot Timeline",
      description:
        "This feature allows an app to create and configure custom events that can show up in the timelines of certain CRM objects like contacts, companies, tickets,...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Timeline/Rollouts/147898/v3/timeline.json",
        },
      ],
    },
    {
      name: "HubSpot Transactional Single Send",
      description: "HubSpot Transactional Single Send API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Marketing/Transactional%20Single%20Send/Rollouts/140892/v3/transactionalSingleSend.json",
        },
      ],
    },
    {
      name: "HubSpot Transcriptions",
      description: "HubSpot Transcriptions API.",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Transcriptions/Rollouts/178922/v3/transcriptions.json",
        },
      ],
    },
    {
      name: "HubSpot Url Redirects",
      description: "URL redirect operations",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CMS/Url%20Redirects/Rollouts/149916/v3/urlRedirects.json",
        },
      ],
    },
    {
      name: "HubSpot User Provisioning",
      description: "Add, manage, and remove users from your account",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Settings/User%20Provisioning/Rollouts/144927/v3/userProvisioning.json",
        },
      ],
    },
    {
      name: "HubSpot Users",
      description:
        "CRM objects such as companies, contacts, deals, line items, products, tickets, and quotes are standard objects in HubSpot's CRM. These core building blocks s...",
      specs: [
        {
          version: "2025-09",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Users/Rollouts/424/2025-09/users.json",
        },
      ],
    },
    {
      name: "HubSpot Video Conferencing Extension",
      description:
        "These APIs allow you to specify URLs that can be used to interact with a video conferencing application, to allow HubSpot to add video conference links to me...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/CRM/Video%20Conferencing%20Extension/Rollouts/148903/v3/videoConferencingExtension.json",
        },
      ],
    },
    {
      name: "HubSpot Visitor Identification",
      description:
        "The Visitor Identification API allows you to pass identification information to the HubSpot chat widget for otherwise unknown visitors that were verified by...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Conversations/Visitor%20Identification/Rollouts/140938/v3/visitorIdentification.json",
        },
      ],
    },
    {
      name: "HubSpot Webhooks",
      description:
        "Provides a way for apps to subscribe to certain change events in HubSpot. Once configured, apps will receive event payloads containing details about the chan...",
      specs: [
        {
          version: "v3",
          url: "https://raw.githubusercontent.com/HubSpot/HubSpot-public-api-spec-collection/main/PublicApiSpecs/Webhooks/Webhooks/Rollouts/147891/v3/webhooks.json",
        },
      ],
    },
  ],
}

const twilioRestTemplateGroup: RestTemplateGroup<"Twilio"> = {
  name: "Twilio",
  icon: TwilioLogo,
  verified: true,
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

const zendeskRestTemplateGroup: RestTemplateGroup<"Zendesk"> = {
  name: "Zendesk",
  icon: ZendeskLogo,
  verified: true,
  description: "Customer support and messaging APIs from Zendesk.",
  templates: [
    {
      name: "Sunshine Conversations",
      description: "Messaging and conversation APIs for Zendesk Sunshine.",
      specs: [
        {
          version: "17.2.1",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/zendesk/sunshine-conversations/openapi.yaml",
        },
      ],
    },
  ],
}

const rocketChatRestTemplateGroup: RestTemplateGroup<"Rocket.Chat"> = {
  name: "Rocket.Chat",
  icon: RocketChatLogo,
  verified: true,
  description: "Open source team chat and omnichannel messaging platform APIs.",
  templates: [
    {
      name: "Rocket.Chat Authentication",
      description: "Login, user auth, and session management endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/authentication.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Content Management",
      description: "Content management and moderation endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/content-management.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Integrations",
      description: "Incoming and outgoing integrations and webhooks.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/integrations.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Marketplace Apps",
      description: "Marketplace app discovery, install, and management.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/marketplace-apps.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Messaging",
      description: "Messages, threads, reactions, and uploads.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/messaging.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Miscellaneous",
      description: "Utility and miscellaneous endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/miscellaneous.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Notifications",
      description: "Push, email, and notification endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/notifications.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Omnichannel",
      description: "Livechat, visitor, and omnichannel routing endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/omnichannel.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Rooms",
      description: "Rooms, channels, and groups management endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/rooms.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Settings",
      description: "Server settings and configuration endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/settings.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat Statistics",
      description: "Analytics and usage reporting endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/statistics.yaml",
        },
      ],
    },
    {
      name: "Rocket.Chat User Management",
      description: "User, role, and permission management endpoints.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/RocketChat/Rocket.Chat-Open-API/main/user-management.yaml",
        },
      ],
    },
  ],
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
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
      verified: true,
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
      verified: true,
    },
    {
      name: "Confluence",
      description: "Atlassian Confluence API for content, spaces, and users",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/confluence/openapi.json",
        },
      ],
      icon: ConfluenceLogo,
      verified: true,
    },
    {
      name: "Discord",
      description: "Discord API for guilds, channels, messages, and webhooks",
      specs: [
        {
          version: "10",
          url: "https://raw.githubusercontent.com/discord/discord-api-spec/main/specs/openapi.json",
        },
      ],
      icon: DiscordLogo,
      verified: true,
    },
    {
      name: "Figma",
      description:
        "Design platform API for files, projects, teams, and comments",
      specs: [
        {
          version: "0.35.0",
          url: "https://raw.githubusercontent.com/figma/rest-api-spec/main/openapi/openapi.yaml",
        },
      ],
      icon: FigmaLogo,
      verified: true,
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
      verified: true,
    },
    {
      name: "Jira Cloud",
      description:
        "Build apps, script interactions with Jira, or develop any other type of integration",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/jira-cloud/openapi.json",
        },
      ],
      icon: JiraLogo,
      verified: true,
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
      verified: true,
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
      verified: true,
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
      verified: true,
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
      verified: true,
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
      verified: true,
    },
    /**
     * UNVERIFIED
     */
    {
      name: "Gitlab",
      description: "The most comprehensive DevSecOps platform.",
      specs: [
        {
          version: "v4",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/gitlab/openapi.yaml",
        },
      ],
      icon: GitlabLogo,
    },
    {
      name: "Mastercard",
      description:
        "Open Banking solutions in the US are provided by Finicity, a Mastercard company.",
      specs: [
        {
          version: "1.16.2",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/mastercard/openapi.yaml",
        },
      ],
      icon: MastercardLogo,
    },
    {
      name: "Stripe",
      description:
        "Secure payment processing, subscriptions, billing, and reporting APIs",
      specs: [
        {
          version: "2026-01-28.clover",
          url: "https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.yaml",
        },
      ],
      icon: StripeLogo,
      verified: true,
    },
    {
      name: "Ansible AWX",
      description:
        "Automation Controller (AWX) REST API for inventories, projects, jobs, and workflows",
      specs: [
        {
          version: "v2",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/ansible-awx/openapi.json",
        },
      ],
      icon: AnsibleLogo,
    },
    {
      name: "Ashby",
      description:
        "The public API for accessing resources in your Ashby instance.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/ashby/openapi.yaml",
        },
      ],
      icon: AshbyLogo,
    },
    {
      name: "Banksapi",
      description:
        "Comprehensive Data Access Access to hundreds of millions of accounts, securities accounts and financial products",
      specs: [
        {
          version: "2.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/banksapi/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/baremetrics/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/billsby/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/breezy-hr/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/brevo/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/bulksms-com/openapi.yaml",
        },
      ],
      icon: BulksmsComLogo,
    },
    {
      name: "Buttondown",
      description: "The last email platform you'll switch to.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/buttondown/openapi.yaml",
        },
      ],
      icon: ButtondownLogo,
    },
    {
      name: "Clever",
      description:
        "Offers one secure place for teachers and students to access the applications they love and depend on.",
      specs: [
        {
          version: "3.0.0",
          url: "https://dev.clever.com/openapi/6054fe66dc8ea400120e9f7a",
        },
      ],
      icon: CleverLogo,
      verified: true,
    },
    {
      name: "Clickup",
      description:
        "This is the ClickUp API Reference where you can learn about specific endpoints and parameters in detail.",
      specs: [
        {
          version: "2.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/clickup/openapi.yaml",
        },
      ],
      icon: ClickupLogo,
    },
    {
      name: "Deel",
      description:
        "The only platform that allows you to combine payroll, HR, performance, and compliance for any type of worker in 150 countries into a single HR platform.",
      specs: [
        {
          version: "1.25.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/deel/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/dixa/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/dots/openapi.yaml",
        },
      ],
      icon: DotsLogo,
    },
    {
      name: "Factorial",
      description:
        "The business management software that connects all you need to manage your team. It automates repetitive tasks, from hiring and holidays to performance reviews.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/factorial/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/fastspring/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/fountain/openapi.yaml",
        },
      ],
      icon: FountainLogo,
    },
    {
      name: "Goody",
      description:
        "Goody is a new way to send personal and business gifts as easily as a text message.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/goody/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/helcim/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/hibob/openapi.yaml",
        },
      ],
      icon: HibobLogo,
    },
    {
      name: "Homerun",
      description:
        "Applicant tracking and HR management made easy for growing teams. Beautiful job posts, leave tracking, employee data, and team insights—all in one place.",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/homerun/openapi.yaml",
        },
      ],
      icon: HomerunLogo,
    },
    {
      name: "Hypatos",
      description:
        "Say goodbye to manual errors and cut the risk of do-overs. Hypatos AI agents increase processing efficiency and keep it consistent with correct decisions powered by knowledge...",
      specs: [
        {
          version: "2.15.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/hypatos/openapi.yaml",
        },
      ],
      icon: HypatosLogo,
    },
    {
      name: "Intercom",
      description:
        "The leading AI Agent for customer service delivering the highest quality answers and handling the most complex queries",
      specs: [
        {
          version: "2.9",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/intercom/openapi.yaml",
        },
      ],
      icon: IntercomLogo,
    },
    {
      name: "Ironclad",
      description:
        "Design and deploy any type of contract in minutes. Instantly surface insights from legal agreements; manage risk.",
      specs: [
        {
          version: "1",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/ironclad/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/jina-ai/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/jobsoid/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/keatext-ai/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/kenjo/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/lambda/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/lob/openapi.yaml",
        },
      ],
      icon: LobLogo,
    },
    {
      name: "Localizely",
      description:
        "A translation management system that helps you organize your software translation projects.",
      specs: [
        {
          version: "1.2.1",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/localizely/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/logisticsos/openapi.yaml",
        },
      ],
      icon: LogisticsosLogo,
    },
    {
      name: "Measureone",
      description:
        "Automate your business workflows and lower your costs with MeasureOne, the most comprehensive and accurate platform for income, employment, educati...",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/measureone/openapi.yaml",
        },
      ],
      icon: MeasureoneLogo,
    },
    {
      name: "Microsoft Teams",
      description:
        "Use Microsoft Graph to manage teams, channels, chats, and messages.",
      specs: [
        {
          version: "v1.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/ms-teams/openapi.yaml",
        },
      ],
      icon: MicrosoftTeamsLogo,
      verified: true,
    },
    {
      name: "Nanonets",
      description:
        "Break down data barriers with Nanonets AI—extract valuable information from documents, emails, tickets or databases.",
      specs: [
        {
          version: "2.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/nanonets/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/notion/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/oyster/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/peach-payments/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/pinpoint/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/podium/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/remote/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/resend/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/rivery/openapi.yaml",
        },
      ],
      icon: RiveryLogo,
    },
    {
      name: "Sage",
      description: "All requests are required to be sent to your subdomain.",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/sage/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/secoda/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/shipengine/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/shippo/openapi.yaml",
        },
      ],
      icon: ShippoLogo,
    },
    {
      name: "Shortcut",
      description:
        "A fast, lightweight and enjoyable project management platform for product and engineering teams.",
      specs: [
        {
          version: "3.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/shortcut/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/smartrecruiters/openapi.yaml",
        },
      ],
      icon: SmartrecruitersLogo,
    },
    {
      name: "SoftLedger",
      description:
        "SoftLedger provides real-time visibility to critical financial data.",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/softledger/openapi.yaml",
        },
      ],
      icon: SoftledgerLogo,
    },
    {
      name: "SpotDraft",
      description:
        "A contract lifecycle management solution built for fast growing businesses. Create, manage, sign and analyze your contracts all in one place.",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/spotdraft/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/sumsub/openapi.yaml",
        },
      ],
      icon: SumsubLogo,
    },
    {
      name: "SuprSend",
      description:
        "SuprSend is a central communication stack for easily creating, managing and delivering notifications to your end users on multiple channels.",
      specs: [
        {
          version: "1.2.1",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/suprsend/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/terminal/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/theirstack/openapi.yaml",
        },
      ],
      icon: TheirstackLogo,
    },
    {
      name: "Tilled",
      description:
        "PayFac-as-a-Service combines easy-to-integrate payment technology, full-service offerings...",
      specs: [
        {
          version: "1.0",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/tilled/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/trello/openapi.yaml",
        },
      ],
      icon: TrelloLogo,
    },
    {
      name: "Tremendous",
      description:
        "Deliver monetary rewards and incentives to employees, customers, survey participants, and more.",
      specs: [
        {
          version: "2",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/tremendous/openapi.yaml",
        },
      ],
      icon: TremendousLogo,
    },
    {
      name: "Verifiable",
      description:
        "Discover credentialing solutions designed to optimize provider networks, powered by industry-leading primary source verification technology.",
      specs: [
        {
          version: "24.14.3.683",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/verifiable/openapi.yaml",
        },
      ],
      icon: VerifiableLogo,
    },
    {
      name: "Volt IO",
      description: "One integration to a world of real-time payments",
      specs: [
        {
          version: "2024.04.11",
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/volt-io/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/workable/openapi.yaml",
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
          url: "https://raw.githubusercontent.com/Budibase/openapi-rest-templates/main/x/openapi.yaml",
        },
      ],
      icon: XLogo,
    },
  ],
  templateGroups: [
    hubspotRestTemplateGroup,
    rocketChatRestTemplateGroup,
    twilioRestTemplateGroup,
    zendeskRestTemplateGroup,
  ],
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
