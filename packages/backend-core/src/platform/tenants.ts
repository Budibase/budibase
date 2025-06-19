import { StaticDatabases } from "../constants"
import { getPlatformDB } from "./platformDb"
import { LockName, LockOptions, LockType, Tenants } from "@budibase/types"
import * as locks from "../redis/redlockImpl"

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants

export const tenacyLockOptions: LockOptions = {
  type: LockType.DEFAULT,
  name: LockName.UPDATE_TENANTS_DOC,
  ttl: 10 * 1000, // auto expire after 10 seconds
  systemLock: true,
}

// READ

export async function getTenantIds(): Promise<string[]> {
  const tenants = await getTenants()
  return tenants.tenantIds
}

async function getTenants(): Promise<Tenants> {
  const db = getPlatformDB()
  const tenants = await db.get<Tenants>(TENANT_DOC)
  if (tenants) {
    return tenants
  }

  return await createTenantsDoc()
}

export async function exists(tenantId: string) {
  const tenants = await getTenants()
  return tenants.tenantIds.indexOf(tenantId) !== -1
}

// CREATE / UPDATE

function newTenantsDoc(): Tenants {
  return {
    _id: TENANT_DOC,
    tenantIds: [],
  }
}

async function createTenantsDoc(): Promise<Tenants> {
  const db = getPlatformDB()
  const tenants = newTenantsDoc()

  try {
    const response = await db.put(tenants)
    tenants._rev = response.rev
  } catch (e: any) {
    // 409 happens if the doc has been created elsewhere
    if (e.status === 409) {
      const existing = await db.get<Tenants>(TENANT_DOC)
      if (!existing) {
        // Shouldn't really happen, but if it does we'll throw the error.
        throw e
      }
      return existing
    }
    throw e
  }

  return tenants
}

export async function addTenant(tenantId: string) {
  const db = getPlatformDB()

  // use a lock as tenant creation is conflict prone
  await locks.doWithLock(tenacyLockOptions, async () => {
    const tenants = await getTenants()

    // write the new tenant if it doesn't already exist
    if (tenants.tenantIds.indexOf(tenantId) === -1) {
      tenants.tenantIds.push(tenantId)
      await db.put(tenants)
    }
  })
}

// DELETE

export async function removeTenant(tenantId: string) {
  try {
    await locks.doWithLock(tenacyLockOptions, async () => {
      const db = getPlatformDB()
      const tenants = await getTenants()
      tenants.tenantIds = tenants.tenantIds.filter(id => id !== tenantId)
      await db.put(tenants)
    })
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} from info db`, err)
    throw err
  }
}
