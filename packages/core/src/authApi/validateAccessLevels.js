import {
  values, includes, map, concat, isEmpty, uniqWith, some,
  flatten, filter,
} from 'lodash/fp';
import { applyRuleSet, makerule } from '../common/validationCommon';
import { permissionTypes } from './authCommon';
import {
  $, isSomething, insensitiveEquals,
  isNonEmptyString, apiWrapperSync, events,
} from '../common';
import { getNode } from '../templateApi/hierarchy';
import { alwaysAuthorized } from './permissions';

const isAllowedType = t => $(permissionTypes, [
  values,
  includes(t),
]);

const isRecordOrIndexType = t => some(p => p === t)([
  permissionTypes.CREATE_RECORD,
  permissionTypes.UPDATE_RECORD,
  permissionTypes.DELETE_RECORD,
  permissionTypes.READ_RECORD,
  permissionTypes.READ_INDEX,
  permissionTypes.EXECUTE_ACTION,
]);


const permissionRules = app => ([
  makerule('type', 'type must be one of allowed types',
    p => isAllowedType(p.type)),
  makerule('nodeKey', 'record and index permissions must include a valid nodeKey',
    p => (!isRecordOrIndexType(p.type))
             || isSomething(getNode(app.hierarchy, p.nodeKey))),
]);

const applyPermissionRules = app => applyRuleSet(permissionRules(app));

const accessLevelRules = allLevels => ([
  makerule('name', 'name must be set',
    l => isNonEmptyString(l.name)),
  makerule('name', 'access level names must be unique',
    l => isEmpty(l.name)
             || filter(a => insensitiveEquals(l.name, a.name))(allLevels).length === 1),
]);

const applyLevelRules = allLevels => applyRuleSet(accessLevelRules(allLevels));

export const validateAccessLevel = app => (allLevels, level) => {
  const errs = $(level.permissions, [
    map(applyPermissionRules(app)),
    flatten,
    concat(
      applyLevelRules(allLevels)(level),
    ),
  ]);

  return errs;
};

export const validateAccessLevels = app => allLevels => apiWrapperSync(
  app,
  events.authApi.validateAccessLevels,
  alwaysAuthorized,
  { allLevels },
  _validateAccessLevels, app, allLevels,
);

export const _validateAccessLevels = (app, allLevels) => $(allLevels, [
  map(l => validateAccessLevel(app)(allLevels, l)),
  flatten,
  uniqWith((x, y) => x.field === y.field
                        && x.item === y.item
                        && x.error === y.error),
]);
