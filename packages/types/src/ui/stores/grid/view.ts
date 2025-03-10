import type { ViewV2 } from "@budibase/types"
import type { UIFieldSchema } from "./table"

export interface UIView extends ViewV2 {
  schema: Record<string, UIFieldSchema>
}
