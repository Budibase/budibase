import api from "../api"
import {
  filter,
  cloneDeep,
  sortBy,
  find
} from "lodash/fp"
import { hierarchy as hierarchyFunctions } from "../../../../core/src"
import {
  pipe,
  getNode,
  validate,
  constructHierarchy,
  templateApi,
} from "../../common/core"
import { store } from "../index";

export const createShadowHierarchy = hierarchy =>
  constructHierarchy(JSON.parse(JSON.stringify(hierarchy)))

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
  store.update(s => {
    s.currentNodeIsNew = true
    const shadowHierarchy = createShadowHierarchy(s.hierarchy)
    const parent = useRoot
      ? shadowHierarchy
      : getNode(shadowHierarchy, s.currentNode.nodeId)
    s.errors = []
    s.currentNode = templateApi(shadowHierarchy).getNewRecordTemplate(
      parent,
      "",
      true
    )
    return s
  })
}

export const selectExistingNode = store => nodeId => {
  store.update(s => {
    const shadowHierarchy = createShadowHierarchy(s.hierarchy)
    s.currentNode = getNode(shadowHierarchy, nodeId)
    s.currentNodeIsNew = false
    s.errors = []
    return s
  })
}

export const newIndex = (store, useRoot) => () => {
  store.update(s => {
    s.currentNodeIsNew = true
    s.errors = []
    const shadowHierarchy = createShadowHierarchy(s.hierarchy)
    const parent = useRoot
      ? shadowHierarchy
      : getNode(shadowHierarchy, s.currentNode.nodeId)

    s.currentNode = templateApi(shadowHierarchy).getNewIndexTemplate(parent)
    return s
  })
}

// TODO: ONLY SEEMS TO BE CALLED BY THE BACKEND
export const saveCurrentNode = store => () => {
  store.update(s => {
    const errors = validate.node(s.currentNode)
    s.errors = errors
    if (errors.length > 0) {
      return s
    }

    const parentNode = getNode(s.hierarchy, s.currentNode.parent().nodeId)

    const existingNode = getNode(s.hierarchy, s.currentNode.nodeId)

    let index = parentNode.children.length
    if (existingNode) {
      // remove existing
      index = existingNode.parent().children.indexOf(existingNode)
      existingNode.parent().children = pipe(existingNode.parent().children, [
        filter(c => c.nodeId !== existingNode.nodeId),
      ])
    }

    // should add node into existing hierarchy
    const cloned = cloneDeep(s.currentNode)
    templateApi(s.hierarchy).constructNode(parentNode, cloned)

    const newIndexOfChild = child => {
      if (child === cloned) return index
      const currentIndex = parentNode.children.indexOf(child)
      return currentIndex >= index ? currentIndex + 1 : currentIndex
    }

    parentNode.children = pipe(parentNode.children, [sortBy(newIndexOfChild)])

    if (!existingNode && s.currentNode.type === "record") {
      const defaultIndex = templateApi(s.hierarchy).getNewIndexTemplate(
        cloned.parent()
      )
      defaultIndex.name = `all_${cloned.collectionName}`
      defaultIndex.allowedRecordNodeIds = [cloned.nodeId]
    }

    s.currentNodeIsNew = false

    saveBackend(s)

    return s
  })
}

export const deleteCurrentNode = store => () => {
  store.update(s => {
    const nodeToDelete = getNode(s.hierarchy, s.currentNode.nodeId)
    s.currentNode = hierarchyFunctions.isRoot(nodeToDelete.parent())
      ? find(n => n != s.currentNode)(s.hierarchy.children)
      : nodeToDelete.parent()
    if (hierarchyFunctions.isRecord(nodeToDelete)) {
      nodeToDelete.parent().children = filter(
        c => c.nodeId !== nodeToDelete.nodeId
      )(nodeToDelete.parent().children)
    } else {
      nodeToDelete.parent().indexes = filter(
        c => c.nodeId !== nodeToDelete.nodeId
      )(nodeToDelete.parent().indexes)
    }
    s.errors = []
    saveBackend(s)
    return s
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