import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"
import { backendUiStore, store } from "builderStore"
import { findAllMatchingComponents, findComponentPath } from "./storeUtils"

// Regex to match mustache variables, for replacing bindings
const CAPTURE_VAR_INSIDE_MUSTACHE = /{{([^}]+)}}/g

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (rootComponent, componentId) => {
  const contextBindings = getContextBindings(rootComponent, componentId)
  const queryBindings = getQueryBindings(rootComponent, componentId)
  const componentBindings = getComponentBindings(rootComponent)
  return [...contextBindings, ...queryBindings, componentBindings]
}

/**
 * Gets all data provider components above a component.
 */
export const getDataProviderComponents = (rootComponent, componentId) => {
  if (!rootComponent || !componentId) {
    return []
  }

  // Get the component tree leading up to this component, ignoring the component
  // itself
  const path = findComponentPath(rootComponent, componentId)
  path.pop()

  // Filter by only data provider components
  return path.filter(component => {
    const def = store.actions.components.getDefinition(component._component)
    return def?.dataProvider
  })
}

/**
 * Gets a datasource object for a certain data provider component
 */
export const getDatasourceForProvider = component => {
  const def = store.actions.components.getDefinition(component?._component)
  if (!def) {
    return null
  }

  // Extract datasource from component instance
  const datasourceSetting = def.settings.find(setting => {
    return setting.key === def.datasourceSetting
  })
  if (!datasourceSetting) {
    return null
  }

  // There are different types of setting which can be a datasource, for
  // example an actual datasource object, or a table ID string.
  // Convert the datasource setting into a proper datasource object so that
  // we can use it properly
  if (datasourceSetting.type === "datasource") {
    return component[datasourceSetting?.key]
  } else if (datasourceSetting.type === "table") {
    return {
      tableId: component[datasourceSetting?.key],
      type: "table",
    }
  }
  return null
}

/**
 * Gets all bindable data contexts. These are fields of schemas of data contexts
 * provided by data provider components, such as lists or row detail components.
 */
export const getContextBindings = (rootComponent, componentId) => {
  // Extract any components which provide data contexts
  const dataProviders = getDataProviderComponents(rootComponent, componentId)
  let contextBindings = []
  dataProviders.forEach(component => {
    const datasource = getDatasourceForProvider(component)
    if (!datasource) {
      return
    }

    // Get schema and add _id and _rev fields
    let { schema, table } = getSchemaForDatasource(datasource)
    schema["_id"] = { type: "string" }
    schema["_rev"] = { type: "string " }
    const keys = Object.keys(schema).sort()

    // Create bindable properties for each schema field
    keys.forEach(key => {
      const fieldSchema = schema[key]
      // Replace certain bindings with a new property to help display components
      let runtimeBoundKey = key
      if (fieldSchema.type === "link") {
        runtimeBoundKey = `${key}_count`
      } else if (fieldSchema.type === "attachment") {
        runtimeBoundKey = `${key}_first`
      }

      contextBindings.push({
        type: "context",
        runtimeBinding: `${component._id}.${runtimeBoundKey}`,
        readableBinding: `${component._instanceName}.${table.name}.${key}`,
        fieldSchema,
        providerId: component._id,
        tableId: datasource.tableId,
        field: key,
      })
    })
  })
  return contextBindings
}

/**
 * Gets all bindable components. These are form components which allow their
 * values to be bound to.
 */
export const getComponentBindings = rootComponent => {
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
 * Gets all bindable query fields. These are fields of schemas of data contexts
 * provided by data provider components, such as lists or row detail components.
 */
export const getQueryBindings = (rootComponent, componentId) => {
  // Extract any components which provide data contexts
  const dataProviders = getDataProviderComponents(rootComponent, componentId)
  const queries = get(backendUiStore).queries
  let queryBindings = []
  dataProviders.forEach(component => {
    const datasource = getDatasourceForProvider(component)
    if (!datasource) {
      return
    }

    // Find a query for this table ID
    const queryId = datasource.tableId
    const query = queries.find(query => query._id === queryId)
    const schema = query?.schema
    if (!schema) {
      return
    }

    // Add all schema fields as bindable values
    const keys = Object.keys(schema).sort()
    keys.forEach(key => {
      const fieldSchema = schema[key]
      queryBindings.push({
        type: "context",
        fieldSchema,
        runtimeBinding: `${component._id}.${key}`,
        readableBinding: `${component._instanceName}.${query.name}.${key}`,
        providerId: component._id,
        tableId: datasource.tableId,
        field: key,
      })
    })
  })
  return queryBindings
}

/**
 * Gets a schema for a datasource object.
 */
export const getSchemaForDatasource = datasource => {
  let schema, table
  if (datasource) {
    const tables = get(backendUiStore).tables
    const { type } = datasource
    table = tables.find(table => table._id === datasource.tableId)
    if (table) {
      if (type === "table") {
        schema = cloneDeep(table.schema)
      } else if (type === "view") {
        schema = cloneDeep(table.views?.[datasource.name]?.schema)
      } else if (type === "link") {
        schema = cloneDeep(table.schema)
      }
    }
  }
  return { schema, table }
}

/**
 * Converts a readable data binding into a runtime data binding
 */
export function readableToRuntimeBinding(bindableProperties, textWithBindings) {
  if (typeof textWithBindings !== "string") {
    return textWithBindings
  }
  const boundValues = textWithBindings.match(CAPTURE_VAR_INSIDE_MUSTACHE) || []
  let result = textWithBindings
  boundValues.forEach(boundValue => {
    const binding = bindableProperties.find(({ readableBinding }) => {
      return boundValue === `{{ ${readableBinding} }}`
    })
    if (binding) {
      result = result.replace(boundValue, `{{ ${binding.runtimeBinding} }}`)
    }
  })
  return result
}

/**
 * Converts a runtime data binding into a readable data binding
 */
export function runtimeToReadableBinding(bindableProperties, textWithBindings) {
  if (typeof textWithBindings !== "string") {
    return textWithBindings
  }
  const boundValues = textWithBindings.match(CAPTURE_VAR_INSIDE_MUSTACHE) || []
  let result = textWithBindings
  boundValues.forEach(boundValue => {
    const binding = bindableProperties.find(({ runtimeBinding }) => {
      return boundValue === `{{ ${runtimeBinding} }}`
    })
    // Show invalid bindings as invalid rather than a long ID
    result = result.replace(
      boundValue,
      `{{ ${binding?.readableBinding ?? "Invalid binding"} }}`
    )
  })
  return result
}
