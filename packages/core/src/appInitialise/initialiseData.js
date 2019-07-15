import { filter } from 'lodash/fp';
import { configFolder, appDefinitionFile, $ } from '../common';
import { TRANSACTIONS_FOLDER } from '../transactions/transactionsCommon';
import { AUTH_FOLDER, USERS_LIST_FILE, ACCESS_LEVELS_FILE } from '../authApi/authCommon';
import { initialiseRootCollections } from '../collectionApi/initialise';
import { initialiseIndex } from '../indexing/initialiseIndex';
import { getFlattenedHierarchy, isGlobalIndex, isSingleRecord } from '../templateApi/hierarchy';
import { _save } from '../recordApi/save';
import { getNew } from '../recordApi/getNew';

export const initialiseData = async (datastore, applicationDefinition, accessLevels) => {
  await datastore.createFolder(configFolder);
  await datastore.createJson(appDefinitionFile, applicationDefinition);

  await initialiseRootCollections(datastore, applicationDefinition.hierarchy);
  await initialiseRootIndexes(datastore, applicationDefinition.hierarchy);

  await initialiseRootSingleRecords(datastore, applicationDefinition.hierarchy);

  await datastore.createFolder(TRANSACTIONS_FOLDER);

  await datastore.createFolder(AUTH_FOLDER);

  await datastore.createJson(USERS_LIST_FILE, []);

  await datastore.createJson(
    ACCESS_LEVELS_FILE, 
    accessLevels ? accessLevels : { version: 0, levels: [] });
};

const initialiseRootIndexes = async (datastore, hierarchy) => {
  const flathierarchy = getFlattenedHierarchy(hierarchy);
  const globalIndexes = $(flathierarchy, [
    filter(isGlobalIndex),
  ]);

  for (const index of globalIndexes) {
    if (!await datastore.exists(index.nodeKey())) { await initialiseIndex(datastore, '', index); }
  }
};

const initialiseRootSingleRecords = async (datastore, hierachy) => {
  const flathierarchy = getFlattenedHierarchy(hierachy);
  const singleRecords = $(flathierarchy, [
    filter(isSingleRecord),
  ]);

  /* for (let record of singleRecords) {
        const result = getNew({ datastore: datastore, hierarchy: appDefinition.hierarchy })
            (record.nodeKey(),
                record.name
            );

        _save({ datastore: datastore, hierarchy: appDefinition.hierarchy },
            result
        );
    } */
};
