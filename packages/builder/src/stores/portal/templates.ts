import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import type { TemplateMetadata } from "@budibase/types"

class TemplateStore extends BudiStore<TemplateMetadata[]> {
  constructor() {
    super([])
  }

  async load() {
    const templates = await API.getAppTemplates()
    this.set(templates)
  }
}

export const templates = new TemplateStore()
