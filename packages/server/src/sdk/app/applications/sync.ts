import env from "../../../environment"
import { db as dbCore, context } from "@budibase/backend-core"
import sdk from "../../"

export async function syncApp(
  appId: string,
  opts?: { automationOnly?: boolean }
) {
  if (env.DISABLE_AUTO_PROD_APP_SYNC) {
    return {
      message:
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable.",
    }
  }

  if (dbCore.isProdAppID(appId)) {
    throw new Error("This action cannot be performed for production apps")
  }

  // replicate prod to dev
  const prodAppId = dbCore.getProdAppID(appId)

  // specific case, want to make sure setup is skipped
  const prodDb = context.getProdAppDB({ skip_setup: true })
  const exists = await prodDb.exists()
  if (!exists) {
    // the database doesn't exist. Don't replicate
    return {
      message: "App sync not required, app not deployed.",
    }
  }

  const replication = new dbCore.Replication({
    source: prodAppId,
    target: appId,
  })
  let error
  try {
    const replOpts = replication.appReplicateOpts()
    if (opts?.automationOnly) {
      replOpts.filter = (doc: any) =>
        doc._id.startsWith(dbCore.DocumentType.AUTOMATION)
    }
    await replication.replicate(replOpts)
  } catch (err) {
    error = err
  } finally {
    await replication.close()
  }

  // sync the users
  await sdk.users.syncGlobalUsers()

  if (error) {
    throw error
  } else {
    return {
      message: "App sync completed successfully.",
    }
  }
}
