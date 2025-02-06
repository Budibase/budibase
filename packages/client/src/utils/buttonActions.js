import { get } from "svelte/store"
import download from "downloadjs"
import { downloadStream } from "@budibase/frontend-core"
import {
  routeStore,
  builderStore,
  confirmationStore,
  authStore,
  stateStore,
  notificationStore,
  dataSourceStore,
  uploadStore,
  rowSelectionStore,
  sidePanelStore,
  modalStore,
} from "stores"
import { API } from "api"
import { ActionTypes } from "constants"
import { enrichDataBindings } from "./enrichDataBinding"
import { Helpers } from "@budibase/bbui"

// Default action handler, which extracts an action from context that was
// provided by another component and executes it with all action parameters
const contextActionHandler = async (action, context) => {
  const key = getActionContextKey(action)
  const fn = context[key]
  if (fn) {
    return await fn(action.parameters)
  }
}

// Generates the context key, which is the key that this action depends on in
// context to provide the function it will run. This is broken out as a util
// because we reuse this inside the core Component.svelte file to determine
// what the required action context keys are for all action settings.
export const getActionContextKey = action => {
  const type = action?.["##eventHandlerType"]
  const key = (componentId, type) => `${componentId}_${type}`
  switch (type) {
    case "Scroll To Field":
      return key(action.parameters.componentId, ActionTypes.ScrollTo)
    case "Update Field Value":
      return key(action.parameters.componentId, ActionTypes.UpdateFieldValue)
    case "Validate Form":
      return key(action.parameters.componentId, ActionTypes.ValidateForm)
    case "Refresh Data Provider":
      return key(action.parameters.componentId, ActionTypes.RefreshDatasource)
    case "Clear Form":
      return key(action.parameters.componentId, ActionTypes.ClearForm)
    case "Change Form Step":
      return key(action.parameters.componentId, ActionTypes.ChangeFormStep)
    case "Clear Row Selection":
      return key(action.parameters.componentId, ActionTypes.ClearRowSelection)
    default:
      return null
  }
}

// If button actions depend on context, they must declare which keys they need
export const getActionDependentContextKeys = action => {
  const type = action?.["##eventHandlerType"]
  switch (type) {
    case "Save Row":
    case "Duplicate Row":
      if (action.parameters?.providerId) {
        return [action.parameters.providerId]
      }
  }
  return []
}

const saveRowHandler = async (action, context) => {
  const { fields, providerId, tableId, notificationOverride } =
    action.parameters
  let payload
  if (providerId) {
    payload = { ...context[providerId] }
  } else {
    payload = {}
  }
  if (fields) {
    for (let [field, value] of Object.entries(fields)) {
      Helpers.deepSet(payload, field, value)
    }
  }
  if (tableId) {
    if (tableId.startsWith("view")) {
      payload._viewId = tableId
    } else {
      payload.tableId = tableId
    }
  }
  try {
    const row = await API.saveRow(payload)
    if (!notificationOverride) {
      notificationStore.actions.success("Row saved")
    }
    // Refresh related datasources
    await dataSourceStore.actions.invalidateDataSource(tableId, {
      invalidateRelationships: true,
    })
    return { row }
  } catch (error) {
    // Abort next actions
    return false
  }
}

const duplicateRowHandler = async (action, context) => {
  const { fields, providerId, tableId, notificationOverride } =
    action.parameters
  if (providerId) {
    let payload = { ...context[providerId] }
    if (fields) {
      for (let [field, value] of Object.entries(fields)) {
        Helpers.deepSet(payload, field, value)
      }
    }
    if (tableId) {
      if (tableId.startsWith("view")) {
        payload._viewId = tableId
      } else {
        payload.tableId = tableId
      }
    }
    delete payload._id
    delete payload._rev
    try {
      const row = await API.saveRow(payload)
      if (!notificationOverride) {
        notificationStore.actions.success("Row saved")
      }
      // Refresh related datasources
      await dataSourceStore.actions.invalidateDataSource(tableId, {
        invalidateRelationships: true,
      })
      return { row }
    } catch (error) {
      // Abort next actions
      return false
    }
  }
}

const fetchRowHandler = async action => {
  const { tableId, rowId } = action.parameters

  if (tableId && rowId) {
    try {
      const row = await API.fetchRow(tableId, rowId)

      return { row }
    } catch (error) {
      return false
    }
  }
}

