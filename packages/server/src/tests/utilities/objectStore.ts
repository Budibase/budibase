import { db, objectStore } from "@budibase/backend-core"

export async function getAppObjectStorageEtags(appId: string) {
  appId = db.getProdWorkspaceID(appId)

  const objects = await objectStore.getAllFiles(
    objectStore.ObjectStoreBuckets.APPS,
    appId
  )

  const fileEtags = Object.entries(objects).reduce<Record<string, string>>(
    (etags, [key, object]) => {
      if (object.ETag) {
        etags[key.replace(new RegExp(`^${appId}/`), "")] = object.ETag.replace(
          new RegExp('^"'),
          ""
        ).replace(new RegExp('"$'), "")
      }
      return etags
    },
    {}
  )
  return fileEtags
}
