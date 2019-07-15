import { compileExpression, compileCode } from '@nx-js/compiler-util';
import {
  isUndefined, keys, 
  cloneDeep, isFunction,
} from 'lodash';
import { defineError } from '../common';

export const filterEval = 'FILTER_EVALUATE';
export const filterCompile = 'FILTER_COMPILE';
export const mapEval = 'MAP_EVALUATE';
export const mapCompile = 'MAP_COMPILE';
export const removeUndeclaredFields = 'REMOVE_UNDECLARED_FIELDS';
export const addUnMappedFields = 'ADD_UNMAPPED_FIELDS';
export const addTheKey = 'ADD_KEY';


const getEvaluateResult = () => ({
  isError: false,
  passedFilter: true,
  result: null,
});

export const compileFilter = index => compileExpression(index.filter);

export const compileMap = index => compileCode(index.map);

export const passesFilter = (record, index) => {
  const context = { record };
  if (!index.filter) return true;

  const compiledFilter = defineError(
    () => compileFilter(index),
    filterCompile,
  );

  return defineError(
    () => compiledFilter(context),
    filterEval,
  );
};

export const mapRecord = (record, index) => {
  const recordClone = cloneDeep(record);
  const context = { record: recordClone };

  const map = index.map ? index.map : 'return {...record};';

  const compiledMap = defineError(
    () => compileCode(map),
    mapCompile,
  );

  const mapped = defineError(
    () => compiledMap(context),
    mapEval,
  );

  const mappedKeys = keys(mapped);
  for (let i = 0; i < mappedKeys.length; i++) {
    const key = mappedKeys[i];
    mapped[key] = isUndefined(mapped[key]) ? null : mapped[key];
    if (isFunction(mapped[key])) {
      delete mapped[key];
    }
  }

  mapped.key = record.key;
  mapped.sortKey = index.getSortKey
    ? compileCode(index.getSortKey)(context)
    : record.id;

  return mapped;
};

export const evaluate = record => (index) => {
  const result = getEvaluateResult();

  try {
    result.passedFilter = passesFilter(record, index);
  } catch (err) {
    result.isError = true;
    result.passedFilter = false;
    result.result = err.message;
  }

  if (!result.passedFilter) return result;

  try {
    result.result = mapRecord(record, index);
  } catch (err) {
    result.isError = true;
    result.result = err.message;
  }

  return result;
};

export default evaluate;
