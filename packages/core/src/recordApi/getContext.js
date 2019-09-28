import { map, isString, has, some } from 'lodash/fp';
import {
  getExactNodeForPath,
  findField, getNode, isGlobalIndex,
} from '../templateApi/hierarchy';
import { listItems } from '../indexApi/listItems';
import {
  $, apiWrapperSync, events,
} from '../common';
import { getIndexKey_BasedOnDecendant } from '../indexing/sharding';
import { permission } from '../authApi/permissions';

export const getContext = app => recordKey => apiWrapperSync(
  app,
  events.recordApi.getContext,
  permission.readRecord.isAuthorized(recordKey),
  { recordKey },
  _getContext, app, recordKey,
);

export const _getContext = (app, recordKey) => {
  const recordNode = getExactNodeForPath(app.hierarchy)(recordKey);

  const cachedReferenceIndexes = {};

  const lazyLoadReferenceIndex = async (typeOptions) => {
    if (!has(typeOptions.indexNodeKey)(cachedReferenceIndexes)) {
      cachedReferenceIndexes[typeOptions.indexNodeKey] = {
        typeOptions,
        data: await readReferenceIndex(
          app, recordKey, typeOptions,
        ),
      };
    }

    return cachedReferenceIndexes[typeOptions.indexNodeKey];
  };

  const getTypeOptions = typeOptions_or_fieldName => (isString(typeOptions_or_fieldName)
    ? findField(recordNode, typeOptions_or_fieldName)
      .typeOptions
    : typeOptions_or_fieldName);

  return {
    referenceExists: async (typeOptions_or_fieldName, key) => {
      const typeOptions = getTypeOptions(typeOptions_or_fieldName);
      const { data } = await lazyLoadReferenceIndex(typeOptions);
      return some(i => i.key === key)(data);
    },
    referenceOptions: async (typeOptions_or_fieldName) => {
      const typeOptions = getTypeOptions(typeOptions_or_fieldName);
      const { data } = await lazyLoadReferenceIndex(typeOptions);
      return data;
    },
    recordNode,
  };
};

const readReferenceIndex = async (app, recordKey, typeOptions) => {
  const indexNode = getNode(app.hierarchy, typeOptions.indexNodeKey);
  const indexKey = isGlobalIndex(indexNode)
    ? indexNode.nodeKey()
    : getIndexKey_BasedOnDecendant(
      recordKey, indexNode,
    );

  const items = await listItems(app)(indexKey);
  return $(items, [
    map(i => ({
      key: i.key,
      value: i[typeOptions.displayValue],
    })),
  ]);
};
