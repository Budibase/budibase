import { writable } from "svelte/store"
import { API } from "api"
import { notifications } from "@budibase/bbui"

export function createEmailStore() {
  const store = writable({})

  return {
    subscribe: store.subscribe,
    templates: {
      fetch: async () => {
        try {
          // fetch the email template definitions and templates
          const definitions = await API.getEmailTemplateDefinitions()
          const templates = await API.getEmailTemplates()
          store.set({
            definitions,
            templates,
          })
        } catch (error) {
          notifications.error("Error fetching email templates")
          store.set({})
        }
      },
      save: async template => {
        try {
          // Save your template config
          const savedTemplate = await API.saveEmailTemplate(template)
          template._rev = savedTemplate._rev
          template._id = savedTemplate._id
          store.update(state => {
            const currentIdx = state.templates.findIndex(
              template => template.purpose === savedTemplate.purpose
            )
            state.templates.splice(currentIdx, 1, template)
            return state
          })
        } catch (error) {
          notifications.error("Error saving email template")
        }
      },
    },
  }
}

export const email = createEmailStore()
