import { RestTemplate } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface RestTemplatesState {
  templates: RestTemplate[]
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
    {
      name: "Datadog Metrics",
      description:
        "Datadog metrics API for timeseries ingestion, queries, and monitor integration",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/stackql/stackql-provider-registry/main/providers/src/datadog/v00.00.00000/services/metrics.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/datadog.svg",
    },
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
      name: "GitLab",
      description:
        "GitLab REST API for groups, projects, pipelines, and DevOps automation",
      specs: [
        {
          version: "latest",
          url: "https://raw.githubusercontent.com/gitlabhq/gitlabhq/master/doc/api/openapi/openapi.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/gitlab.svg",
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
      name: "Salesforce",
      description:
        "CRM data, analytics, and automation via Salesforce Einstein Platform Services",
      specs: [
        {
          version: "2.0.1",
          url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/salesforce.local/einstein/2.0.1/openapi.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/salesforce.svg",
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
