import { derivedMemo } from "../../../utils"
import { derived } from "svelte/store"

export const createStores = context => {
  const { props } = context
  const getProp = prop => derivedMemo(props, $props => $props[prop])

  // Derive and memoize some props so that we can react to them in isolation
  const datasource = getProp("datasource")
  const initialSortColumn = getProp("initialSortColumn")
  const initialSortOrder = getProp("initialSortOrder")
  const initialFilter = getProp("initialFilter")
  const fixedRowHeight = getProp("fixedRowHeight")
  const schemaOverrides = getProp("schemaOverrides")
  const notifySuccess = getProp("notifySuccess")
  const notifyError = getProp("notifyError")
  const rowConditions = getProp("rowConditions")

  return {
    datasource,
    initialSortColumn,
    initialSortOrder,
    initialFilter,
    fixedRowHeight,
    schemaOverrides,
    notifySuccess,
    notifyError,
    rowConditions,
  }
}

export const deriveStores = context => {
  const { props, hasNonAutoColumn } = context

  // Derive features
  const config = derived(
    [props, hasNonAutoColumn],
    ([$props, $hasNonAutoColumn]) => {
      let config = { ...$props }
      const type = $props.datasource?.type

      // Disable some features if we're editing a view
      if (type === "viewV2") {
        config.canEditColumns = false
      }

      // Disable adding rows if we don't have any valid columns
      if (!$hasNonAutoColumn) {
        config.canAddRows = false
      }

      // Disable features for non DS+
      if (!["table", "viewV2"].includes(type)) {
        config.canAddRows = false
        config.canEditRows = false
        config.canDeleteRows = false
        config.canExpandRows = false
        config.canSaveSchema = false
        config.canEditColumns = false
      }

      return config
    }
  )

  return {
    config,
  }
}
