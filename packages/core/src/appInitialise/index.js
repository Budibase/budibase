import { retry } from '../common/index';
import { NotFoundError } from '../common/errors';

const createJson = originalCreateFile => async (key, obj, retries = 2, delay = 100) => await retry(originalCreateFile, retries, delay, key, JSON.stringify(obj));

const createNewFile = originalCreateFile => async (path, content, retries = 2, delay = 100) => await retry(originalCreateFile, retries, delay, path, content);

const loadJson = datastore => async (key, retries = 3, delay = 100) => {
  try {
    return await retry(JSON.parse, retries, delay, await datastore.loadFile(key));
  } catch (err) {
    const newErr = new NotFoundError(err.message);
    newErr.stack = err.stack;
    throw(newErr);
  }
}

const updateJson = datastore => async (key, obj, retries = 3, delay = 100) => {
  try {
    return await retry(datastore.updateFile, retries, delay, key, JSON.stringify(obj));
  } catch (err) {
    const newErr = new NotFoundError(err.message);
    newErr.stack = err.stack;
    throw(newErr);
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
