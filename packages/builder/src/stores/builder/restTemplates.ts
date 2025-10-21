import { RestTemplate } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface RestTemplatesState {
  templates: RestTemplate[]
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
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
    {
      name: "BambooHR",
      description:
        "HRIS platform for employee records, time off, and performance management",
      specs: [
        {
          version: "latest",
          url: "https://raw.githubusercontent.com/kevinoid/bamboohr-openapi/main/openapi.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/bamboohr.svg",
    },
    {
      name: "Gmail",
      description:
        "Google Workspace Gmail API for email, labels, drafts, and message metadata",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/googleapis.com/gmail/v1/openapi.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/gmail.svg",
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
      name: "Box",
      description:
        "Cloud content management for files, folders, collaboration, and metadata",
      specs: [
        {
          version: "latest",
          url: "https://raw.githubusercontent.com/speakeasy-sdks/box-sdks/main/openapi.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/box.svg",
    },
    {
      name: "NetSuite",
      description:
        "ERP platform covering finance, inventory, and record management REST APIs",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/philip-denys/netsuite-rest-api-v1/master/ns-restapi-v1.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/netsuite.svg",
    },
    {
      name: "n8n",
      description:
        "n8n public API for managing workflows, executions, credentials, and users",
      specs: [
        {
          version: "v1",
          url: "https://raw.githubusercontent.com/n8n-io/n8n/master/packages/cli/src/public-api/v1/openapi.yml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/n8n.svg",
    },
    {
      name: "Jira",
      description:
        "Atlassian Jira Cloud REST API for issues, projects, and agile boards",
      specs: [
        {
          version: "1.0.0",
          url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/jira.local/1.0.0/swagger.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/jira.svg",
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
          url: "https://gitlab.com/gitlab-org/gitlab/-/raw/master/doc/api/openapi/openapi.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/gitlab.svg",
    },
    {
      name: "Zendesk",
      description:
        "Zendesk Service API for tickets, users, help center, and support workflows",
      specs: [
        {
          version: "latest",
          url: "https://developer.zendesk.com/zendesk/oas.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/zendesk.svg",
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
      name: "Okta",
      description:
        "Okta management API for directories, authentication, and lifecycle automation",
      specs: [
        {
          version: "latest",
          url: "https://raw.githubusercontent.com/okta/okta-management-openapi-spec/master/dist/current/management-oneOfInheritance.yaml",
        },
      ],
      icon: "/builder/assets/rest-template-icons/okta.svg",
    },
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
