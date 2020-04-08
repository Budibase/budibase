export const setupDatastore = datastore => {
  datastore.loadJson = datastore.loadFile
  datastore.createJson = datastore.createFile
  datastore.updateJson = datastore.updateFile
  if (datastore.createEmptyDb) {
    delete datastore.createEmptyDb
  }
  return datastore
}

export { createEventAggregator } from "./eventAggregator"

export default setupDatastore
