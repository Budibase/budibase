import { derivedMemo } from "../../../utils"
import { derived } from "svelte/store"

export const deriveStores = context => {
  const { props, hasNonAutoColumn } = context
  const getProp = prop => derivedMemo(props, $props => $props[prop])

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

  // Derive features
  const config = derived(
    [props, hasNonAutoColumn],
    ([$props, $hasNonAutoColumn]) => {
      let config = {
        ...$props,

        // Additional granular features which we don't expose as props
        canEditPrimaryDisplay: $props.canEditColumns,
      }

      // Disable some features if we're editing a view
      if ($props.datasource?.type === "viewV2") {
        config.canEditPrimaryDisplay = false
        config.canEditColumns = false
      }

      // Disable adding rows if we don't have any valid columns
      if (!$hasNonAutoColumn) {
        config.canAddRows = false
      }

      return config
    }
  )

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
