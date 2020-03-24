import { filter } from "lodash/fp"
import { configFolder, appDefinitionFile, $ } from "../common"
import { TRANSACTIONS_FOLDER } from "../transactions/transactionsCommon"
import {
  AUTH_FOLDER,
  USERS_LIST_FILE,
  ACCESS_LEVELS_FILE,
} from "../authApi/authCommon"
import { initialiseRootCollections } from "../collectionApi/initialise"
import { initialiseIndex } from "../indexing/initialiseIndex"
import {
  getFlattenedHierarchy,
  isGlobalIndex,
  isSingleRecord,
} from "../templateApi/hierarchy"
import { _getNew } from "../recordApi/getNew"
import { _save } from "../recordApi/save"

export const initialiseData = async (
  datastore,
  applicationDefinition,
  accessLevels
) => {
  if (!await datastore.exists(configFolder))
    await datastore.createFolder(configFolder)

  if (!await datastore.exists(appDefinitionFile))
    await datastore.createJson(appDefinitionFile, applicationDefinition)

  await initialiseRootCollections(datastore, applicationDefinition.hierarchy)
  await initialiseRootIndexes(datastore, applicationDefinition.hierarchy)

  if (!await datastore.exists(TRANSACTIONS_FOLDER))
    await datastore.createFolder(TRANSACTIONS_FOLDER)

  if (!await datastore.exists(AUTH_FOLDER))
    await datastore.createFolder(AUTH_FOLDER)

  if (!await datastore.exists(USERS_LIST_FILE))
    await datastore.createJson(USERS_LIST_FILE, [])

  if (!await datastore.exists(ACCESS_LEVELS_FILE))
    await datastore.createJson(
      ACCESS_LEVELS_FILE,
      accessLevels ? accessLevels : { version: 0, levels: [] }
    )

  await initialiseRootSingleRecords(datastore, applicationDefinition.hierarchy)
}

const initialiseRootIndexes = async (datastore, hierarchy) => {
  const flathierarchy = getFlattenedHierarchy(hierarchy)
  const globalIndexes = $(flathierarchy, [filter(isGlobalIndex)])

  for (const index of globalIndexes) {
    if (!(await datastore.exists(index.nodeKey()))) {
      await initialiseIndex(datastore, "", index)
    }
  }
}

const initialiseRootSingleRecords = async (datastore, hierarchy) => {
  const app = {
    publish: () => {},
    cleanupTransactions: () => {},
    datastore,
    hierarchy,
  }

  const flathierarchy = getFlattenedHierarchy(hierarchy)
  const singleRecords = $(flathierarchy, [filter(isSingleRecord)])

  for (let record of singleRecords) {
    if (await datastore.exists(record.nodeKey())) continue
    await datastore.createFolder(record.nodeKey())
    const result = _getNew(record, "")
    await _save(app, result)
  }
}
