import { map } from 'lodash/fp';
import {
  USERS_LIST_FILE,
  stripUserOfSensitiveStuff,
} from './authCommon';
import { $, apiWrapper, events } from '../common';
import { permission } from './permissions';

export const getUsers = app => async () => apiWrapper(
  app,
  events.authApi.getUsers,
  permission.listUsers.isAuthorized,
  {},
  _getUsers, app,
);

export const _getUsers = async app => $(await app.datastore.loadJson(USERS_LIST_FILE), [
  map(stripUserOfSensitiveStuff),
]);
