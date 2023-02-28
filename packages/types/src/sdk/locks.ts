export enum LockType {
  /**
   * If this lock is already held the attempted operation will not be performed.
   * No retries will take place and no error will be thrown.
   */
  TRY_ONCE = "try_once",
  DEFAULT = "default",
  DELAY_500 = "delay_500",
}

export class LockName {
  static readonly MIGRATIONS = new LockName("migrations")
  static readonly TRIGGER_QUOTA = new LockName("trigger_quota")
  static readonly SYNC_ACCOUNT_LICENSE = new LockName("sync_account_license")
  static readonly UPDATE_TENANTS_DOC = new LockName("update_tenants_doc")
  static readonly PERSIST_WRITETHROUGH = (key: string) =>
    new LockName(`persist_writethrough_${key}`)

  constructor(public readonly value: string) {}

  valueOf() {
    return this.value
  }
  toString() {
    return this.valueOf()
  }
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
   * The suffix to add to the lock name for additional uniqueness
   */
  nameSuffix?: string
  /**
   * This is a system-wide lock - don't use tenancy in lock key
   */
  systemLock?: boolean
}
