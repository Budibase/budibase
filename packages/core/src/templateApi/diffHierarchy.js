import { getFlattenedHierarchy, isRecord, isIndex } from "./hierarchy"
import { $, none } from "../common"
import { map, filter, some, find } from "lodash/fp"

export const HierarchyChangeTypes = {
  recordCreated: "Record Created",
  recordDeleted: "Record Deleted",
  recordRenamed: "Record Renamed",
  recordFieldsChanged: "Record Fields Changed",
  recordEstimatedRecordTypeChanged: "Record's Estimated Record Count Changed",
  indexCreated: "Index Created",
  indexDeleted: "Index Deleted",
  indexChanged: "index Changed",
}

export const diffHierarchy = (oldHierarchy, newHierarchy) => {
  const oldHierarchyFlat = getFlattenedHierarchy(oldHierarchy)
  const newHierarchyFlat = getFlattenedHierarchy(newHierarchy)

  return [
    ...createdRecords(oldHierarchyFlat, newHierarchyFlat),
    ...deletedRecords(oldHierarchyFlat, newHierarchyFlat),
    ...renamedRecords(oldHierarchyFlat, newHierarchyFlat),
    ...recordsWithFieldsChanged(oldHierarchyFlat, newHierarchyFlat),
    ...recordsWithEstimatedRecordTypeChanged(oldHierarchyFlat, newHierarchyFlat),
    ...createdIndexes(oldHierarchyFlat, newHierarchyFlat),
    ...deletedIndexes(oldHierarchyFlat, newHierarchyFlat),
    ...updatedIndexes(oldHierarchyFlat, newHierarchyFlat),
  ]
}

const changeItem = (type, oldNode, newNode) => ({
  type, oldNode, newNode,
})

const createdRecords = (oldHierarchyFlat, newHierarchyFlat) => 
  $(newHierarchyFlat, [
    filter(isRecord),
    filter(nodeDoesNotExistIn(oldHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.recordCreated, null, n))
  ])

const deletedRecords = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeDoesNotExistIn(newHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.recordDeleted, n, null))
  ])

const renamedRecords = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeExistsIn(newHierarchyFlat)),
    filter(nodeChanged(newHierarchyFlat, (_new,old) =>_new.collectionKey !== old.collectionKey )),
    map(n => changeItem(
      HierarchyChangeTypes.recordDeleted, 
      n, 
      findNodeIn(n, newHierarchyFlat))
    )
  ])

const recordsWithFieldsChanged = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeExistsIn(newHierarchyFlat)),
    filter(hasDifferentFields(newHierarchyFlat)),
    map(n => changeItem(
      HierarchyChangeTypes.recordFieldsChanged, 
      n, 
      findNodeIn(n, newHierarchyFlat))
    )
  ])

const recordsWithEstimatedRecordTypeChanged = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeExistsIn(newHierarchyFlat)),
    filter(nodeChanged(newHierarchyFlat, (_new,old) =>_new.estimatedRecordCount !== old.estimatedRecordCount)),
    map(n => changeItem(
      HierarchyChangeTypes.recordEstimatedRecordTypeChanged, 
      n, 
      findNodeIn(n, newHierarchyFlat))
    )
  ])

const createdIndexes =  (oldHierarchyFlat, newHierarchyFlat) => 
  $(newHierarchyFlat, [
    filter(isIndex),
    filter(nodeDoesNotExistIn(oldHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.indexCreated, null, n))
  ])

const deletedIndexes = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isIndex),
    filter(nodeDoesNotExistIn(newHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.indexDeleted, n, null))
  ])


const updatedIndexes = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeExistsIn(newHierarchyFlat)),
    filter(nodeChanged(newHierarchyFlat, indexHasChanged)),
    map(n => changeItem(
      HierarchyChangeTypes.indexChanged, 
      n, 
      findNodeIn(n, newHierarchyFlat))
    )
  ])

const hasDifferentFields = otherFlatHierarchy => record1 => {

  const record2 = findNodeIn(record1, otherFlatHierarchy)

  if(record1.fields.length !== record2.fields.length) return false

  for(let f1 of record1.fields) {
    if (none(isFieldSame(f1))(record2.fields)) return true
  }
  
  return false
}

const indexHasChanged = (_new, old) => 
  _new.map !== old.map 
  || _new.filter !== old.filter
  || _new.getShardName !== old.getShardName

const isFieldSame = f1 => f2 => 
  f1.name === f2.name && f1.type === f2.type

const nodeDoesNotExistIn = inThis => node => 
  none(n => n.nodeId === node.nodeId)(inThis) 

const nodeExistsIn = inThis => node  => 
  some(n => n.nodeId === node.nodeId)(inThis)

const nodeChanged = (inThis, isChanged) => node  => 
  some(n => n.nodeId === node.nodeId && isChanged(n, node))(inThis)

const findNodeIn = (node, inThis) => 
  find(n => n.nodeId === node.nodeId)(inThis)
