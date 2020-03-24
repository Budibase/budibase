import { 
  findRoot, 
  getFlattenedHierarchy,
  fieldReversesReferenceToIndex,
  isRecord,
  isAncestorIndex,
  isAncestor
} from "./hierarchy"
import { $ } from "../common"
import { map, filter, includes } from "lodash/fp"

export const canDeleteRecord = recordNode => {
  const flatHierarchy = $(recordNode, [
    findRoot,
    getFlattenedHierarchy
  ])

  const ancestors = $(flatHierarchy, [
    filter(isAncestor(recordNode))
  ])

  const belongsToAncestor = i => 
    ancestors.includes(i.parent())
  
  
  const errorsForNode = node => {
    const errorsThisNode = $(flatHierarchy, [
      filter(i => isAncestorIndex(i) 
                && belongsToAncestor(i) 
                && includes(node.nodeId)(i.allowedRecordNodeIds)),
      map(i => `index ${i.name} indexes this record. Please remove the record from allowedRecordIds, or delete the index`)
    ])

    for (let child of node.children) {
      for (let err of errorsForNode(child)) {
        errorsThisNode.push(err)
      }
    }

    return errorsThisNode    
  }

  return errorsForNode(recordNode)
}