const deleteRowHandler = async action => {
  const { tableId, rowId: rowConfig, notificationOverride } = action.parameters
  if (tableId && rowConfig) {
    try {
      let requestConfig

      let parsedRowConfig = []
      if (typeof rowConfig === "string") {
        try {
          parsedRowConfig = JSON.parse(rowConfig)
        } catch (e) {
          parsedRowConfig = rowConfig
            .split(",")
            .map(id => id.trim())
            .filter(id => id)
        }
      } else {
        parsedRowConfig = rowConfig
      }

      if (
        typeof parsedRowConfig === "object" &&
        parsedRowConfig.constructor === Object
      ) {
        requestConfig = [parsedRowConfig]
      } else if (Array.isArray(parsedRowConfig)) {
        requestConfig = parsedRowConfig
      } else if (Number.isInteger(parsedRowConfig)) {
        requestConfig = [String(parsedRowConfig)]
      }

      if (!requestConfig && !parsedRowConfig) {
        notificationStore.actions.warning("No valid rows were supplied")
        return false
      }

      const resp = await API.deleteRows(tableId, requestConfig)

      if (!notificationOverride) {
        notificationStore.actions.success(
          resp?.length == 1 ? "Row deleted" : `${resp.length} Rows deleted`
        )
      }

      // Refresh related datasources
      await dataSourceStore.actions.invalidateDataSource(tableId, {
        invalidateRelationships: true,
      })
    } catch (error) {
      console.error(error)
      notificationStore.actions.error(
        "An error occurred while executing the query"
      )
    }
  }
}

const triggerAutomationHandler = async action => {
  const { fields, notificationOverride, timeout } = action.parameters
  try {
    const result = await API.triggerAutomation(
      action.parameters.automationId,
      fields,
      timeout
    )

    // Value will exist if automation is synchronous, so return it.
    if (result.value) {
      if (!notificationOverride) {
        notificationStore.actions.success("Automation ran successfully")
      }
      return { result }
    }

    if (!notificationOverride) {
      notificationStore.actions.success("Automation triggered")
    }
  } catch (error) {
    // Abort next actions
    return false
  }
}
const navigationHandler = action => {
  let { url, peek, externalNewTab, type } = action.parameters

  // Ensure in-app navigation starts with a slash
  if (type === "screen" && url && !url.startsWith("/")) {
    url = `/${url}`
  }

  routeStore.actions.navigate(url, peek, externalNewTab)
  closeSidePanelHandler()
}

const queryExecutionHandler = async action => {
  const { queryId, queryParams, notificationOverride } = action.parameters
  try {
    const query = await API.fetchQueryDefinition(queryId)
    if (query?.datasourceId == null) {
      notificationStore.actions.error("That query couldn't be found")
      return false
    }
    const result = await API.executeQuery(queryId, {
      parameters: queryParams,
    })

    // Trigger a notification and invalidate the datasource as long as this
    // was not a readable query
    if (!query.readable) {
      if (!notificationOverride) {
        notificationStore.actions.success("Query executed successfully")
      }
      await dataSourceStore.actions.invalidateDataSource(query.datasourceId)
    }

    return { result }
  } catch (error) {
    notificationStore.actions.error(
      "An error occurred while executing the query"
    )

    // Abort next actions
    return false
  }
}

const logoutHandler = async action => {
  await authStore.actions.logOut()
  let redirectUrl = "/builder/auth/login"
  let internal = false
  if (action.parameters.redirectUrl) {
    internal = action.parameters.redirectUrl?.startsWith("/")
    redirectUrl = routeStore.actions.createFullURL(
      action.parameters.redirectUrl
    )
  }
  window.location.href = redirectUrl
  if (internal) {
    window.location.reload()
  }
}

const closeScreenModalHandler = action => {
  let url
  if (action?.parameters) {
    url = action.parameters.url
  }
  // Emit this as a window event, so parent screens which are iframing us in
  // can close the modal
  window.parent.postMessage({ type: "close-screen-modal", url })
}

const updateStateHandler = action => {
  const { type, key, value, persist } = action.parameters
  if (type === "set") {
    stateStore.actions.setValue(key, value, persist)
  } else if (type === "delete") {
    stateStore.actions.deleteValue(key)
  }

  // Emit this as an event so that parent windows which are iframing us in
  // can also update their state
  if (get(routeStore).queryParams?.peek) {
    window.parent.postMessage({
      type: "update-state",
      detail: { type, key, value, persist },
    })
  }
}

