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
  if (!(await datastore.exists(appDefinitionFile)))
    await datastore.createJson(appDefinitionFile, applicationDefinition)

  if (!(await datastore.exists(USERS_LIST_FILE)))
    await datastore.createJson(USERS_LIST_FILE, [])

  if (!(await datastore.exists(ACCESS_LEVELS_FILE)))
    await datastore.createJson(
      ACCESS_LEVELS_FILE,
      accessLevels ? accessLevels : { version: 0, levels: [] }
    )

  await initialiseRootSingleRecords(datastore, applicationDefinition.hierarchy)
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
    const result = _getNew(record, "")
    result.key = record.nodeKey()
    await _save(app, result)
  }
}
