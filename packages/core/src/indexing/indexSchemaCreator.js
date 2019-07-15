import {
  has, keys, map, orderBy,
  filter, concat, reverse,
} from 'lodash/fp';
import { getAllowedRecordNodesForIndex } from '../templateApi/hierarchy';
import { mapRecord } from './evaluate';
import { constructRecord } from '../recordApi/getNew';
import { getSampleFieldValue, detectType, all } from '../types';
import { $ } from '../common';

export const generateSchema = (hierarchy, indexNode) => {
  const recordNodes = getAllowedRecordNodesForIndex(hierarchy, indexNode);
  const mappedRecords = $(recordNodes, [
    map(n => mapRecord(createSampleRecord(n), indexNode)),
  ]);

  // always has record key and sort key
  const schema = {
    sortKey: all.string,
    key: all.string,
  };

  const fieldsHas = has(schema);
  const setField = (fieldName, value) => {
    if (value === null || value === undefined) { return; }

    const thisType = detectType(value);
    if (fieldsHas(fieldName)) {
      if (schema[fieldName] !== thisType) {
        schema[fieldName] = all.string;
      }
    } else {
      schema[fieldName] = thisType;
    }
  };

  for (const mappedRec of mappedRecords) {
    for (const f in mappedRec) {
      setField(f, mappedRec[f]);
    }
  }

  // returing an array of {name, type}
  return $(schema, [
    keys,
    map(k => ({ name: k, type: schema[k].name })),
    filter(s => s.name !== 'sortKey'),
    orderBy('name', ['desc']), // reverse aplha
    concat([{ name: 'sortKey', type: all.string.name }]), // sortKey on end
    reverse, // sortKey first, then rest are alphabetical
  ]);
};

const createSampleRecord = recordNode => constructRecord(
  recordNode,
  getSampleFieldValue,
  recordNode.parent().nodeKey(),
);
