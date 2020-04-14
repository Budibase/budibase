import {
  findRoot,
  getFlattenedHierarchy,
  fieldReversesReferenceToIndex,
  isModel,
  isAncestorIndex,
  isAncestor,
} from "./hierarchy"
import { $ } from "../common"
import { map, filter, includes } from "lodash/fp"

export const canDeleteModel = modelNode => {
  const flatHierarchy = $(modelNode, [findRoot, getFlattenedHierarchy])

  const ancestors = $(flatHierarchy, [filter(isAncestor(modelNode))])

  const belongsToAncestor = i => ancestors.includes(i.parent())

  const errorsForNode = node => {
    const errorsThisNode = $(flatHierarchy, [
      filter(
        i =>
          isAncestorIndex(i) &&
          belongsToAncestor(i) &&
          includes(node.nodeId)(i.allowedModelNodeIds)
      ),
      map(
        i =>
          `index "${i.name}" indexes this model. Please remove the model from the index, or delete the index`
      ),
    ])

    for (let child of node.children) {
      for (let err of errorsForNode(child)) {
        errorsThisNode.push(err)
      }
    }

    return errorsThisNode
  }

  const errors = errorsForNode(modelNode)

  return { errors, canDelete: errors.length === 0 }
}
