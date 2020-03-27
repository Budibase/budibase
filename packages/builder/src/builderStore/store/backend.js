import { writable } from "svelte/store";
import api from "../api"
import {
  cloneDeep,
  sortBy,
  find,
  remove
} from "lodash/fp"
import { hierarchy as hierarchyFunctions } from "../../../../core/src"
import {
  getNode,
  validate,
  constructHierarchy,
  templateApi,
  isIndex,
  canDeleteIndex,
  canDeleteRecord
} from "../../common/core"

export const getBackendUiStore = () => {
  const INITIAL_BACKEND_UI_STATE = {
    leftNavItem: "DATABASE",
    selectedView: {
      records: [],
      name: ""
    },
    breadcrumbs: [],
    selectedDatabase: {},
    selectedModel: {},
  }

  const store = writable(INITIAL_BACKEND_UI_STATE)

  store.actions = {
    navigate: name => store.update(state => ({ ...state, leftNavItem: name })),
    database: {
      select: db => store.update(state => {  
          state.selectedDatabase = db
          state.breadcrumbs = [db.name]
          return state
      })
    },
    records: {
      delete: () => store.update(state => { 
        state.selectedView = state.selectedView 
        return state
      }),
      view: record => store.update(state => { 
        state.breadcrumbs = [state.selectedDatabase.name, record.id]
        return state
      }),
      select: record => store.update(state => {
        state.selectedRecord = record
        return state
      })
    },
    views: {
      select: view => store.update(state => { 
        state.selectedView = view 
        return state
      })
    },
    modals: {
      show: modal => store.update(state => ({ ...state, visibleModal: modal })),
      hide: () => store.update(state => ({ ...state, visibleModal: null }))
    },
    users: {
      create: user => store.update(state => {
        state.users.push(user)
        state.users = state.users
        return state
      })
    }
  }

  return store
};

// Store Actions
export const createShadowHierarchy = hierarchy => constructHierarchy(JSON.parse(JSON.stringify(hierarchy)))

export const createDatabaseForApp = store => appInstance => {
  store.update(state => { 
    state.appInstances.push(appInstance) 
    return state
  })
}

export const saveBackend = async state => {
  await api.post(`/_builder/api/${state.appname}/backend`, {
    appDefinition: {
      hierarchy: state.hierarchy,
      actions: state.actions,
      triggers: state.triggers,
    },
    accessLevels: state.accessLevels,
  })

  const instances_currentFirst = state.selectedDatabase
    ? [
        state.appInstances.find(i => i.id === state.selectedDatabase.id),
        ...state.appInstances.filter(i => i.id !== state.selectedDatabase.id),
      ]
    : state.appInstances

  for (let instance of instances_currentFirst) {
    await api.post(
      `/_builder/instance/${state.appname}/${instance.id}/api/upgradeData`,
      { newHierarchy: state.hierarchy }
    )
  }
}

export const newRecord = (store, useRoot) => () => {
  store.update(state => {
    state.currentNodeIsNew = true
    const shadowHierarchy = createShadowHierarchy(state.hierarchy)
    const parent = useRoot
      ? shadowHierarchy
      : getNode(shadowHierarchy, state.currentNode.nodeId)
    state.errors = []
    state.currentNode = templateApi(shadowHierarchy).getNewRecordTemplate(
      parent,
      "",
      true
    )
    return state
  })
}

export const selectExistingNode = store => nodeId => {
  store.update(state => {
    state.currentNode = getNode(state.hierarchy, nodeId)
    state.currentNodeIsNew = false
    state.errors = []
    return state
  })
}

export const newIndex = (store, useRoot) => () => {
  store.update(state => {
    state.shadowHierarchy = createShadowHierarchy(state.hierarchy)
    state.currentNodeIsNew = true
    state.errors = []
    const parent = useRoot
      ? state.shadowHierarchy
      : getNode(state.shadowHierarchy, state.currentNode.nodeId)

    state.currentNode = templateApi(state.shadowHierarchy).getNewIndexTemplate(
      parent
    )
    return state
  })
}

