import { StaticDatabases } from "../constants"
import { getDB } from "../db/db"

export function getPlatformDB() {
  return getDB(StaticDatabases.PLATFORM_INFO.name)
}
