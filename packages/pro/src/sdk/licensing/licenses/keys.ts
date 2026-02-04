import * as licenseClient from "./client"
import * as db from "../../../db"
import * as Cache from "../cache"
import tracer from "dd-trace"

export async function activateLicenseKey(licenseKey: string) {
  await licenseClient.activateLicenseKey(licenseKey)
  await db.licenseInfo.save({ licenseKey })
  await Cache.refresh()
}

export async function getLicenseKey(): Promise<string | undefined> {
  return await tracer.trace("getLicenseKey", async span => {
    const info = await db.licenseInfo.get()
    span.addTags({
      licenseKey: info.licenseKey,
    })
    return info.licenseKey
  })
}

export async function deleteLicenseKey() {
  return await tracer.trace("deleteLicenseKey", async () => {
    await db.licenseInfo.save({ licenseKey: undefined })
    await Cache.refresh()
  })
}
