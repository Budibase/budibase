import { diffHierarchy, HierarchyChangeTypes } from "./diffHierarchy"
import { $, switchCase } from "../common"
import {
  differenceBy,
  isEqual,
  some,
  map,
  filter,
  uniqBy,
  flatten,
} from "lodash/fp"
import {
  findRoot,
  getDependantIndexes,
  isTopLevelRecord,
  isAncestorIndex,
} from "./hierarchy"
import { generateSchema } from "../indexing/indexSchemaCreator"
import { _buildIndex } from "../indexApi/buildIndex"
import { constructHierarchy } from "./createNodes"
import { deleteAllRecordsForNode } from "./deleteAllRecordsForNode"
import { deleteAllIndexFilesForNode } from "./deleteAllIndexFilesForNode"
import { cloneApp } from "../appInitialise/cloneApp"
import { initialiseData } from "../appInitialise/initialiseData"
import { initialiseChildrenForNode } from "../recordApi/initialiseChildren"
import { initialiseNewIndex } from "./initialiseNewIndex"
import { _saveApplicationHierarchy } from "../templateApi/saveApplicationHierarchy"
import { getApplicationDefinition } from "../templateApi/getApplicationDefinition"

export const upgradeData = app => async newHierarchy => {
  const currentAppDef = await getApplicationDefinition(app.datastore)()
  app.hierarchy = currentAppDef.hierarchy
  newHierarchy = constructHierarchy(newHierarchy)
  const diff = diffHierarchy(app.hierarchy, newHierarchy)
  const changeActions = gatherChangeActions(diff)

  if (changeActions.length === 0) return

  const newApp =
    newHierarchy &&
    cloneApp(app, {
      hierarchy: newHierarchy,
    })
  await doUpgrade(app, newApp, changeActions)
  await _saveApplicationHierarchy(newApp.datastore, newHierarchy)
}

const gatherChangeActions = diff =>
  $(diff, [map(actionForChange), flatten, uniqBy(a => a.compareKey)])

const doUpgrade = async (oldApp, newApp, changeActions) => {
  for (let action of changeActions) {
    await action.run(oldApp, newApp, action.diff)
  }
}

const actionForChange = diff =>
  switchCase(
    [isChangeType(HierarchyChangeTypes.recordCreated), recordCreatedAction],

    [isChangeType(HierarchyChangeTypes.recordDeleted), deleteRecordsAction],

    [
      isChangeType(HierarchyChangeTypes.recordFieldsChanged),
      rebuildAffectedIndexesAction,
    ],

    [isChangeType(HierarchyChangeTypes.recordRenamed), renameRecordAction],

    [
      isChangeType(HierarchyChangeTypes.recordEstimatedRecordTypeChanged),
      reshardRecordsAction,
    ],

    [isChangeType(HierarchyChangeTypes.indexCreated), newIndexAction],

    [isChangeType(HierarchyChangeTypes.indexDeleted), deleteIndexAction],

    [isChangeType(HierarchyChangeTypes.indexChanged), rebuildIndexAction]
  )(diff)

const isChangeType = changeType => change => change.type === changeType

const action = (diff, compareKey, run) => ({
  diff,
  compareKey,
  run,
})

const reshardRecordsAction = diff => [
  action(diff, `reshardRecords-${diff.oldNode.nodeKey()}`, runReshardRecords),
]

const rebuildIndexAction = diff => [
  action(diff, `rebuildIndex-${diff.newNode.nodeKey()}`, runRebuildIndex),
]

const newIndexAction = diff => {
  if (isAncestorIndex(diff.newNode)) {
    return [
      action(diff, `rebuildIndex-${diff.newNode.nodeKey()}`, runRebuildIndex),
    ]
  } else {
    return [action(diff, `newIndex-${diff.newNode.nodeKey()}`, runNewIndex)]
  }
}

const deleteIndexAction = diff => [
  action(diff, `deleteIndex-${diff.oldNode.nodeKey()}`, runDeleteIndex),
]

const deleteRecordsAction = diff => [
  action(diff, `deleteRecords-${diff.oldNode.nodeKey()}`, runDeleteRecords),
]

const renameRecordAction = diff => [
  action(diff, `renameRecords-${diff.oldNode.nodeKey()}`, runRenameRecord),
]

const recordCreatedAction = diff => {
  if (isTopLevelRecord(diff.newNode)) {
    return [action(diff, `initialiseRoot`, runInitialiseRoot)]
  }

  return [
    action(
      diff,
      `initialiseChildRecord-${diff.newNode.nodeKey()}`,
      runInitialiseChildRecord
    ),
  ]
}

const rebuildAffectedIndexesAction = diff => {
  const newHierarchy = findRoot(diff.newNode)
  const oldHierarchy = findRoot(diff.oldNode)
  const indexes = getDependantIndexes(newHierarchy, diff.newNode)

  const changedFields = (() => {
    const addedFields = differenceBy(f => f.name)(diff.oldNode.fields)(
      diff.newNode.fields
    )

    const removedFields = differenceBy(f => f.name)(diff.newNode.fields)(
      diff.oldNode.fields
    )

    return map(f => f.name)([...addedFields, ...removedFields])
  })()

  const isIndexAffected = i => {
    if (
      !isEqual(generateSchema(oldHierarchy, i), generateSchema(newHierarchy, i))
    )
      return true

    if (some(f => indexes.filter.indexOf(`record.${f}`) > -1)(changedFields))
      return true

    if (
      some(f => indexes.getShardName.indexOf(`record.${f}`) > -1)(changedFields)
    )
      return true

    return false
  }

  return $(indexes, [
    filter(isIndexAffected),
    map(i =>
      action({ newNode: i }, `rebuildIndex-${i.nodeKey()}`, runRebuildIndex)
    ),
  ])
}

const runReshardRecords = async change => {
  throw new Error("Resharding of records is not supported yet")
}

const runRebuildIndex = async (_, newApp, diff) => {
  await _buildIndex(newApp, diff.newNode.nodeKey())
}

const runDeleteIndex = async (oldApp, _, diff) => {
  await deleteAllIndexFilesForNode(oldApp, diff.oldNode)
}

const runDeleteRecords = async (oldApp, _, diff) => {
  await deleteAllRecordsForNode(oldApp, diff.oldNode)
}

const runNewIndex = async (_, newApp, diff) => {
  await initialiseNewIndex(newApp, diff.newNode)
}

const runRenameRecord = change => {
  /*
  Going to disllow this in the builder. once a collection key is set... its done
  */
}

const runInitialiseRoot = async (_, newApp) => {
  await initialiseData(newApp.datastore, newApp)
}

const runInitialiseChildRecord = async (_, newApp, diff) => {
  await initialiseChildrenForNode(newApp, diff.newNode)
}
