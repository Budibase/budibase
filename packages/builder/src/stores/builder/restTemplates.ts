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
