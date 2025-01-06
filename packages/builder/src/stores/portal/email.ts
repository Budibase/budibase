import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  FetchGlobalTemplateDefinitionResponse,
  Template,
} from "@budibase/types"

interface EmailState {
  definitions?: FetchGlobalTemplateDefinitionResponse
  templates: Template[]
}

class EmailStore extends BudiStore<EmailState> {
  constructor() {
    super({
      templates: [],
    })
  }

  async fetchTemplates() {
    const definitions = await API.getEmailTemplateDefinitions()
    const templates = await API.getEmailTemplates()
    this.set({
      definitions,
      templates,
    })
  }

  async saveTemplate(template: Template) {
    const savedTemplate = await API.saveEmailTemplate(template)
    template._rev = savedTemplate._rev
    template._id = savedTemplate._id
    this.update(state => {
      const currentIdx = state.templates.findIndex(
        template => template.purpose === savedTemplate.purpose
      )
      state.templates.splice(currentIdx, 1, template)
      return state
    })
  }
}

export const email = new EmailStore()
