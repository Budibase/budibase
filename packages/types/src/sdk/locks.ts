export enum LockType {
  /**
   * If this lock is already held the attempted operation will not be performed.
   * No retries will take place and no error will be thrown.
   */
  TRY_ONCE = "try_once",
  DEFAULT = "default",
  DELAY_500 = "delay_500",
}

export enum LockName {
  MIGRATIONS = "migrations",
  TRIGGER_QUOTA = "trigger_quota",
  SYNC_ACCOUNT_LICENSE = "sync_account_license",
  UPDATE_TENANTS_DOC = "update_tenants_doc",
  PERSIST_WRITETHROUGH = "persist_writethrough",
}

export interface LockOptions {
  /**
   * The lock type determines which client to use
   */
  type: LockType
  /**
   * The name for the lock
   */
  name: LockName
  /**
   * The ttl to auto-expire the lock if not unlocked manually
   */
  ttl: number
  /**
   * The resource to the lock name
   */
  resource?: string
  /**
   * This is a system-wide lock - don't use tenancy in lock key
   */
  systemLock?: boolean
}
