import {
  db as dbUtils,
  events,
  utils,
  context,
  tenancy,
} from "@budibase/backend-core"
import { Installation } from "@budibase/types"
import semver from "semver"

const pkg = require("../package.json")

export const getInstall = async (): Promise<Installation> => {
  return dbUtils.doWithDB(
    dbUtils.StaticDatabases.PLATFORM_INFO.name,
    async (platformDb: any) => {
      let install: Installation
      try {
        install = await platformDb.get(
          dbUtils.StaticDatabases.PLATFORM_INFO.docs.install
        )
      } catch (e: any) {
        if (e.status === 404) {
          install = {
            _id: dbUtils.StaticDatabases.PLATFORM_INFO.docs.install,
            installId: utils.newid(),
            version: pkg.version,
          }
          const resp = await platformDb.put(install)
          install._rev = resp.rev
        } else {
          throw e
        }
      }
      return install
    },
    {}
  )
}

const updateVersion = async (version: string): Promise<boolean> => {
  try {
    await dbUtils.doWithDB(
      dbUtils.StaticDatabases.PLATFORM_INFO.name,
      async (platformDb: any) => {
        const install = await getInstall()
        install.version = version
        await platformDb.put(install)
      },
      {}
    )
  } catch (e: any) {
    if (e.status === 409) {
      // do nothing - version has already been updated
      // likely in clustered environment
      return false
    }
    throw e
  }
  return true
}

export const checkInstallVersion = async (): Promise<void> => {
  const install = await getInstall()

  const currentVersion = install.version
  const newVersion = pkg.version

  if (currentVersion !== newVersion) {
    const isUpgrade = semver.gt(newVersion, currentVersion)
    const isDowngrade = semver.lt(newVersion, currentVersion)

    const success = await updateVersion(newVersion)

    if (success) {
      await context.doInUserContext(
        {
          _id: install.installId,
          isInstall: true,
          tenantId: tenancy.DEFAULT_TENANT_ID,
        },
        async () => {
          if (isUpgrade) {
            await events.version.upgraded(currentVersion, newVersion)
          } else if (isDowngrade) {
            await events.version.downgraded(currentVersion, newVersion)
          }
        }
      )
    }
  }
}
