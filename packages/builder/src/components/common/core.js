import {
  hierarchy as hierarchyFunctions,
  common,
  getTemplateApi,
  getAuthApi,
} from "../../../../core/src"
import { _getNew } from "../../../../core/src/recordApi/getNew"
import { find, filter, keyBy, flatten, map } from "lodash/fp"
import { generateSchema } from "../../../../core/src/indexing/indexSchemaCreator"
import { generate } from "shortid"

export { canDeleteIndex } from "../../../../core/src/templateApi/canDeleteIndex"
export { canDeleteRecord } from "../../../../core/src/templateApi/canDeleteRecord"
export { userWithFullAccess } from "../../../../core/src/index"
export { joinKey } from "../../../../core/src/common"
export { getExactNodeForKey } from "../../../../core/src/templateApi/hierarchy"
export const pipe = common.$

export const events = common.eventsList

export const getNode = (hierarchy, nodeId) =>
  pipe(hierarchy, [
    hierarchyFunctions.getFlattenedHierarchy,
    find(n => n.nodeId === nodeId || n.nodeKey() === nodeId),
  ])

export const constructHierarchy = node => {
  if (!node) return node
  return templateApi(node).constructHierarchy(node)
}

export const createNewHierarchy = () => {
  return templateApi().getNewRootLevel()
}

export const templateApi = hierarchy => getTemplateApi({ hierarchy })
export const authApi = (hierarchy, actions) =>
  getAuthApi({
    hierarchy,
    actions: keyBy("name")(actions),
    publish: () => { },
  })

export const allTypes = templateApi({}).allTypes

export const validate = {
  all: templateApi({}).validateAll,
  node: templateApi({}).validateNode,
  field: templateApi({}).validateField,
}

export const getPotentialReverseReferenceIndexes = (hierarchy, refIndex) => {
  const res = pipe(hierarchy, [
    hierarchyFunctions.getFlattenedHierarchy,
    filter(
      n =>
        hierarchyFunctions.isAncestor(refIndex)(n) ||
        hierarchyFunctions.isAncestor(refIndex)(n.parent())
    ),
    map(n => n.indexes),
    flatten,
    filter(hierarchyFunctions.isReferenceIndex),
  ])

  return res
}

export const getPotentialReferenceIndexes = (hierarchy, record) =>
  pipe(hierarchy, [
    hierarchyFunctions.getFlattenedHierarchy,
    filter(hierarchyFunctions.isAncestorIndex),
    filter(
      i =>
        hierarchyFunctions.isAncestor(record)(i.parent()) ||
        i.parent().nodeId === record.parent().nodeId ||
        hierarchyFunctions.isRoot(i.parent())
    ),
  ])

export const isIndex = hierarchyFunctions.isIndex
export const isRecord = hierarchyFunctions.isRecord

export const getDefaultTypeOptions = type =>
  !type ? {} : allTypes[type].getDefaultOptions()

export const getNewAction = () => templateApi({}).createAction()
export const getNewTrigger = () => templateApi({}).createTrigger()

export const validateActions = actions =>
  templateApi({}).validateActions(actions)
export const validateTriggers = (triggers, actions) =>
  templateApi({}).validateTriggers(triggers, actions)

export const generateFullPermissions = (hierarchy, actions) =>
  authApi(hierarchy, actions).generateFullPermissions()

export const getNewAccessLevel = () => authApi().getNewAccessLevel()

export const validateAccessLevels = (hierarchy, actions, accessLevels) =>
  authApi(hierarchy, actions).validateAccessLevels(accessLevels)

export const getIndexNodes = hierarchy =>
  pipe(hierarchy, [
    hierarchyFunctions.getFlattenedHierarchy,
    filter(hierarchyFunctions.isIndex),
  ])

export const getRecordNodes = hierarchy =>
  pipe(hierarchy, [
    hierarchyFunctions.getFlattenedHierarchy,
    filter(hierarchyFunctions.isRecord),
  ])

export const getIndexSchema = hierarchy => index =>
  generateSchema(hierarchy, index)

export const getNewRecord = _getNew

export const getNewInstance = (appId, name) => {
  const id = `2-${generate()}`
  return {
    key: `/applications/${appId}/instances/${id}`,
    active: true,
    version: { key: "" },
    isNew: true,
    type: "instance",
    datastoreconfig: "",
    id,
    name,
  }
}
