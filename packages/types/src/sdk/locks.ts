import Redlock from "redlock"

export enum LockType {
  /**
   * If this lock is already held the attempted operation will not be performed.
   * No retries will take place and no error will be thrown.
   */
  TRY_ONCE = "try_once",
  TRY_TWICE = "try_twice",
  DEFAULT = "default",
  DELAY_500 = "delay_500",
  CUSTOM = "custom",
}

export enum LockName {
  MIGRATIONS = "migrations",
  TRIGGER_QUOTA = "trigger_quota",
  SYNC_ACCOUNT_LICENSE = "sync_account_license",
  UPDATE_TENANTS_DOC = "update_tenants_doc",
  PERSIST_WRITETHROUGH = "persist_writethrough",
  QUOTA_USAGE_EVENT = "quota_usage_event",
}

export interface LockOptions {
  /**
   * The lock type determines which client to use
   */
  type: LockType
  /**
   * The custom options to use when creating the redlock instance
   * type must be set to custom for the options to be applied
   */
  customOptions?: Redlock.Options
  /**
   * The name for the lock
   */
  name: LockName
  /**
   * The ttl to auto-expire the lock if not unlocked manually. If undefined, the lock will be autoextending while the process is running.
   */
  ttl?: number
  /**
   * The individual resource to lock. This is useful for locking around very specific identifiers, e.g. a document that is prone to conflicts
   */
  resource?: string
  /**
   * This is a system-wide lock - don't use tenancy in lock key
   */
  systemLock?: boolean
}
