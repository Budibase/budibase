import { _Object } from "@aws-sdk/client-s3"
import { db, objectStore } from "@budibase/backend-core"
import { utils } from "@budibase/shared-core"

export async function getAppObjectStorageContent(appId: string) {
  appId = db.getProdWorkspaceID(appId)

  const objects: Record<string, _Object> = {}
  await utils.parallelForeach(
    objectStore.listAllObjects(objectStore.ObjectStoreBuckets.APPS, appId),
    async file => {
      if (!file.Key) {
        throw new Error("file.Key must be defined")
      }

      objects[file.Key.replace(new RegExp(`^${appId}/`), "")] = file
    },
    5
  )
  return objects
}

export async function getAppObjectStorageEtags(appId: string) {
  const objects = await getAppObjectStorageContent(appId)

  const fileEtags = Object.entries(objects).reduce<Record<string, string>>(
    (etags, [key, object]) => {
      if (object.ETag) {
        etags[key] = object.ETag.replace(new RegExp('^"'), "").replace(
          new RegExp('"$'),
          ""
        )
      }
      return etags
    },
    {}
  )
  return fileEtags
}
