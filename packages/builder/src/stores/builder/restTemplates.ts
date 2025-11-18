import { RestTemplate, RestTemplateName } from "@budibase/types"
import { BudiStore } from "../BudiStore"
import GitHubLogo from "assets/rest-template-icons/github.svg"
import PagerDutyLogo from "assets/rest-template-icons/pagerduty.svg"
import SlackLogo from "assets/rest-template-icons/slack.svg"
import StripeLogo from "assets/rest-template-icons/stripe.svg"

interface RestTemplatesState {
  templates: RestTemplate[]
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
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
