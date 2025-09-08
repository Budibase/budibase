import { constants, context, logging } from "@budibase/backend-core"
import { DocUpdateEvent, WorkspaceResourceEvents } from "@budibase/types"
import sdk from "../../sdk"
import { UpdateCallback } from "./processors"

const { AUTOMATION, DATASOURCE, TABLE, WORKSPACE_APP, QUERY, MEM_VIEW } =
  constants.DocumentType

export default function process(updateCb?: UpdateCallback) {
  const processor = async (update: DocUpdateEvent) => {
    try {
      const docId = update.id
      const appId = update.appId

      const isWSResource = [
        AUTOMATION,
        DATASOURCE,
        TABLE,
        WORKSPACE_APP,
        QUERY,
        MEM_VIEW,
      ].find(type => docId.startsWith(type))

      if (isWSResource!! && appId) {
        context.doInWorkspaceContext(appId, async () => {
          const result = await sdk.workspace.findByResourceId(docId)
          const [fav] = result
          if (fav) {
            // Purge
            await sdk.workspace.remove(fav._id, fav._rev)
          }
        })
      }

      if (updateCb) {
        updateCb(docId)
      }
    } catch (err: any) {
      // if something not found - no changes to perform
      if (err?.status === 404) {
        return
      }
      // The user has already been synced in another process
      else if (err?.status === 409) {
        return
      } else {
        logging.logAlert("Failed to sync workspace resource faves", err)
      }
    }
  }
  return { events: WorkspaceResourceEvents, processor }
}
