import { Table, WithRequired } from "@budibase/types"

export interface TableSchemaFromAI
  extends WithRequired<
    Pick<Table, "name" | "primaryDisplay" | "schema">,
    "primaryDisplay"
  > {
  _id: string
}
