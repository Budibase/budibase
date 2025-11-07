import { RestTemplate } from "@budibase/types"
import { BudiStore } from "../BudiStore"

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
          version: "latest",
          url: "https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/github.svg",
    },
    {
      name: "PagerDuty",
      description:
        "PagerDuty REST resources for services, incidents, and incident automation",
      specs: [
        {
          version: "latest",
          url: "https://raw.githubusercontent.com/stackql/stackql-provider-registry/main/providers/src/pagerduty/v00.00.00000/services/services.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/pagerduty.svg",
    },
    {
      name: "Slack Web API",
      description:
        "The Slack Web API is an interface for querying information from and enacting change in a Slack workspace.",
      specs: [
        {
          version: "v2",
          url: "https://api.slack.com/specs/openapi/v2/slack_web.json",
        },
      ],
      icon: "/builder/assets/rest-template-icons/slack.svg",
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
      icon: "/builder/assets/rest-template-icons/stripe.svg",
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
}

export const restTemplates = new RestTemplatesStore()
