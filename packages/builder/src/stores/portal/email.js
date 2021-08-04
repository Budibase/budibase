import { writable } from "svelte/store"
import api from "builderStore/api"

export function createEmailStore() {
  const store = writable({})

  return {
    subscribe: store.subscribe,
    templates: {
      fetch: async () => {
        // fetch the email template definitions
        const response = await api.get(`/api/admin/template/definitions`)
        const definitions = await response.json()

        // fetch the email templates themselves
        const templatesResponse = await api.get(`/api/admin/template/email`)
        const templates = await templatesResponse.json()

        store.set({
          definitions,
          templates,
        })
      },
      save: async template => {
        // Save your template config
        const response = await api.post(`/api/admin/template`, template)
        const json = await response.json()
        if (response.status !== 200) throw new Error(json.message)
        template._rev = json._rev
        template._id = json._id

        store.update(state => {
          const currentIdx = state.templates.findIndex(
            template => template.purpose === json.purpose
          )
          state.templates.splice(currentIdx, 1, template)
          return state
        })
      },
    },
  }
}

export const email = createEmailStore()
