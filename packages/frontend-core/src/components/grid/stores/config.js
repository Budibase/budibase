import { writable } from "svelte/store"
import { derivedMemo } from "../../../utils"

export const createStores = context => {
  const config = writable(context.props)
  const getProp = prop => derivedMemo(config, $config => $config[prop])

  // Derive and memoize some props so that we can react to them in isolation
  const tableId = getProp("tableId")
  const initialSortColumn = getProp("initialSortColumn")
  const initialSortOrder = getProp("initialSortOrder")
  const initialFilter = getProp("initialFilter")
  const initialRowHeight = getProp("initialRowHeight")
  const schemaOverrides = getProp("schemaOverrides")
  const columnWhitelist = getProp("columnWhitelist")

  return {
    config,
    tableId,
    initialSortColumn,
    initialSortOrder,
    initialFilter,
    initialRowHeight,
    schemaOverrides,
    columnWhitelist,
  }
}
