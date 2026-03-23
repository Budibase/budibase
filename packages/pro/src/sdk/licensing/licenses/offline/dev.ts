import { env } from "@budibase/backend-core"
import { join } from "path"
import { tmpdir } from "os"
import { License } from "@budibase/types"
import fs from "fs"
import * as signing from "./signing"

const SUB_DIRECTORY = env.isTest() ? ".budibase-test" : ".budibase"
const DIRECTORY = join(tmpdir(), SUB_DIRECTORY)

const OFFLINE_LICENSE_FILE = "dev_license.txt"
const LICENSE_FILE_PATH = join(DIRECTORY, OFFLINE_LICENSE_FILE)

if (!fs.existsSync(DIRECTORY)) {
  try {
    fs.mkdirSync(DIRECTORY)
  } catch (err) {
    // ignore error - can happen in testing
  }
}

export function getOfflineLicense(): License | undefined {
  try {
    if (fs.existsSync(LICENSE_FILE_PATH)) {
      const token = fs.readFileSync(LICENSE_FILE_PATH, { encoding: "utf-8" })
      return signing.verifyLicenseToken(token)
    }
  } catch (e) {
    console.error("Error retrieving offline license from disk", e)
  }
}

export function writeDevLicenseToDisk(licenseToken: string) {
  console.log(`Writing license to: ${LICENSE_FILE_PATH}`)
  fs.writeFileSync(LICENSE_FILE_PATH, licenseToken, { encoding: "utf-8" })
}

export function deleteDevLicense() {
  fs.rmSync(LICENSE_FILE_PATH, { force: true })
}
