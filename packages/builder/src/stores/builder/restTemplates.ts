import { RestTemplate, RestTemplateName } from "@budibase/types"
import { BudiStore } from "../BudiStore"
import BambooHRLogo from "assets/rest-template-icons/bamboohr.svg"
import JiraLogo from "assets/rest-template-icons/jira.svg"
import GitHubLogo from "assets/rest-template-icons/github.svg"
import OktaLogo from "assets/rest-template-icons/okta.svg"
import PagerDutyLogo from "assets/rest-template-icons/pagerduty.svg"
import SlackLogo from "assets/rest-template-icons/slack.svg"
import StripeLogo from "assets/rest-template-icons/stripe.svg"
import VirusTotalLogo from "assets/rest-template-icons/virustotal.svg"

interface RestTemplatesState {
  templates: RestTemplate[]
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
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

  getByName(name?: RestTemplateName) {
    if (!name) {
      return undefined
    }
    return this.templates.find(template => template.name === name)
  }
}

export const restTemplates = new RestTemplatesStore()
