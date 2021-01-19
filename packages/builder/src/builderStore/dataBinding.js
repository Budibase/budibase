import { get } from "svelte/store"
import { backendUiStore, store } from "builderStore"
import { findAllMatchingComponents, findComponentPath } from "./storeUtils"

// Regex to match mustache variables, for replacing bindings
const CAPTURE_VAR_INSIDE_MUSTACHE = /{{([^}]+)}}/g

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

  // Get the component tree leading up to this component, ignoring the component
  // itself
  const path = findComponentPath(rootComponent, componentId)
  path.pop()

  // Enrich components with their definitions
  const enriched = path.map(component => ({
    instance: component,
    definition: store.actions.components.getDefinition(component._component),
  }))

  // Extract any components which provide data contexts
  const providers = enriched.filter(comp => comp.definition?.dataProvider)
  let contexts = []
  providers.forEach(({ definition, instance }) => {
    // Extract datasource from component instance
    const datasourceSetting = definition.settings.find(setting => {
      return setting.key === definition.datasourceSetting
    })
    if (!datasourceSetting) {
      return
    }

    // There are different types of setting which can be a datasource, for
    // example an actual datasource object, or a table ID string.
    // Convert the datasource setting into a proper datasource object so that
    // we can use it properly
    let datasource
    if (datasourceSetting.type === "datasource") {
      datasource = instance[datasourceSetting?.key]
    } else if (datasourceSetting.type === "table") {
      datasource = {
        tableId: instance[datasourceSetting?.key],
        type: "table",
      }
    }
    if (!datasource) {
      return
    }

    const { schema, table } = getSchemaForDatasource(datasource)
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
        runtimeBinding: `${instance._id}.${runtimeBoundKey}`,
        readableBinding: `${instance._instanceName}.${table.name}.${key}`,
        fieldSchema,
        providerId: instance._id,
        tableId: datasource.tableId,
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

/**
 * Converts a readable data binding into a runtime data binding
 */
export function readableToRuntimeBinding(bindableProperties, textWithBindings) {
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
