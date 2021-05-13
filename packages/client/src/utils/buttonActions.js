import { get } from "svelte/store"
import { routeStore, builderStore, authStore } from "../store"
import { saveRow, deleteRow, executeQuery, triggerAutomation } from "../api"
import { ActionTypes } from "../constants"

const saveRowHandler = async (action, context) => {
  const { fields, providerId } = action.parameters
  if (providerId) {
    let draft = context[providerId]
    if (fields) {
      for (let [field, value] of Object.entries(fields)) {
        draft[field] = value
      }
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
  if (action.parameters.url) {
    routeStore.actions.navigate(action.parameters.url)
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

const loginHandler = async action => {
  const { email, password } = action.parameters
  await authStore.actions.logIn({ email, password })
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
  ["Log In"]: loginHandler,
  ["Log Out"]: logoutHandler,
}

/**
 * Parses an array of actions and returns a function which will execute the
 * actions in the current context.
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
        const result = await handlers[i](actions[i], context)
        // A handler returning `false` is a flag to stop execution of handlers
        if (result === false) {
          return
        }
      } catch (error) {
        console.error("Error while executing button handler")
        console.error(error)
        // Stop executing on an error
        return
      }
    }
  }
}
