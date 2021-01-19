import { get } from "svelte/store"
import { backendUiStore, store } from "builderStore"
import { findAllMatchingComponents, findComponentPath } from "./storeUtils"

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (rootComponent, componentId) => {
  const bindableContexts = getBindableContexts(rootComponent, componentId)
  const bindableComponents = getBindableComponents(rootComponent)
  return [...bindableContexts, ...bindableComponents]
}

/**
 * Gets all bindable data contexts. These are fields of schemas of data contexts
 * provided by data provider components, such as lists or row detail components.
 */
export const getBindableContexts = (rootComponent, componentId) => {
  if (!rootComponent || !componentId) {
    return []
  }

  // Get the component tree leading up to this component
  const path = findComponentPath(rootComponent, componentId)
  path.pop()

  // Extract any components which provide data contexts
  const dataProviders = path.filter(component => {
    const def = store.actions.components.getDefinition(component._component)
    return def?.dataProvider
  })

  let contexts = []
  dataProviders.forEach(provider => {
    if (!provider.datasource) {
      return
    }
    const { schema, table } = getSchemaForDatasource(provider.datasource)
    const keys = Object.keys(schema).sort()
    keys.forEach(key => {
      const fieldSchema = schema[key]
      // Replace certain bindings with a new property to help display components
      let runtimeBoundKey = key
      if (fieldSchema.type === "link") {
        runtimeBoundKey = `${key}_count`
      } else if (fieldSchema.type === "attachment") {
        runtimeBoundKey = `${key}_first`
      }

      contexts.push({
        type: "context",
        runtimeBinding: `${provider._id}.${runtimeBoundKey}`,
        readableBinding: `${provider._instanceName}.${table.name}.${key}`,
        fieldSchema,
        providerId: provider._id,
        tableId: provider.datasource.tableId,
      })
    })
  })
  return contexts
}

/**
 * Gets all bindable components. These are form components which allow their
 * values to be bound to.
 */
export const getBindableComponents = rootComponent => {
  if (!rootComponent) {
    return []
  }
  const componentSelector = component => {
    const type = component._component
    const definition = store.actions.components.getDefinition(type)
    return definition?.bindable
  }
  const components = findAllMatchingComponents(rootComponent, componentSelector)
  return components.map(component => {
    return {
      type: "instance",
      providerId: component._id,
      runtimeBinding: `${component._id}`,
      readableBinding: `${component._instanceName}`,
    }
  })
}

/**
 * Gets a schema for a datasource object.
 */
const getSchemaForDatasource = datasource => {
  const tables = get(backendUiStore).tables
  const { type } = datasource
  const table = tables.find(table => table._id === datasource.tableId)
  let schema
  if (table) {
    if (type === "table") {
      schema = table.schema ?? {}
    } else if (type === "view") {
      schema = table.views?.[datasource.name]?.schema ?? {}
    } else if (type === "link") {
      schema = table.schema ?? {}
    }
  }
  if (schema) {
    // Add ID and rev fields for any valid datasources
    schema["_id"] = { type: "string" }
    schema["_rev"] = { type: "string " }
  } else {
    schema = {}
  }
  return { schema, table }
}
