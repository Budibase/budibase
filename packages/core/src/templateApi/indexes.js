import {
  map, isEmpty, countBy, flatten, includes,
} from 'lodash/fp';
import { join, keys } from 'lodash';
import { applyRuleSet, makerule } from '../common/validationCommon';
import { compileFilter, compileMap } from '../indexing/evaluate';
import { isNonEmptyString, executesWithoutException, $ } from '../common';
import { isRecord } from './hierarchy';

export const indexTypes = { reference: 'reference', ancestor: 'ancestor' };

export const indexRuleSet = [
  makerule('map', 'index has no map function',
    index => isNonEmptyString(index.map)),
  makerule('map', "index's map function does not compile",
    index => !isNonEmptyString(index.map)
                || executesWithoutException(() => compileMap(index))),
  makerule('filter', "index's filter function does not compile",
    index => !isNonEmptyString(index.filter)
                || executesWithoutException(() => compileFilter(index))),
  makerule('name', 'must declare a name for index',
    index => isNonEmptyString(index.name)),
  makerule('name', 'there is a duplicate named index on this node',
    index => isEmpty(index.name)
                || countBy('name')(index.parent().indexes)[index.name] === 1),
  makerule('indexType', 'reference index may only exist on a record node',
    index => isRecord(index.parent())
                  || index.indexType !== indexTypes.reference),
  makerule('indexType', `index type must be one of: ${join(', ', keys(indexTypes))}`,
    index => includes(index.indexType)(keys(indexTypes))),
];

export const validateIndex = (index, allReferenceIndexesOnNode) => applyRuleSet(indexRuleSet(allReferenceIndexesOnNode))(index);

export const validateAllIndexes = node => $(node.indexes, [
  map(i => validateIndex(i, node.indexes)),
  flatten,
]);
