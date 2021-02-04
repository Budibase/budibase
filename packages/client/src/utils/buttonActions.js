import { get } from "svelte/store"
import { enrichDataBinding, enrichDataBindings } from "./enrichDataBinding"
import { routeStore, builderStore } from "../store"
import { saveRow, deleteRow, executeQuery, triggerAutomation } from "../api"
import { ActionTypes } from "../constants"

const saveRowHandler = async (action, context) => {
  const { fields, providerId } = action.parameters
  if (providerId) {
    let draft = context[providerId]
    if (fields) {
      for (let [key, entry] of Object.entries(fields)) {
        draft[key] = await enrichDataBinding(entry.value, context)
      }
    }
    await saveRow(draft)
  }
}

const deleteRowHandler = async (action, context) => {
  const { tableId, revId, rowId } = action.parameters
  if (tableId && revId && rowId) {
    const [enrichTable, enrichRow, enrichRev] = await Promise.all([
      enrichDataBinding(tableId, context),
      enrichDataBinding(rowId, context),
      enrichDataBinding(revId, context),
    ])
    await deleteRow({
      tableId: enrichTable,
      rowId: enrichRow,
      revId: enrichRev,
    })
  }
}

const triggerAutomationHandler = async (action, context) => {
  const { fields } = action.parameters
  if (fields) {
    const params = {}
    for (let field in fields) {
      params[field] = await enrichDataBinding(fields[field].value, context)
    }
    await triggerAutomation(action.parameters.automationId, params)
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
    notify: true,
  })
}

const validateFormHandler = async (action, context) => {
  const { componentId } = action.parameters
  const fn = context[`${componentId}_${ActionTypes.ValidateForm}`]
  if (fn) {
    return await fn()
  }
}

const handlerMap = {
  ["Save Row"]: saveRowHandler,
  ["Delete Row"]: deleteRowHandler,
  ["Navigate To"]: navigationHandler,
  ["Execute Query"]: queryExecutionHandler,
  ["Trigger Automation"]: triggerAutomationHandler,
  ["Validate Form"]: validateFormHandler,
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
