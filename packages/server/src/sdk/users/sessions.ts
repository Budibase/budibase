import { builderSocket } from "../../websockets"
import { App, SocketSession } from "@budibase/types"

export const enrichApps = async (apps: App[]) => {
  // Sessions can only exist for dev app IDs
  const devAppIds = apps
    .filter((app: any) => app.status === "development")
    .map((app: any) => app.appId)

  // Get all sessions for all apps and enrich app list
  const sessions = await builderSocket?.getRoomSessions(devAppIds)
  if (sessions?.length) {
    let appSessionMap: Record<string, SocketSession[]> = {}
    sessions.forEach(session => {
      const room = session.room
      if (!room) {
        return
      }
      if (!appSessionMap[room]) {
        appSessionMap[room] = []
      }
      appSessionMap[room].push(session)
    })
    return apps.map(app => {
      // Shallow clone to avoid mutating original reference
      let enriched = { ...app }
      const sessions = appSessionMap[app.appId]
      if (sessions?.length) {
        enriched.sessions = sessions
      } else {
        delete enriched.sessions
      }
      return enriched
    })
  } else {
    return apps
  }
}
