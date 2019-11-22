import {
  safeKey, apiWrapper,
  events,
} from '../common';
import { _loadFromInfo } from './load';
import { transactionForDeleteRecord } from '../transactions/create';
import { permission } from '../authApi/permissions';
import { getRecordInfo } from "./recordInfo";

export const deleteRecord = (app, disableCleanup = false) => async key => {
  key = safeKey(key);
  return apiWrapper(
    app,
    events.recordApi.delete,
    permission.deleteRecord.isAuthorized(key),
    { key },
    _deleteRecord, app, key, disableCleanup,
  );
}

// called deleteRecord because delete is a keyword
export const _deleteRecord = async (app, key, disableCleanup) => {
  const recordInfo = getRecordInfo(app, key);
  key = recordInfo.key;

  const record = await _loadFromInfo(app, recordInfo);
  await transactionForDeleteRecord(app, record);

  await app.datastore.deleteFolder(recordInfo.dir);

  if (!disableCleanup) { await app.cleanupTransactions(); }
};




