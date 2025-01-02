import { ViewV2 } from "@budibase/types"
import { UIFieldSchema } from "./table"

export interface UIView extends Omit<ViewV2, "type"> {
  type: string
  schema: Record<string, UIFieldSchema>
}
