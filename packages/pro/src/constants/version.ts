import { env, objectStore, utils } from "@budibase/backend-core"

import fs from "fs"
import path from "path"

/**
 * Retrieve the version to store against a license.
 * In local dev, a random id is used instead to facilitate easy license refreshing.
 */
export const getLicenseVersion = () => {
  if (env.isDev()) {
    const DEV_VER_FILENAME = "dev-version.txt"
    const verFile = path.join(objectStore.budibaseTempDir(), DEV_VER_FILENAME)
    if (fs.existsSync(verFile)) {
      return fs.readFileSync(verFile, "utf8")
    } else {
      const devVer = utils.newid()
      fs.writeFileSync(verFile, devVer)
      return devVer
    }
  } else {
    return getProVersion()
  }
}

export const getProVersion = () => {
  const version = env.VERSION
  if (!version) {
    throw new Error("No budibase pro version was specified")
  }
  return version
}
