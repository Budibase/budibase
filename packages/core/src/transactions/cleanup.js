import { map } from 'lodash/fp';
import { retrieve } from './retrieve';
import { executeTransactions } from './execute';
import {
  $, joinKey, getLock, isNolock, releaseLock,
} from '../common';
import {
  LOCK_FILE_KEY, TRANSACTIONS_FOLDER,
  timeoutMilliseconds, getTransactionId,
  maxLockRetries,
} from './transactionsCommon';

export const cleanup = async (app) => {
  const lock = await getTransactionLock(app);
  if (isNolock(lock)) return;

  try {
    const transactions = await retrieve(app);
    if (transactions.length > 0) {
      await executeTransactions(app)(transactions);

      const folder = transactions.folderKey
        ? transactions.folderKey
        : TRANSACTIONS_FOLDER;

      const deleteFiles = $(transactions, [
        map(t => joinKey(
          folder,
          getTransactionId(
            t.recordId, t.transactionType,
            t.uniqueId,
          ),
        )),
        map(app.datastore.deleteFile),
      ]);

      await Promise.all(deleteFiles);
    }
  } finally {
    await releaseLock(app, lock);
  }
};

const getTransactionLock = async app => await getLock(
  app, LOCK_FILE_KEY,
  timeoutMilliseconds, maxLockRetries,
);
