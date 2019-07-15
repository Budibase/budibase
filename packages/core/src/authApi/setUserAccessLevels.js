import { difference, map, join } from 'lodash/fp';
import {
  getLock, isNolock, releaseLock, $,
  apiWrapper, events,
} from '../common';
import {
  USERS_LOCK_FILE, ACCESS_LEVELS_FILE,
  getUserByName, USERS_LIST_FILE,
} from './authCommon';
import { permission } from './permissions';
import { NotFoundError } from '../common/errors';

export const setUserAccessLevels = app => async (userName, accessLevels) => apiWrapper(
  app,
  events.authApi.setUserAccessLevels,
  permission.setUserAccessLevels.isAuthorized,
  { userName, accessLevels },
  _setUserAccessLevels, app, userName, accessLevels,
);

export const _setUserAccessLevels = async (app, username, accessLevels) => {
  const lock = await getLock(app, USERS_LOCK_FILE, 1000, 1, 0);

  const actualAccessLevels = $(
    await app.datastore.loadJson(ACCESS_LEVELS_FILE),
    [
      l => l.levels,
      map(l => l.name),
    ],
  );

  const missing = difference(accessLevels)(actualAccessLevels);
  if (missing.length > 0) {
    throw new Error(`Invalid access levels supplied: ${join(', ', missing)}`);
  }

  if (isNolock(lock)) { throw new Error('Could set user access levels cannot get lock'); }

  try {
    const users = await app.datastore.loadJson(USERS_LIST_FILE);
    const user = getUserByName(users, username);
    if (!user) { throw new NotFoundError(`Could not find user with ${username}`); }

    user.accessLevels = accessLevels;
    await app.datastore.updateJson(USERS_LIST_FILE, users);
  } finally {
    releaseLock(app, lock);
  }
};
