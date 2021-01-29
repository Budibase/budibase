import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"
import { backendUiStore, store } from "builderStore"
import { findAllMatchingComponents, findComponentPath } from "./storeUtils"
import { makePropSafe } from "@budibase/string-templates"

// Regex to match all instances of template strings
const CAPTURE_VAR_INSIDE_TEMPLATE = /{{([^}]+)}}/g
const INVALID_BINDING = "{{ invalid binding }}"

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (rootComponent, componentId) => {
  const contextBindings = getContextBindings(rootComponent, componentId)
  const componentBindings = getComponentBindings(rootComponent)
  return [...contextBindings, ...componentBindings]
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
    return setting.type === "datasource" || setting.type === "table"
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

    // Get schema and add _id and _rev fields for certain types
    let { schema, table } = getSchemaForDatasource(datasource)
    if (!schema || !table) {
      return
    }
    if (datasource.type === "table" || datasource.type === "link") {
      schema["_id"] = { type: "string" }
      schema["_rev"] = { type: "string " }
    }
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
        runtimeBinding: `${makePropSafe(component._id)}.${makePropSafe(
          runtimeBoundKey
        )}`,
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
      runtimeBinding: `${makePropSafe(component._id)}`,
      readableBinding: `${component._instanceName}`,
    }
  })
}

/**
 * Gets a schema for a datasource object.
 */
export const getSchemaForDatasource = datasource => {
  let schema, table
  if (datasource) {
    const { type } = datasource
    if (type === "query") {
      const queries = get(backendUiStore).queries
      table = queries.find(query => query._id === datasource._id)
    } else {
      const tables = get(backendUiStore).tables
      table = tables.find(table => table._id === datasource.tableId)
    }
    if (table) {
      if (type === "view") {
        schema = cloneDeep(table.views?.[datasource.name]?.schema)
      } else {
        schema = cloneDeep(table.schema)
      }
    }
  }
  return { schema, table }
}

/**
 * utility function for the readableToRuntimeBinding and runtimeToReadableBinding.
 */
function bindingReplacement(bindableProperties, textWithBindings, convertTo) {
  const convertFrom = convertTo === "runtimeBinding" ? "readableBinding" : "runtimeBinding"
  if (typeof textWithBindings !== "string") {
    return textWithBindings
  }
  const convertFromProps = bindableProperties
    .map(el => el[convertFrom])
    .sort((a, b) => {
      return b.length - a.length
    })
  const boundValues = textWithBindings.match(CAPTURE_VAR_INSIDE_TEMPLATE) || []
  let result = textWithBindings
  for (let boundValue of boundValues) {
    let newBoundValue = boundValue
    for (let from of convertFromProps) {
      if (newBoundValue.includes(from)) {
        const binding = bindableProperties.find(el => el[convertFrom] === from)
        newBoundValue = newBoundValue.replace(
          from,
          binding[convertTo],
        )
      }
    }
    result = result.replace(boundValue, newBoundValue)
  }
  return result
}

/**
 * Converts a readable data binding into a runtime data binding
 */
export function readableToRuntimeBinding(bindableProperties, textWithBindings) {
  return bindingReplacement(bindableProperties, textWithBindings, "runtimeBinding")
}

/**
 * Converts a runtime data binding into a readable data binding
 */
export function runtimeToReadableBinding(bindableProperties, textWithBindings) {
  return bindingReplacement(bindableProperties, textWithBindings, "readableBinding")
}