export const saveCurrentNode = store => () => {
  store.update(state => {
    const errors = validate.node(state.currentNode)
    state.errors = errors
    if (errors.length > 0) {
      return state
    }
    const parentNode = getNode(
      state.hierarchy,
      state.currentNode.parent().nodeId
    )

    const existingNode = getNode(state.hierarchy, state.currentNode.nodeId)

    let index = parentNode.children.length
    if (existingNode) {
      // remove existing
      index = existingNode.parent().children.indexOf(existingNode)
      if (isIndex(existingNode)) {
        parentNode.indexes = parentNode.indexes.filter(
          node => node.nodeId !== existingNode.nodeId
        )
      } else {
        parentNode.children = parentNode.children.filter(
          node => node.nodeId !== existingNode.nodeId
        )
      }
    }

    // should add node into existing hierarchy
    const cloned = cloneDeep(state.currentNode)
    templateApi(state.hierarchy).constructNode(parentNode, cloned)

    if (isIndex(existingNode)) {
      parentNode.children = sortBy("name", parentNode.children)
    } else {
      parentNode.indexes = sortBy("name", parentNode.indexes)
    }

    if (!existingNode && state.currentNode.type === "record") {
      const defaultIndex = templateApi(state.hierarchy).getNewIndexTemplate(
        cloned.parent()
      )
      defaultIndex.name = `all_${cloned.name}s`
      defaultIndex.allowedRecordNodeIds = [cloned.nodeId]
    }

    state.currentNodeIsNew = false

    saveBackend(state)

    return state
  })
}

export const deleteCurrentNode = store => () => {
  store.update(state => {
    const nodeToDelete = getNode(state.hierarchy, state.currentNode.nodeId)
    state.currentNode = hierarchyFunctions.isRoot(nodeToDelete.parent())
      ? state.hierarchy.children.find(node => node !== state.currentNode)
      : nodeToDelete.parent()

    const isRecord = hierarchyFunctions.isRecord(nodeToDelete)

    const check = isRecord
      ? canDeleteRecord(nodeToDelete)
      : canDeleteIndex(nodeToDelete)

    if (!check.canDelete) {
      state.errors = check.errors.map(e => ({ error: e }))
      return state
    }

    const recordOrIndexKey = isRecord ? "children" : "indexes"

    // remove the selected record or index
    const newCollection = remove(
      node => node.nodeId === nodeToDelete.nodeId,
      nodeToDelete.parent()[recordOrIndexKey]
    )

    nodeToDelete.parent()[recordOrIndexKey] = newCollection

    state.errors = []
    saveBackend(state)
    return state
  })
}

export const saveField = store => field => {
  store.update(state => {
    state.currentNode.fields = state.currentNode.fields.filter(f => f.id !== field.id)

    templateApi(state.hierarchy).addField(state.currentNode, field)
    return state
  })
}

export const deleteField = store => field => {
  store.update(state => {
    state.currentNode.fields = state.currentNode.fields.filter(f => f.name !== field.name)
    return state
  })
}

const incrementAccessLevelsVersion = state => {
  state.accessLevels.version = state.accessLevels.version ? state.accessLevels.version + 1 : 1
  return state
}

export const saveLevel = store => (newLevel, isNew, oldLevel = null) => {
  store.update(state => {
    const levels = state.accessLevels.levels

    const existingLevel = isNew
      ? null
      : find(a => a.name === oldLevel.name)(levels)

    if (existingLevel) {
      state.accessLevels.levels = levels.map(level => level === existingLevel ? newLevel : level) 
    } else {
      state.accessLevels.levels.push(newLevel)
    }

    incrementAccessLevelsVersion(state)

    saveBackend(state)
    return state
  })
}

export const deleteLevel = store => level => {
  store.update(state => {
    state.accessLevels.levels = state.accessLevels.levels.filter(t => t.name !== level.name)
    incrementAccessLevelsVersion(s)
    saveBackend(state)
    return state
  })
}

export const saveAction = store => (newAction, isNew, oldAction = null) => {
  store.update(s => {
    const existingAction = isNew
      ? null
      : find(a => a.name === oldAction.name)(s.actions)

    if (existingAction) {
      s.actions = s.actions.map(action => action === existingAction ? newAction : action)
    } else {
      s.actions.push(newAction)
    }
    saveBackend(s)
    return s
  })
}

export const deleteAction = store => action => {
  store.update(state => {
    state.actions = state.actions.filter(a => a.name !== action.name);
    saveBackend(state);
    return state;
  })
}

export const saveTrigger = store => (newTrigger, isNew, oldTrigger = null) => {
  store.update(s => {
    const existingTrigger = isNew
      ? null
      : s.triggers.find(a => a.name === oldTrigger.name)

    if (existingTrigger) {
      s.triggers = s.triggers.map(a => (a === existingTrigger ? newTrigger : a))
    } else {
      s.triggers.push(newTrigger)
    }
    saveBackend(s)
    return s
  })
}

export const deleteTrigger = store => trigger => {
  store.update(s => {
    s.triggers = s.triggers.filter(t => t.name !== trigger.name)
    return s
  })
}