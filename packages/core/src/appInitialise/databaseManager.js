import { isNothing } from "../common"

export const getDatabaseManager = databaseManager => ({
  createEmptyMasterDb: createEmptyMasterDb(databaseManager),
  createEmptyInstanceDb: createEmptyInstanceDb(databaseManager),
  getInstanceDbRootConfig: databaseManager.getInstanceDbRootConfig,
  masterDatastoreConfig: getMasterDatastoreConfig(databaseManager),
  getInstanceDatastoreConfig: getInstanceDatastoreConfig(databaseManager),
})

const getMasterDatastoreConfig = databaseManager =>
  databaseManager.getDatastoreConfig("master")

const getInstanceDatastoreConfig = databaseManager => (
  applicationId,
  instanceId
) => databaseManager.getDatastoreConfig(applicationId, instanceId)

const createEmptyMasterDb = databaseManager => async () =>
  await databaseManager.createEmptyDb("master")

const createEmptyInstanceDb = databaseManager => async (
  applicationId,
  instanceId
) => {
  if (isNothing(applicationId)) {
    throw new Error("CreateDb: application id not supplied")
  }
  if (isNothing(instanceId)) {
    throw new Error("CreateDb: instance id not supplied")
  }

  return await databaseManager.createEmptyDb(applicationId, instanceId)
}