const s3UploadHandler = async action => {
  const { componentId } = action.parameters
  if (!componentId) {
    return
  }
  const res = await uploadStore.actions.processFileUpload(componentId)
  return {
    publicUrl: res?.publicUrl,
  }
}

/**
 * For new configs, "rows" is defined and enriched to be the array of rows to
 * export. For old configs it will be undefined and we need to use the legacy
 * row selection store in combination with the tableComponentId parameter.
 */
const exportDataHandler = async action => {
  let { tableComponentId, rows, type, columns, delimiter, customHeaders } =
    action.parameters
  let tableId

  // Handle legacy configs using the row selection store
  if (!rows?.length) {
    const selection = rowSelectionStore.actions.getSelection(tableComponentId)
    if (selection?.selectedRows?.length) {
      rows = selection.selectedRows
      tableId = selection.tableId
    }
  }

  // Get table ID from first row if needed
  if (!tableId) {
    tableId = rows?.[0]?.tableId
  }

  // Handle no rows selected
  if (!rows?.length) {
    notificationStore.actions.error("Please select at least one row")
  }
  // Handle case where we're not using a DS+
  else if (!tableId) {
    notificationStore.actions.error(
      "You can only export data from table datasources"
    )
  }
  // Happy path when we have both rows and table ID
  else {
    try {
      // Flatten rows if required
      if (typeof rows[0] !== "string") {
        rows = rows.map(row => row._id)
      }
      const data = await API.exportRows(tableId, type, {
        rows,
        columns: columns?.map(column => column.name || column),
        delimiter,
        customHeaders,
      })
      download(new Blob([data], { type: "text/plain" }), `${tableId}.${type}`)
    } catch (error) {
      notificationStore.actions.error("There was an error exporting the data")
    }
  }
}

const continueIfHandler = action => {
  const { type, value, operator, referenceValue } = action.parameters
  if (!type || !operator) {
    return
  }
  let match = false
  if (value == null && referenceValue == null) {
    match = true
  } else if (value === referenceValue) {
    match = true
  } else {
    match = JSON.stringify(value) === JSON.stringify(referenceValue)
  }
  if (type === "continue") {
    return operator === "equal" ? match : !match
  } else {
    return operator === "equal" ? !match : match
  }
}

const showNotificationHandler = action => {
  const { message, type, autoDismiss, duration } = action.parameters
  if (!message || !type) {
    return
  }
  notificationStore.actions[type]?.(message, autoDismiss, duration)
}

const promptUserHandler = () => {}

const openSidePanelHandler = action => {
  const { id } = action.parameters
  if (id) {
    sidePanelStore.actions.open(id)
  }
}

const closeSidePanelHandler = () => {
  sidePanelStore.actions.close()
}

const openModalHandler = action => {
  const { id } = action.parameters
  if (id) {
    modalStore.actions.open(id)
  }
}

const closeModalHandler = () => {
  modalStore.actions.close()
}

const downloadFileHandler = async action => {
  const { url, fileName } = action.parameters
  try {
    const { type } = action.parameters
    if (type === "attachment") {
      const { tableId, rowId, attachmentColumn } = action.parameters
      const res = await API.downloadAttachment(tableId, rowId, attachmentColumn)
      await downloadStream(res)
      return
    }

    const response = await fetch(url)

    if (!response.ok) {
      notificationStore.actions.error(
        `Failed to download from '${url}'. Server returned status code: ${response.status}`
      )
      return
    }

    const objectUrl = URL.createObjectURL(await response.blob())

    const link = document.createElement("a")
    link.href = objectUrl
    link.download = fileName
    link.click()

    URL.revokeObjectURL(objectUrl)
  } catch (e) {
    console.error(e)
    if (e.status) {
      notificationStore.actions.error(
        `Failed to download from '${url}'. Server returned status code: ${e.status}`
      )
    } else {
      notificationStore.actions.error(`Failed to download from '${url}'.`)
    }
  }
}

const rowActionHandler = async action => {
  const { resourceId, rowId, rowActionId } = action.parameters
  await API.rowActions.trigger(resourceId, rowActionId, rowId)
  // Refresh related datasources
  await dataSourceStore.actions.invalidateDataSource(resourceId, {
    invalidateRelationships: true,
  })
}

