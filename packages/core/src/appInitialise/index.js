import { retry } from '../common/index';
import { NotFoundError } from '../common/errors';

const createJson = originalCreateFile => async (key, obj, retries = 5, delay = 500) => await retry(originalCreateFile, retries, delay, key, JSON.stringify(obj));

const createNewFile = originalCreateFile => async (path, content, retries = 5, delay = 500) => await retry(originalCreateFile, retries, delay, path, content);

const loadJson = datastore => async (key, retries = 5, delay = 500) => {
  try {
    return await retry(JSON.parse, retries, delay, await datastore.loadFile(key));
  } catch (err) {
    throw new NotFoundError(err.message);
  }
}

const updateJson = datastore => async (key, obj, retries = 5, delay = 500) => {
  try {
    return await retry(datastore.updateFile, retries, delay, key, JSON.stringify(obj));
  } catch (err) {
    throw new NotFoundError(err.message);
  }
}

export const setupDatastore = (datastore) => {
  const originalCreateFile = datastore.createFile;
  datastore.loadJson = loadJson(datastore);
  datastore.createJson = createJson(originalCreateFile);
  datastore.updateJson = updateJson(datastore);
  datastore.createFile = createNewFile(originalCreateFile);
  if (datastore.createEmptyDb) { delete datastore.createEmptyDb; }
  return datastore;
};

export { createEventAggregator } from './eventAggregator';

export default setupDatastore;
