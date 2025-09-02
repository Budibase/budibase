import { builderSocket } from "../../websockets"
import { Workspace, SocketSession } from "@budibase/types"

export const enrichWorkspaces = async (workspaces: Workspace[]) => {
  // Sessions can only exist for dev workspaces IDs
  const devIds = workspaces
    .filter(workspace => workspace.status === "development")
    .map(workspace => workspace.appId)

  // Get all sessions for all workspaces and enrich workspace list
  const sessions = await builderSocket?.getRoomSessions(devIds)
  if (sessions?.length) {
    let workspaceSessionMap: Record<string, SocketSession[]> = {}
    sessions.forEach(session => {
      const room = session.room
      if (!room) {
        return
      }
      if (!workspaceSessionMap[room]) {
        workspaceSessionMap[room] = []
      }
      workspaceSessionMap[room].push(session)
    })
    return workspaces.map(workspace => {
      // Shallow clone to avoid mutating original reference
      let enriched = { ...workspace }
      const sessions = workspaceSessionMap[workspace.appId]
      if (sessions?.length) {
        enriched.sessions = sessions
      } else {
        delete enriched.sessions
      }
      return enriched
    })
  } else {
    return workspaces
  }
}
