import {
  filter, values, each, keys,
} from 'lodash/fp';
import { permission } from './permissions';
import {
  getFlattenedHierarchy,
  isIndex, isRecord,
} from '../templateApi/hierarchy';
import { $ } from '../common';

export const generateFullPermissions = (app) => {
  const allNodes = getFlattenedHierarchy(app.hierarchy);
  const accessLevel = { permissions: [] };

  const recordNodes = $(allNodes, [
    filter(isRecord),
  ]);

  for (const n of recordNodes) {
    permission.createRecord.add(n.nodeKey(), accessLevel);
    permission.updateRecord.add(n.nodeKey(), accessLevel);
    permission.deleteRecord.add(n.nodeKey(), accessLevel);
    permission.readRecord.add(n.nodeKey(), accessLevel);
  }

  const indexNodes = $(allNodes, [
    filter(isIndex),
  ]);

  for (const n of indexNodes) {
    permission.readIndex.add(n.nodeKey(), accessLevel);
  }

  for (const a of keys(app.actions)) {
    permission.executeAction.add(a, accessLevel);
  }

  $(permission, [
    values,
    filter(p => !p.isNode),
    each(p => p.add(accessLevel)),
  ]);

  return accessLevel.permissions;
};
