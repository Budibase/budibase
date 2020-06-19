import { writable } from "svelte/store"
import api from "../api"
import { getContext } from "svelte"

/** TODO: DEMO SOLUTION
 * this section should not be here, it is a quick fix for a demo
 * when we reorg the backend UI, this should disappear
 *  **/
import { CreateEditModelModal } from "components/database/ModelDataTable/modals"
/** DEMO SOLUTION  END **/

export const getBackendUiStore = () => {
  const INITIAL_BACKEND_UI_STATE = {
    breadcrumbs: [],
    models: [],
    views: [],
    users: [],
    selectedDatabase: {},
    selectedModel: {},
  }

  const store = writable(INITIAL_BACKEND_UI_STATE)

  store.actions = {
    database: {
      select: async db => {
        const modelsResponse = await api.get(`/api/models`)
        const viewsResponse = await api.get(`/api/views`)
        const models = await modelsResponse.json()
        const views = await viewsResponse.json()
        store.update(state => {
          state.selectedDatabase = db
          if (models && models.length > 0) {
            state.selectedModel = models[0]
            state.selectedView = `all_${models[0]._id}`
          }
          state.breadcrumbs = [db.name]
          state.models = models
          state.views = views
          return state
        })
        /** TODO: DEMO SOLUTION**/
        if (!models || models.length === 0) {
          const { open, close } = getContext("simple-modal")
          open(
            CreateEditModelModal,
            {
              onClosed: close,
            },
            { styleContent: { padding: "0" } }
          )
        }
        /** DEMO SOLUTION  END **/
      },
    },
    records: {
      delete: () =>
        store.update(state => {
          state.selectedView = state.selectedView
          return state
        }),
      view: record =>
        store.update(state => {
          state.breadcrumbs = [state.selectedDatabase.name, record._id]
          return state
        }),
      select: record =>
        store.update(state => {
          state.selectedRecord = record
          return state
        }),
    },
    models: {
      create: model =>
        store.update(state => {
          state.models.push(model)
          state.models = state.models
          state.selectedModel = model
          state.selectedView = `all_${model._id}`
          return state
        }),
    },
    views: {
      select: view =>
        store.update(state => {
          state.selectedView = view
          return state
        }),
    },
    users: {
      create: user =>
        store.update(state => {
          state.users.push(user)
          state.users = state.users
          return state
        }),
    },
  }

  return store
}

// Store Actions
export const createDatabaseForApp = store => appInstance => {
  store.update(state => {
    state.appInstances.push(appInstance)
    return state
  })
}
