import { RestTemplate } from "@budibase/types"
import { BudiStore } from "../BudiStore"

interface RestTemplatesState {
  templates: RestTemplate[]
}

const INITIAL_REST_TEMPLATES_STATE: RestTemplatesState = {
  templates: [
    {
      name: "Carbone.io",
      description:
        "Document generation API for creating PDFs, Word docs, and more from templates",
      url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/carbone.io/1.2.0/openapi.yaml",
      icon: "/builder/assets/rest-template-icons/carbone.png",
    },
    {
      name: "Jira",
      description:
        "Issue tracking and project management API for agile development teams",
      url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/jira.local/1.0.0/swagger.yaml",
      icon: "/builder/assets/rest-template-icons/jira.svg",
    },
    {
      name: "Wikimedia",
      description:
        "Wikipedia and Wikimedia projects API for accessing content and metadata",
      url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/wikimedia.org/1.0.0/swagger.yaml",
      icon: "/builder/assets/rest-template-icons/wikimedia.png",
    },
    {
      name: "Twilio",
      description:
        "Communications API for SMS, voice, video, and messaging services",
      url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/twilio.com/api/1.55.0/openapi.yaml",
      icon: "/builder/assets/rest-template-icons/twilio.svg",
    },
    {
      name: "Stripe",
      description:
        "Secure payment processing, subscriptions and financial data management",
      url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/stripe.com/2022-11-15/openapi.yaml",
      icon: "/builder/assets/rest-template-icons/stripe.svg",
    },
    {
      name: "Salesforce",
      description:
        "CRM data management, lead tracking, and customer relationship automation",
      url: "https://raw.githubusercontent.com/APIs-guru/openapi-directory/refs/heads/main/APIs/salesforce.local/einstein/2.0.1/openapi.yaml",
      icon: "/builder/assets/rest-template-icons/salesforce.png",
    },
    {
      name: "Zendesk",
      description:
        "Customer support ticket management, user data, and service analytics",
      url: "https://developer.zendesk.com/zendesk/oas.yaml",
      icon: "/builder/assets/rest-template-icons/zendesk.png",
    },
    {
      name: "Intercom",
      description:
        "Customer messaging, user engagement, and support conversation management",
      url: "https://raw.githubusercontent.com/intercom/Intercom-OpenAPI/refs/heads/main/descriptions/2.14/api.intercom.io.yaml",
      icon: "/builder/assets/rest-template-icons/intercom.svg",
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
