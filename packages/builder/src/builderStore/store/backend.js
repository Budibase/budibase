import { writable } from "svelte/store";
import api from "../api"
import {
  filter,
  cloneDeep,
  sortBy,
  map,
  find,
  remove
} from "lodash/fp"
import { hierarchy as hierarchyFunctions } from "../../../../core/src"
import {
  pipe,
  getNode,
  validate,
  constructHierarchy,
  templateApi,
} from "../../common/core"

export const getBackendUiStore = () => {
  const INITIAL_BACKEND_UI_STATE = {
    leftNavItem: "DATABASE",
    selectedView: {
      records: [],
      name: ""
    },
    selectedRecord: {},
    selectedDatabase: {},
    selectedModel: {},
  }

  const store = writable(INITIAL_BACKEND_UI_STATE)

  store.actions = {
    navigate: name => store.update(state => ({ ...state, leftNavItem: name })),
    database: {
      select: state => store.update(state => ({ ...state, selectedDatabase: state })),
    },
    records: {
      delete: record => store.update(state => { 
        state.selectedView.records = remove(state.selectedView.records, { id: record.id });
        return state
      }),
    },
    modals: {
      show: modal => store.update(state => ({ ...state, visibleModal: modal })),
      hide: () => store.update(state => ({ ...state, visibleModal: null }))
    },
    nodes: {
      select: () => {},
      update: () => {},
      delete: () => {},
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
    const shadowHierarchy = createShadowHierarchy(state.hierarchy)
    state.currentNodeIsNew = true
    state.errors = []
    const parent = useRoot
      ? state.hierarchy
      : getNode(state.hierarchy, state.currentNode.nodeId)

    state.currentNode = templateApi(shadowHierarchy).getNewIndexTemplate(parent)
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
    const parentNode = getNode(state.hierarchy, state.currentNode.parent().nodeId)

    const existingNode = getNode(state.hierarchy, state.currentNode.nodeId)

    let index = parentNode.children.length
    if (existingNode) {
      // remove existing
      index = existingNode.parent().children.indexOf(existingNode)
      existingNode.parent().children = existingNode.parent().children.filter(node => node.nodeId !== existingNode.nodeId);
    }

    // should add node into existing hierarchy
    const cloned = cloneDeep(state.currentNode)
    templateApi(state.hierarchy).constructNode(parentNode, cloned)

    const newIndexOfChild = child => {
      if (child === cloned) return index
      const currentIndex = parentNode.children.indexOf(child)
      return currentIndex >= index ? currentIndex + 1 : currentIndex
    }

    parentNode.children = sortBy(newIndexOfChild, parentNode.children)

    if (!existingNode && state.currentNode.type === "record") {
      const defaultIndex = templateApi(state.hierarchy).getNewIndexTemplate(
        cloned.parent()
      )
      defaultIndex.name = `all_${cloned.collectionName}`
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

    const recordOrIndexKey = hierarchyFunctions.isRecord(nodeToDelete) ? "children" : "indexes";

    // remove the selected record or index
    nodeToDelete.parent()[recordOrIndexKey] = remove(
      nodeToDelete.parent()[recordOrIndexKey],
      node => node.nodeId === nodeToDelete.nodeId
    )

    state.errors = []
    saveBackend(state)
    return state
  })
}

export const saveField = store => field => {
  store.update(state => {
    state.currentNode.fields = state.currentNode.fields.filter(f => f.name !== field.name)

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
    state.accessLevelstate.levels = filter(t => t.name !== level.name)(
      state.accessLevelstate.levels
    )
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
      : find(a => a.name === oldTrigger.name)(s.triggers)

    if (existingTrigger) {
      s.triggers = pipe(s.triggers, [
        map(a => (a === existingTrigger ? newTrigger : a)),
      ])
    } else {
      s.triggers.push(newTrigger)
    }
    saveBackend(s)
    return s
  })
}

export const deleteTrigger = store => trigger => {
  store.update(s => {
    s.triggers = filter(t => t.name !== trigger.name)(s.triggers)
    return s
  })
}