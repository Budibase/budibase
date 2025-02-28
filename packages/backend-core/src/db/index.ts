import { dataFilters } from "@budibase/shared-core"

export * from "./couch"
export * from "./db"
export * from "./utils"
export * from "./views"
export * from "../docIds/conversions"
export { default as Replication } from "./Replication"
export const removeKeyNumbering = dataFilters.removeKeyNumbering
// exports to support old export structure
export * from "../constants/db"
export { getGlobalDBName, baseGlobalDBName } from "../context"
export * as searchIndexes from "./searchIndexes"
export * from "./errors"
