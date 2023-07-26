import { writable } from "svelte/store"
import { derivedMemo } from "../../../utils"

export const createStores = context => {
  const config = writable(context.props)
  const getProp = prop => derivedMemo(config, $config => $config[prop])

  // Derive and memoize some props so that we can react to them in isolation
  const datasource = getProp("datasource")
  const initialSortColumn = getProp("initialSortColumn")
  const initialSortOrder = getProp("initialSortOrder")
  const initialFilter = getProp("initialFilter")
  const fixedRowHeight = getProp("fixedRowHeight")
  const schemaOverrides = getProp("schemaOverrides")
  const columnWhitelist = getProp("columnWhitelist")
  const notifySuccess = getProp("notifySuccess")
  const notifyError = getProp("notifyError")

  return {
    config,
    datasource,
    initialSortColumn,
    initialSortOrder,
    initialFilter,
    fixedRowHeight,
    schemaOverrides,
    columnWhitelist,
    notifySuccess,
    notifyError,
  }
}