const handlerMap = {
  ["Fetch Row"]: fetchRowHandler,
  ["Save Row"]: saveRowHandler,
  ["Duplicate Row"]: duplicateRowHandler,
  ["Delete Row"]: deleteRowHandler,
  ["Navigate To"]: navigationHandler,
  ["Execute Query"]: queryExecutionHandler,
  ["Trigger Automation"]: triggerAutomationHandler,
  ["Log Out"]: logoutHandler,
  ["Close Screen Modal"]: closeScreenModalHandler,
  ["Update State"]: updateStateHandler,
  ["Upload File to S3"]: s3UploadHandler,
  ["Export Data"]: exportDataHandler,
  ["Continue if / Stop if"]: continueIfHandler,
  ["Show Notification"]: showNotificationHandler,
  ["Prompt User"]: promptUserHandler,
  ["Open Side Panel"]: openSidePanelHandler,
  ["Close Side Panel"]: closeSidePanelHandler,
  ["Open Modal"]: openModalHandler,
  ["Close Modal"]: closeModalHandler,
  ["Download File"]: downloadFileHandler,
  ["Row Action"]: rowActionHandler,
}

const confirmTextMap = {
  ["Delete Row"]: "Are you sure you want to delete this row?",
  ["Save Row"]: "Are you sure you want to save this row?",
  ["Execute Query"]: "Are you sure you want to execute this query?",
  ["Trigger Automation"]: "Are you sure you want to trigger this automation?",
  ["Prompt User"]: "Are you sure you want to continue?",
  ["Duplicate Row"]: "Are you sure you want to duplicate this row?",
}

/**
 * Parses an array of actions and returns a function which will execute the
 * actions in the current context.
 * A handler returning `false` is a flag to stop execution of handlers
 */
export const enrichButtonActions = (actions, context) => {
  // Prevent button actions in the builder preview
  if (!actions?.length || get(builderStore).inBuilder) {
    return null
  }

  // If this is a function then it has already been enriched
  if (typeof actions === "function") {
    return actions
  }

  // Get handlers for each action. If no bespoke handler is configured, fall
  // back to simply executing this action from context.
  const handlers = actions.map(def => {
    return handlerMap[def["##eventHandlerType"]] || contextActionHandler
  })

  return async eventContext => {
    // Button context is built up as actions are executed.
    // Inherit any previous button context which may have come from actions
    // before a confirmable action since this breaks the chain.
    let buttonContext = context.actions || []

    for (let i = 0; i < handlers.length; i++) {
      try {
        // Skip any non-existent action definitions
        if (!handlers[i]) {
          continue
        }

        // Built total context for this action
        const totalContext = {
          ...context,
          state: get(stateStore),
          actions: buttonContext,
          eventContext,
        }

        // Get and enrich this button action with the total context
        let action = actions[i]
        action = enrichDataBindings(action, totalContext)
        const callback = async () => handlers[i](action, totalContext)

        // If this action is confirmable, show confirmation and await a
        // callback to execute further actions
        if (action.parameters?.confirm) {
          return new Promise(resolve => {
            const defaultText = confirmTextMap[action["##eventHandlerType"]]
            const confirmText = action.parameters?.confirmText || defaultText

            const defaultTitleText = action["##eventHandlerType"]
            const customTitleText =
              action.parameters?.customTitleText || defaultTitleText
            const cancelButtonText =
              action.parameters?.cancelButtonText || "Cancel"
            const confirmButtonText =
              action.parameters?.confirmButtonText || "Confirm"

            confirmationStore.actions.showConfirmation(
              customTitleText,
              confirmText,
              async () => {
                // When confirmed, execute this action immediately,
                // then execute the rest of the actions in the chain
                const result = await callback()
                if (result !== false) {
                  // Generate a new total context for the next enrichment
                  buttonContext.push(result)
                  const newContext = { ...context, actions: buttonContext }

                  // Enrich and call the next button action if there is more
                  // than one action remaining
                  const next = enrichButtonActions(
                    actions.slice(i + 1),
                    newContext
                  )
                  if (typeof next === "function") {
                    // Pass the event context back into the new action chain
                    resolve(await next(eventContext))
                  } else {
                    resolve(true)
                  }
                } else {
                  resolve(false)
                }
              },
              () => {
                resolve(false)
              },
              confirmButtonText,
              cancelButtonText
            )
          })
        }

        // For non-confirmable actions, execute the handler immediately
        else {
          const result = await callback()
          if (result === false) {
            return
          } else {
            buttonContext.push(result)
          }
        }
      } catch (error) {
        console.error("Error while executing button handler")
        console.error(error)
        // Stop executing further actions on error
        return
      }
    }
  }
}
