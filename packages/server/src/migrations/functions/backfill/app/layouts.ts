import { events } from "@budibase/backend-core"
import { getLayoutParams } from "../../../../db/utils"
import { Layout } from "@budibase/types"

const getLayouts = async (appDb: any): Promise<Layout[]> => {
  const response = await appDb.allDocs(
    getLayoutParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any, timestamp: string | number) => {
  const layouts: Layout[] = await getLayouts(appDb)

  for (const layout of layouts) {
    // exclude default layouts
    if (
      layout._id === "layout_private_master" ||
      layout._id === "layout_public_master"
    ) {
      continue
    }
    await events.layout.created(layout, timestamp)
  }

  return layouts.length
}
