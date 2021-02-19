import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"
import { backendUiStore, store } from "builderStore"
import { findComponentPath } from "./storeUtils"
import { makePropSafe } from "@budibase/string-templates"
import { TableNames } from "../constants"

// Regex to match all instances of template strings
const CAPTURE_VAR_INSIDE_TEMPLATE = /{{([^}]+)}}/g

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (asset, componentId) => {
  const contextBindings = getContextBindings(asset, componentId)
  const userBindings = getUserBindings()
  const urlBindings = getUrlBindings(asset, componentId)
  return [...contextBindings, ...userBindings, ...urlBindings]
}

/**
 * Gets all data provider components above a component.
 */
export const getDataProviderComponents = (asset, componentId) => {
  if (!asset || !componentId) {
    return []
  }

  // Get the component tree leading up to this component, ignoring the component
  // itself
  const path = findComponentPath(asset.props, componentId)
  path.pop()

  // Filter by only data provider components
  return path.filter(component => {
    const def = store.actions.components.getDefinition(component._component)
    return def?.dataProvider
  })
}

/**
 * Gets all data provider components above a component.
 */
export const getActionProviderComponents = (asset, componentId, actionType) => {
  if (!asset || !componentId) {
    return []
  }

  // Get the component tree leading up to this component, ignoring the component
  // itself
  const path = findComponentPath(asset.props, componentId)
  path.pop()

  // Filter by only data provider components
  return path.filter(component => {
    const def = store.actions.components.getDefinition(component._component)
    return def?.actions?.includes(actionType)
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
  const validSettingTypes = ["datasource", "table", "schema"]
  const datasourceSetting = def.settings.find(setting => {
    return validSettingTypes.includes(setting.type)
  })
  if (!datasourceSetting) {
    return null
  }

  // There are different types of setting which can be a datasource, for
  // example an actual datasource object, or a table ID string.
  // Convert the datasource setting into a proper datasource object so that
  // we can use it properly
  if (datasourceSetting.type === "table") {
    return {
      tableId: component[datasourceSetting?.key],
      type: "table",
    }
  } else {
    return component[datasourceSetting?.key]
  }
}

/**
 * Gets all bindable data properties from component data contexts.
 */
const getContextBindings = (asset, componentId) => {
  // Extract any components which provide data contexts
  const dataProviders = getDataProviderComponents(asset, componentId)
  let bindings = []

  // Create bindings for each data provider
  dataProviders.forEach(component => {
    const isForm = component._component.endsWith("/form")
    const datasource = getDatasourceForProvider(component)
    let tableName, schema

    // Forms are an edge case which do not need table schemas
    if (isForm) {
      schema = buildFormSchema(component)
      tableName = "Fields"
    } else {
      if (!datasource) {
        return
      }

      // Get schema and table for the datasource
      const info = getSchemaForDatasource(datasource, isForm)
      schema = info.schema
      tableName = info.table?.name

      // Add _id and _rev fields for certain types
      if (datasource.type === "table" || datasource.type === "link") {
        schema["_id"] = { type: "string" }
        schema["_rev"] = { type: "string" }
      }
    }
    if (!schema || !tableName) {
      return
    }

    const keys = Object.keys(schema).sort()

    // Create bindable properties for each schema field
    keys.forEach(key => {
      const fieldSchema = schema[key]
      // Replace certain bindings with a new property to help display components
      let runtimeBoundKey = key
      if (fieldSchema.type === "link") {
        runtimeBoundKey = `${key}_text`
      } else if (fieldSchema.type === "attachment") {
        runtimeBoundKey = `${key}_first`
      }

      bindings.push({
        type: "context",
        runtimeBinding: `${makePropSafe(component._id)}.${makePropSafe(
          runtimeBoundKey
        )}`,
        readableBinding: `${component._instanceName}.${tableName}.${key}`,
        // Field schema and provider are required to construct relationship
        // datasource options, based on bindable properties
        fieldSchema,
        providerId: component._id,
      })
    })
  })

  return bindings
}

/**
 * Gets all bindable properties from the logged in user.
 */
const getUserBindings = () => {
  let bindings = []
  const tables = get(backendUiStore).tables
  const userTable = tables.find(table => table._id === TableNames.USERS)
  const schema = {
    ...userTable.schema,
    _id: { type: "string" },
    _rev: { type: "string" },
  }
  const keys = Object.keys(schema).sort()
  keys.forEach(key => {
    const fieldSchema = schema[key]
    // Replace certain bindings with a new property to help display components
    let runtimeBoundKey = key
    if (fieldSchema.type === "link") {
      runtimeBoundKey = `${key}_text`
    } else if (fieldSchema.type === "attachment") {
      runtimeBoundKey = `${key}_first`
    }

    bindings.push({
      type: "context",
      runtimeBinding: `user.${runtimeBoundKey}`,
      readableBinding: `Current User.${key}`,
      // Field schema and provider are required to construct relationship
      // datasource options, based on bindable properties
      fieldSchema,
      providerId: "user",
    })
  })

  return bindings
}

/**
 * Gets all bindable properties from URL parameters.
 */
const getUrlBindings = asset => {
  const url = asset?.routing?.route ?? ""
  const split = url.split("/")
  let params = []
  split.forEach(part => {
    if (part.startsWith(":") && part.length > 1) {
      params.push(part.replace(/:/g, "").replace(/\?/g, ""))
    }
  })
  return params.map(param => ({
    type: "context",
    runtimeBinding: `url.${param}`,
    readableBinding: `URL.${param}`,
  }))
}

/**
 * Gets a schema for a datasource object.
 */
export const getSchemaForDatasource = (datasource, isForm = false) => {
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
      } else if (type === "query" && isForm) {
        schema = {}
        const params = table.parameters || []
        params.forEach(param => {
          if (param?.name) {
            schema[param.name] = { ...param, type: "string" }
          }
        })
      } else {
        schema = cloneDeep(table.schema)
      }
    }
  }
  return { schema, table }
}

/**
 * Builds a form schema given a form component.
 * A form schema is a schema of all the fields nested anywhere within a form.
 */
const buildFormSchema = component => {
  let schema = {}
  if (!component) {
    return schema
  }
  const def = store.actions.components.getDefinition(component._component)
  const fieldSetting = def?.settings?.find(
    setting => setting.key === "field" && setting.type.startsWith("field/")
  )
  if (fieldSetting && component.field) {
    const type = fieldSetting.type.split("field/")[1]
    if (type) {
      schema[component.field] = { name: component.field, type }
    }
  }
  component._children?.forEach(child => {
    const childSchema = buildFormSchema(child)
    schema = { ...schema, ...childSchema }
  })
  return schema
}

/**
 * utility function for the readableToRuntimeBinding and runtimeToReadableBinding.
 */
function bindingReplacement(bindableProperties, textWithBindings, convertTo) {
  const convertFrom =
    convertTo === "runtimeBinding" ? "readableBinding" : "runtimeBinding"
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
        newBoundValue = newBoundValue.replace(from, binding[convertTo])
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
  return bindingReplacement(
    bindableProperties,
    textWithBindings,
    "runtimeBinding"
  )
}

/**
 * Converts a runtime data binding into a readable data binding
 */
export function runtimeToReadableBinding(bindableProperties, textWithBindings) {
  return bindingReplacement(
    bindableProperties,
    textWithBindings,
    "readableBinding"
  )
}
