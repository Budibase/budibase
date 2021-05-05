import { writable } from "svelte/store"
import api from "builderStore/api"

export function createOrganisationStore() {
    const { subscribe, set } = writable({})
  
    return {
      subscribe,
      save: async config => {
        try {
          const res = await api.post('/api/admin/configs', { type: 'settings', config})
          return await res.json()
        } catch (error) {
          console.error(error)
        }
      },
      init: async () => {
        try {
          const response = await api.get(`/api/admin/configs/settings`)
          const json = await response.json()
          set(json)
          // set(json)
        } catch (error) {
          set({
            platformUrl: '',
            logoUrl: '',
            docsUrl: '',
            company: ''
          })
        }
      },
    }
  }

export const organisation = createOrganisationStore()