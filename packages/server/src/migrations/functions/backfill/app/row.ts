import { events } from "@budibase/backend-core"
import { Row } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const rows: Row[] = []
  const count = rows.length
  events.rows.created(count)
}
