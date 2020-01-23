import { find } from 'lodash/fp';
import { userAuthFile, parseTemporaryCode } from './authCommon';
import {
  isSomething, $, apiWrapper, apiWrapperSync, events,
} from '../common';
import { _getUsers } from './getUsers';
import { alwaysAuthorized } from './permissions';

export const isValidPassword = app => password => apiWrapperSync(
  app,
  events.authApi.isValidPassword,
  alwaysAuthorized,
  { password },
  _isValidPassword, app, password,
);

export const _isValidPassword = (app, password) => scorePassword(password).score > 30;

export const changeMyPassword = app => async (currentPw, newpassword) => apiWrapper(
  app,
  events.authApi.changeMyPassword,
  alwaysAuthorized,
  { currentPw, newpassword },
  _changeMyPassword, app, currentPw, newpassword,
);

export const _changeMyPassword = async (app, currentPw, newpassword) => {
  const existingAuth = await app.datastore.loadJson(
    userAuthFile(app.user.name),
  );

  if (isSomething(existingAuth.passwordHash)) {
    const verified = app.crypto.verify(
      existingAuth.passwordHash,
      currentPw,
    );

    if (verified) {
      await await doSet(
        app, existingAuth,
        app.user.name, newpassword,
      );
      return true;
    }
  }

  return false;
};

export const setPasswordFromTemporaryCode = app => async (tempCode, newpassword) => apiWrapper(
  app,
  events.authApi.setPasswordFromTemporaryCode,
  alwaysAuthorized,
  { tempCode, newpassword },
  _setPasswordFromTemporaryCode, app, tempCode, newpassword,
);


export const _setPasswordFromTemporaryCode = async (app, tempCode, newpassword) => {
  const currentTime = await app.getEpochTime();

  const temp = parseTemporaryCode(tempCode);

  const user = $(await _getUsers(app), [
    find(u => u.temporaryAccessId === temp.id),
  ]);

  if (!user) { return false; }

  const existingAuth = await app.datastore.loadJson(
    userAuthFile(user.name),
  );

  if (isSomething(existingAuth.temporaryAccessHash)
       && existingAuth.temporaryAccessExpiryEpoch > currentTime) {
    const verified = app.crypto.verify(
      existingAuth.temporaryAccessHash,
      temp.code,
    );

    if (verified) {
      await doSet(
        app, existingAuth,
        user.name, newpassword,
      );
      return true;
    }
  }

  return false;
};

const doSet = async (app, auth, username, newpassword) => {
  auth.temporaryAccessHash = '';
  auth.temporaryAccessExpiryEpoch = 0;
  auth.passwordHash = app.crypto.hash(
    newpassword,
  );
  await app.datastore.updateJson(
    userAuthFile(username),
    auth,
  );
};

export const scorePassword = app => password => apiWrapperSync(
  app,
  events.authApi.scorePassword,
  alwaysAuthorized,
  { password },
  _scorePassword, password,
);

export const _scorePassword = (password) => {
  // from https://stackoverflow.com/questions/948172/password-strength-meter
  // thank you https://stackoverflow.com/users/46617/tm-lv

  let score = 0;
  if (!password) { return score; }

  // award every unique letter until 5 repetitions
  const letters = new Object();
  for (let i = 0; i < password.length; i++) {
    letters[password[i]] = (letters[password[i]] || 0) + 1;
    score += 5.0 / letters[password[i]];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(password),
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    nonWords: /\W/.test(password),
  };

  let variationCount = 0;
  for (const check in variations) {
    variationCount += (variations[check] == true) ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  const strengthText = score > 80
    ? 'strong'
    : score > 60
      ? 'good'
      : score >= 30
        ? 'weak'
        : 'very weak';

  return {
    score: parseInt(score),
    strengthText,
  };
};
