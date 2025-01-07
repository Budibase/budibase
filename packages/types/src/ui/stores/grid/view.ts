import { ViewV2 } from "@budibase/types"
import { UIFieldSchema } from "./table"

export interface UIView extends ViewV2 {
  schema: Record<string, UIFieldSchema>
}
