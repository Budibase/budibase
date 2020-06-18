import { writable } from "svelte/store"
import { cloneDeep } from "lodash/fp";
import api from "../api"

export const getBackendUiStore = () => {
  const INITIAL_BACKEND_UI_STATE = {
    models: [],
    views: [],
    users: [],
    selectedDatabase: {},
    selectedModel: {},
    draftModel: {},
    tabs: {
      SETUP_PANEL: "SETUP",
      NAVIGATION_PANEL: "NAVIGATE"
    }
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
            store.actions.models.select(models[0]);
          }
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
      select: record =>
        store.update(state => {
          state.selectedRecord = record
          return state
        }),
    },
    models: {
      select: model => store.update(state => {
        state.selectedModel = model;
        state.draftModel = cloneDeep(model);
        state.selectedField = ""
        state.selectedView = `all_${model._id}`
        state.tabs.SETUP_PANEL = "SETUP"
        return state;
      }),
      save: async ({ instanceId, model }) => {
        const updatedModel = cloneDeep(model);

        // TODO: refactor
        for (let key in updatedModel.schema) {
          const field = updatedModel.schema[key]
          if (field.name && field.name !== key) { 
            updatedModel.schema[field.name] = field 
            delete updatedModel.schema[key];
          } 
        }

        const SAVE_MODEL_URL = `/api/${instanceId}/models`
        const response = await api.post(SAVE_MODEL_URL, updatedModel)
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

          store.actions.models.select(savedModel)
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

          state.selectedField = field.name

          state.tabs.NAVIGATION_PANEL = "NAVIGATE"

          return state
        });
      },
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
