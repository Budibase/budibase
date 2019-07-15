import { getAllIdsIterator } from '../indexing/allIds';
import { getAllowedRecordTypes } from './getAllowedRecordTypes';
import { deleteCollection } from './delete';

export const getCollectionApi = app => ({
  getAllowedRecordTypes: getAllowedRecordTypes(app),
  getAllIdsIterator: getAllIdsIterator(app),
  delete: deleteCollection(app),
});

export default getCollectionApi;
