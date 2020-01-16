import { filter } from 'lodash/fp';
import { configFolder, appDefinitionFile, $ } from '../common';
import { TRANSACTIONS_FOLDER } from '../transactions/transactionsCommon';
import { AUTH_FOLDER, USERS_LIST_FILE, ACCESS_LEVELS_FILE } from '../authApi/authCommon';
import { initialiseRootCollections } from '../collectionApi/initialise';
import { initialiseIndex } from '../indexing/initialiseIndex';
import { getFlattenedHierarchy, isGlobalIndex, isSingleRecord } from '../templateApi/hierarchy';
import { _getNew } from "../recordApi/getNew";
import { _save } from "../recordApi/save";

export const initialiseData = async (datastore, applicationDefinition, accessLevels) => {
  await datastore.createFolder(configFolder);
  await datastore.createJson(appDefinitionFile, applicationDefinition);

  await initialiseRootCollections(datastore, applicationDefinition.hierarchy);
  await initialiseRootIndexes(datastore, applicationDefinition.hierarchy);

  await datastore.createFolder(TRANSACTIONS_FOLDER);

  await datastore.createFolder(AUTH_FOLDER);

  await datastore.createJson(USERS_LIST_FILE, []);

  await datastore.createJson(
    ACCESS_LEVELS_FILE, 
    accessLevels ? accessLevels : { version: 0, levels: [] });

  await initialiseRootSingleRecords(datastore, applicationDefinition.hierarchy);
};

const initialiseRootIndexes = async (datastore, hierarchy) => {
  const flathierarchy = getFlattenedHierarchy(hierarchy);
  const globalIndexes = $(flathierarchy, [
    filter(isGlobalIndex),
  ]);

  for (const index of globalIndexes) {
    if (!await datastore.exists(index.nodeKey())) { 
      await initialiseIndex(datastore, '', index); 
    }
  }
};

const initialiseRootSingleRecords = async (datastore, hierarchy) => {
  const app = { 
    publish:()=>{},
    cleanupTransactions: () => {},
    datastore, hierarchy 
  };

  const flathierarchy = getFlattenedHierarchy(hierarchy);
  const singleRecords = $(flathierarchy, [
    filter(isSingleRecord),
  ]);

  for (let record of singleRecords) {
    await datastore.createFolder(record.nodeKey());
    const result = _getNew(record, "");
    await _save(app,result);
  }
};
