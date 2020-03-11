import { getFlattenedHierarchy, isRecord, isIndex, isAncestor } from "./hierarchy"
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

  const createdRecords = findCreatedRecords(oldHierarchyFlat, newHierarchyFlat)
  const deletedRecords = findDeletedRecords(oldHierarchyFlat, newHierarchyFlat)
  
  return [
    ...createdRecords,
    ...deletedRecords,
    ...findRenamedRecords(oldHierarchyFlat, newHierarchyFlat),
    ...findRecordsWithFieldsChanged(oldHierarchyFlat, newHierarchyFlat),
    ...findRecordsWithEstimatedRecordTypeChanged(oldHierarchyFlat, newHierarchyFlat),
    ...findCreatedIndexes(oldHierarchyFlat, newHierarchyFlat, createdRecords),
    ...findDeletedIndexes(oldHierarchyFlat, newHierarchyFlat, deletedRecords),
    ...findUpdatedIndexes(oldHierarchyFlat, newHierarchyFlat),
  ]
}

const changeItem = (type, oldNode, newNode) => ({
  type, oldNode, newNode,
})

const findCreatedRecords = (oldHierarchyFlat, newHierarchyFlat) => {
  const allCreated = $(newHierarchyFlat, [
    filter(isRecord),
    filter(nodeDoesNotExistIn(oldHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.recordCreated, null, n))
  ])

  return $(allCreated, [
    filter(r => none(r2 => isAncestor(r.newNode)(r2.newNode))(allCreated))
  ])
}

const findDeletedRecords = (oldHierarchyFlat, newHierarchyFlat) => {
  const allDeleted = $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeDoesNotExistIn(newHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.recordDeleted, n, null))
  ])

  return $(allDeleted, [
    filter(r => none(r2 => isAncestor(r.oldNode)(r2.oldNode))(allDeleted))
  ])
}

const findRenamedRecords = (oldHierarchyFlat, newHierarchyFlat) => 
  $(oldHierarchyFlat, [
    filter(isRecord),
    filter(nodeExistsIn(newHierarchyFlat)),
    filter(nodeChanged(newHierarchyFlat, (_new,old) =>_new.collectionKey !== old.collectionKey )),
    map(n => changeItem(
      HierarchyChangeTypes.recordRenamed, 
      n, 
      findNodeIn(n, newHierarchyFlat))
    )
  ])

const findRecordsWithFieldsChanged = (oldHierarchyFlat, newHierarchyFlat) => 
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

const findRecordsWithEstimatedRecordTypeChanged = (oldHierarchyFlat, newHierarchyFlat) => 
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

const findCreatedIndexes =  (oldHierarchyFlat, newHierarchyFlat, createdRecords) => { 
  const allCreated = $(newHierarchyFlat, [
    filter(isIndex),
    filter(nodeDoesNotExistIn(oldHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.indexCreated, null, n))
  ])

  return $(allCreated, [
    filter(r => none(r2 => isAncestor(r.newNode)(r2.newNode))(createdRecords))
  ])
}

const findDeletedIndexes = (oldHierarchyFlat, newHierarchyFlat, deletedRecords) => {
  const allDeleted = $(oldHierarchyFlat, [
    filter(isIndex),
    filter(nodeDoesNotExistIn(newHierarchyFlat)),
    map(n => changeItem(HierarchyChangeTypes.indexDeleted, n, null))
  ])

  return $(allDeleted, [
    filter(r => none(r2 => isAncestor(r.oldNode)(r2.oldNode))(deletedRecords))
  ])
}


const findUpdatedIndexes = (oldHierarchyFlat, newHierarchyFlat) => 
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

  if(record1.fields.length !== record2.fields.length) return true

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
