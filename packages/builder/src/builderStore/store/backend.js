import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp";
import api from "../api"

export const getBackendUiStore = () => {
  const INITIAL_BACKEND_UI_STATE = {
    breadcrumbs: [],
    models: [],
    views: [],
    users: [],
    selectedDatabase: {},
    selectedModel: {},
    draftModel: {}
  }

  const store = writable(INITIAL_BACKEND_UI_STATE)

  store.actions = {
    database: {
      select: async db => {
        const modelsResponse = await api.get(`/api/${db._id}/models`)
        const viewsResponse = await api.get(`/api/${db._id}/views`)
        const models = await modelsResponse.json()
        const views = await viewsResponse.json()
        store.update(state => {
          state.selectedDatabase = db
          if (models && models.length > 0) {
            state.selectedModel = models[0]
            state.draftModel = models[0]
            state.selectedView = `all_${models[0]._id}`
          }
          state.breadcrumbs = [db.name]
          state.models = models
          state.views = views
          return state
        })
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
      select: model => store.update(state => {
        state.selectedModel = model;
        // TODO: prevent pointing to same obj
        state.draftModel = cloneDeep(model);
        state.selectedField = null
        return state;
      }),
      save: async ({ instanceId, model }) => {
        const SAVE_MODEL_URL = `/api/${instanceId}/models`
        const response = await api.post(SAVE_MODEL_URL, model)
        const savedModel = await response.json()

        store.update(state => {
          // New model
          if (!model._id) {
            state.models = [...state.models, savedModel]
          } else {
            const existingIdx = state.models.findIndex(({ _id }) => _id === model._id);
            state.models.splice(existingIdx, 1, savedModel);
            state.models = state.models
          }

          state.selectedModel = savedModel
          state.draftModel = savedModel
          state.selectedView = `all_${savedModel._id}`
          return state
        })
      },
      addField: field => {
        store.update(state => {
          if (!state.draftModel.schema) {
            state.draftModel.schema = {}
          }

          state.draftModel.schema = {
            ...state.draftModel.schema,
            [field.name]: field
          }

          state.selectedField = field

          return state
        });
      }
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
