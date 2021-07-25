import { get } from "svelte/store"
import { routeStore, builderStore, confirmationStore, authStore } from "../store"
import { saveRow, deleteRow, executeQuery, triggerAutomation } from "../api"
import { ActionTypes } from "../constants"

const saveRowHandler = async (action, context) => {
  const { fields, providerId, tableId } = action.parameters
  if (providerId) {
    let draft = context[providerId]
    if (fields) {
      for (let [field, value] of Object.entries(fields)) {
        draft[field] = value
      }
    }
    if (tableId) {
      draft.tableId = tableId
    }
    await saveRow(draft)
  }
}

const deleteRowHandler = async action => {
  const { tableId, revId, rowId } = action.parameters
  if (tableId && revId && rowId) {
    await deleteRow({ tableId, rowId, revId })
  }
}

const triggerAutomationHandler = async action => {
  const { fields } = action.parameters
  if (fields) {
    await triggerAutomation(action.parameters.automationId, fields)
  }
}

const navigationHandler = action => {
  const { url } = action.parameters
  if (url) {
    const external = !url.startsWith("/")
    if (external) {
      window.location.href = url
    } else {
      routeStore.actions.navigate(action.parameters.url)
    }
  }
}

const queryExecutionHandler = async action => {
  const { datasourceId, queryId, queryParams } = action.parameters
  await executeQuery({
    datasourceId,
    queryId,
    parameters: queryParams,
  })
}

const executeActionHandler = async (context, componentId, actionType) => {
  const fn = context[`${componentId}_${actionType}`]
  if (fn) {
    return await fn()
  }
}

const validateFormHandler = async (action, context) => {
  return await executeActionHandler(
    context,
    action.parameters.componentId,
    ActionTypes.ValidateForm
  )
}

const refreshDatasourceHandler = async (action, context) => {
  return await executeActionHandler(
    context,
    action.parameters.componentId,
    ActionTypes.RefreshDatasource
  )
}

const logoutHandler = async () => {
  await authStore.actions.logOut()
}

const handlerMap = {
  ["Save Row"]: saveRowHandler,
  ["Delete Row"]: deleteRowHandler,
  ["Navigate To"]: navigationHandler,
  ["Execute Query"]: queryExecutionHandler,
  ["Trigger Automation"]: triggerAutomationHandler,
  ["Validate Form"]: validateFormHandler,
  ["Refresh Datasource"]: refreshDatasourceHandler,
  ["Log Out"]: logoutHandler,
}

const confirmTextMap = {
  ["Delete Row"]: "Are you sure you want to delete this row?",
  ["Save Row"]: "Are you sure you want to save this row?",
  ["Execute Query"]: "Are you sure you want to execute this query?",
  ["Trigger Automation"]: "Are you sure you want to trigger this automation?",
}

/**
 * Parses an array of actions and returns a function which will execute the
 * actions in the current context.
 * A handler returning `false` is a flag to stop execution of handlers
 */
export const enrichButtonActions = (actions, context) => {
  // Prevent button actions in the builder preview
  if (get(builderStore).inBuilder) {
    return () => {}
  }
  const handlers = actions.map(def => handlerMap[def["##eventHandlerType"]])
  return async () => {
    for (let i = 0; i < handlers.length; i++) {
      try {
        const action = actions[i]
        const callback = async () => handlers[i](action, context)

        // If this action is confirmable, show confirmation and await a
        // callback to execute further actions
        if (action.parameters?.confirm) {
          const defaultText = confirmTextMap[action["##eventHandlerType"]]
          const confirmText = action.parameters?.confirmText || defaultText
          confirmationStore.actions.showConfirmation(
            action["##eventHandlerType"],
            confirmText,
            async () => {
              // When confirmed, execute this action immediately,
              // then execute the rest of the actions in the chain
              const result = await callback()
              if (result !== false) {
                const next = enrichButtonActions(actions.slice(i + 1), context)
                await next()
              }
            }
          )

          // Stop enriching actions when encountering a confirmable action,
          // as the callback continues the action chain
          return
        }

        // For non-confirmable actions, execute the handler immediately
        else {
          const result = await callback()
          if (result === false) {
            return
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
