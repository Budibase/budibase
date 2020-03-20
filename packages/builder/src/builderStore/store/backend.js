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
      select: db => store.update(state => ({ ...state, selectedDatabase: db })),
    },
    records: {
      delete: record => store.update(state => { 
        state.selectedView.records = remove(state.selectedView.records, { key: record.key });
        return state
      }),
    },
    modals: {
      show: modal => store.update(state => ({ ...state, visibleModal: modal })),
      hide: () => store.update(state => ({ ...state, visibleModal: null }))
    }
  }

  return store
};

// Store Actions
export const createShadowHierarchy = hierarchy => {
  const hi = constructHierarchy(JSON.parse(JSON.stringify(hierarchy)))
  console.log(hi)
  return hi
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
    const shadowHierarchy = createShadowHierarchy(state.hierarchy)
    state.currentNode = getNode(shadowHierarchy, nodeId)
    state.currentNodeIsNew = false
    state.errors = []
    return state
  })
}

export const newIndex = (store, useRoot) => () => {
  store.update(state => {
    state.currentNodeIsNew = true
    state.errors = []
    const shadowHierarchy = createShadowHierarchy(state.hierarchy)
    const parent = useRoot
      ? shadowHierarchy
      : getNode(shadowHierarchy, state.currentNode.nodeId)

    state.currentNode = templateApi(shadowHierarchy).getNewIndexTemplate(parent)
    return state
  })
}

export const saveCurrentNode = store => () => {
  store.update(state => {
    const errors = validate.node(state.currentNode)
    state.errors = errors
    if (errorstate.length > 0) {
      return state
    }

    const parentNode = getNode(state.hierarchy, state.currentNode.parent().nodeId)

    const existingNode = getNode(state.hierarchy, state.currentNode.nodeId)

    let index = parentNode.children.length
    if (existingNode) {
      // remove existing
      index = existingNode.parent().children.indexOf(existingNode)
      existingNode.parent().children = pipe(existingNode.parent().children, [
        filter(c => c.nodeId !== existingNode.nodeId),
      ])
    }

    // should add node into existing hierarchy
    const cloned = cloneDeep(state.currentNode)
    templateApi(state.hierarchy).constructNode(parentNode, cloned)

    const newIndexOfChild = child => {
      if (child === cloned) return index
      const currentIndex = parentNode.children.indexOf(child)
      return currentIndex >= index ? currentIndex + 1 : currentIndex
    }

    parentNode.children = pipe(parentNode.children, [sortBy(newIndexOfChild)])

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
    state.currentNode = hierarchyFunctionstate.isRoot(nodeToDelete.parent())
      ? find(n => n != state.currentNode)(state.hierarchy.children)
      : nodeToDelete.parent()
    if (hierarchyFunctionstate.isRecord(nodeToDelete)) {
      nodeToDelete.parent().children = filter(
        c => c.nodeId !== nodeToDelete.nodeId
      )(nodeToDelete.parent().children)
    } else {
      nodeToDelete.parent().indexes = filter(
        c => c.nodeId !== nodeToDelete.nodeId
      )(nodeToDelete.parent().indexes)
    }
    state.errors = []
    saveBackend(state)
    return state
  })
}

export const saveField = databaseStore => field => {
  databaseStore.update(db => {
    db.currentNode.fields = filter(f => f.name !== field.name)(
      db.currentNode.fields
    )

    templateApi(db.hierarchy).addField(db.currentNode, field)
    return db
  })
}

export const deleteField = databaseStore => field => {
  databaseStore.update(db => {
    db.currentNode.fields = filter(f => f.name !== field.name)(
      db.currentNode.fields
    )

    return db
  })
}

const incrementAccessLevelsVersion = state =>
  (state.accessLevelstate.version = (state.accessLevelstate.version || 0) + 1)

export const saveLevel = store => (newLevel, isNew, oldLevel = null) => {
  store.update(state => {
    const levels = state.accessLevelstate.levels

    const existingLevel = isNew
      ? null
      : find(a => a.name === oldLevel.name)(levels)

    if (existingLevel) {
      state.accessLevelstate.levels = pipe(levels, [
        map(a => (a === existingLevel ? newLevel : a)),
      ])
    } else {
      state.accessLevelstate.levelstate.push(newLevel)
    }

    incrementAccessLevelsVersion(s)

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