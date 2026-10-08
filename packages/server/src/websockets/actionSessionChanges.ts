import { db as dbCore } from "@budibase/backend-core"
import { PlatformActionSessionChange } from "@budibase/types"
import { builderSocket } from "./index"

export const notifyActionSessionChange = ({
  workspaceId,
  ...event
}: PlatformActionSessionChange) => {
  builderSocket?.emitActionSessionChange(
    dbCore.getDevWorkspaceID(workspaceId),
    event
  )
}
