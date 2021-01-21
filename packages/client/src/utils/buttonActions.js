import { enrichDataBinding, enrichDataBindings } from "./enrichDataBinding"
import { routeStore } from "../store"
import { saveRow, deleteRow, executeQuery, triggerAutomation } from "../api"

const saveRowHandler = async (action, context) => {
  let draft = context[`${action.parameters.contextPath}_draft`]
  if (action.parameters.fields) {
    for (let [key, entry] of Object.entries(action.parameters.fields)) {
      draft[key] = await enrichDataBinding(entry.value, context)
    }
  }
  await saveRow(draft)
}

const deleteRowHandler = async (action, context) => {
  const { tableId, revId, rowId } = action.parameters
  const [ enrichTable, enrichRow, enrichRev ] = await Promise.all([
    enrichDataBinding(tableId, context),
    enrichDataBinding(rowId, context),
    enrichDataBinding(revId, context)
  ])
  await deleteRow({
    tableId: enrichTable,
    rowId: enrichRow,
    revId: enrichRev,
  })
}

const triggerAutomationHandler = async (action, context) => {
  const params = {}
  for (let field in action.parameters.fields) {
    params[field] = await enrichDataBinding(
      action.parameters.fields[field].value,
      context
    )
  }
  await triggerAutomation(action.parameters.automationId, params)
}

const navigationHandler = action => {
  routeStore.actions.navigate(action.parameters.url)
}

const queryExecutionHandler = async (action, context) => {
  const { datasourceId, queryId, queryParams } = action.parameters

  const enrichedQueryParameters = enrichDataBindings(queryParams, context)

  await executeQuery({
    datasourceId,
    queryId,
    parameters: enrichedQueryParameters,
  })
}

const handlerMap = {
  ["Save Row"]: saveRowHandler,
  ["Delete Row"]: deleteRowHandler,
  ["Navigate To"]: navigationHandler,
  ["Execute Query"]: queryExecutionHandler,
  ["Trigger Automation"]: triggerAutomationHandler,
}

/**
 * Parses an array of actions and returns a function which will execute the
 * actions in the current context.
 */
export const enrichButtonActions = (actions, context) => {
  const handlers = actions.map(def => handlerMap[def["##eventHandlerType"]])
  return async () => {
    for (let i = 0; i < handlers.length; i++) {
      await handlers[i](actions[i], context)
    }
  }
}
