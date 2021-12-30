import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"
import {
  findAllMatchingComponents,
  findComponent,
  findComponentPath,
  getComponentSettings,
} from "./storeUtils"
import { store } from "builderStore"
import { queries as queriesStores, tables as tablesStore } from "stores/backend"
import {
  makePropSafe,
  isJSBinding,
  decodeJSBinding,
  encodeJSBinding,
} from "@budibase/string-templates"
import { TableNames } from "../constants"

// Regex to match all instances of template strings
const CAPTURE_VAR_INSIDE_TEMPLATE = /{{([^}]+)}}/g
const CAPTURE_VAR_INSIDE_JS = /\$\("([^")]+)"\)/g
const CAPTURE_HBS_TEMPLATE = /{{[\S\s]*?}}/g

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (asset, componentId) => {
  const contextBindings = getContextBindings(asset, componentId)
  const userBindings = getUserBindings()
  const urlBindings = getUrlBindings(asset)
  const deviceBindings = getDeviceBindings()
  const stateBindings = getStateBindings()
  return [
    ...contextBindings,
    ...urlBindings,
    ...stateBindings,
    ...userBindings,
    ...deviceBindings,
  ]
}

/**
 * Gets the bindable properties exposed by a certain component.
 */
export const getComponentBindableProperties = (asset, componentId) => {
  if (!asset || !componentId) {
    return []
  }

  // Ensure that the component exists and exposes context
  const component = findComponent(asset.props, componentId)
  const def = store.actions.components.getDefinition(component?._component)
  if (!def?.context) {
    return []
  }

  // Get the bindings for the component
  return getProviderContextBindings(asset, component)
}

/**
 * Gets all data provider components above a component.
 */
export const getContextProviderComponents = (asset, componentId, type) => {
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
    if (!def?.context) {
      return false
    }

    // If no type specified, return anything that exposes context
    if (!type) {
      return true
    }

    // Otherwise only match components with the specific context type
    const contexts = Array.isArray(def.context) ? def.context : [def.context]
    return contexts.find(context => context.type === type) != null
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
export const getDatasourceForProvider = (asset, component) => {
  const settings = getComponentSettings(component?._component)

  // If this component has a dataProvider setting, go up the stack and use it
  const dataProviderSetting = settings.find(setting => {
    return setting.type === "dataProvider"
  })
  if (dataProviderSetting) {
    const settingValue = component[dataProviderSetting.key]
    const providerId = extractLiteralHandlebarsID(settingValue)
    const provider = findComponent(asset.props, providerId)
    return getDatasourceForProvider(asset, provider)
  }

  // Extract datasource from component instance
  const validSettingTypes = ["dataSource", "table", "schema"]
  const datasourceSetting = settings.find(setting => {
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
  const dataProviders = getContextProviderComponents(asset, componentId)

  // Generate bindings for all matching components
  return getProviderContextBindings(asset, dataProviders)
}

/**
 * Gets the context bindings exposed by a set of data provider components.
 */
const getProviderContextBindings = (asset, dataProviders) => {
  if (!asset || !dataProviders) {
    return []
  }

  // Ensure providers is an array
  if (!Array.isArray(dataProviders)) {
    dataProviders = [dataProviders]
  }

  // Create bindings for each data provider
  let bindings = []
  dataProviders.forEach(component => {
    const def = store.actions.components.getDefinition(component._component)
    const contexts = Array.isArray(def.context) ? def.context : [def.context]

    // Create bindings for each context block provided by this data provider
    contexts.forEach(context => {
      if (!context?.type) {
        return
      }

      let schema
      let readablePrefix
      let runtimeSuffix = context.suffix

      if (context.type === "form") {
        // Forms do not need table schemas
        // Their schemas are built from their component field names
        schema = buildFormSchema(component)
        readablePrefix = "Fields"
      } else if (context.type === "static") {
        // Static contexts are fully defined by the components
        schema = {}
        const values = context.values || []
        values.forEach(value => {
          schema[value.key] = { name: value.label, type: "string" }
        })
      } else if (context.type === "schema") {
        // Schema contexts are generated dynamically depending on their data
        const datasource = getDatasourceForProvider(asset, component)
        if (!datasource) {
          return
        }
        const info = getSchemaForDatasource(asset, datasource)
        schema = info.schema
        readablePrefix = info.table?.name
      }
      if (!schema) {
        return
      }

      const keys = Object.keys(schema).sort()

      // Generate safe unique runtime prefix
      let providerId = component._id
      if (runtimeSuffix) {
        providerId += `-${runtimeSuffix}`
      }
      const safeComponentId = makePropSafe(providerId)

      // Create bindable properties for each schema field
      keys.forEach(key => {
        const fieldSchema = schema[key]

        // Make safe runtime binding
        const runtimeBinding = `${safeComponentId}.${makePropSafe(key)}`

        // Optionally use a prefix with readable bindings
        let readableBinding = component._instanceName
        if (readablePrefix) {
          readableBinding += `.${readablePrefix}`
        }
        readableBinding += `.${fieldSchema.name || key}`

        // Create the binding object
        bindings.push({
          type: "context",
          runtimeBinding,
          readableBinding,
          // Field schema and provider are required to construct relationship
          // datasource options, based on bindable properties
          fieldSchema,
          providerId,
        })
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
  const { schema } = getSchemaForDatasource(null, {
    type: "table",
    tableId: TableNames.USERS,
  })
  const keys = Object.keys(schema).sort()
  const safeUser = makePropSafe("user")
  keys.forEach(key => {
    const fieldSchema = schema[key]
    bindings.push({
      type: "context",
      runtimeBinding: `${safeUser}.${makePropSafe(key)}`,
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
 * Gets all device bindings that are globally available.
 */
const getDeviceBindings = () => {
  let bindings = []
  if (get(store).clientFeatures?.deviceAwareness) {
    const safeDevice = makePropSafe("device")
    bindings.push({
      type: "context",
      runtimeBinding: `${safeDevice}.${makePropSafe("mobile")}`,
      readableBinding: `Device.Mobile`,
    })
    bindings.push({
      type: "context",
      runtimeBinding: `${safeDevice}.${makePropSafe("tablet")}`,
      readableBinding: `Device.Tablet`,
    })
  }
  return bindings
}

/**
 * Gets all state bindings that are globally available.
 */
const getStateBindings = () => {
  let bindings = []
  if (get(store).clientFeatures?.state) {
    const safeState = makePropSafe("state")
    bindings = getAllStateVariables().map(key => ({
      type: "context",
      runtimeBinding: `${safeState}.${makePropSafe(key)}`,
      readableBinding: `State.${key}`,
    }))
  }
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
  const safeURL = makePropSafe("url")
  return params.map(param => ({
    type: "context",
    runtimeBinding: `${safeURL}.${makePropSafe(param)}`,
    readableBinding: `URL.${param}`,
  }))
}

/**
 * Gets a schema for a datasource object.
 */
export const getSchemaForDatasource = (asset, datasource, isForm = false) => {
  let schema, table

  if (datasource) {
    const { type } = datasource

    // Determine the source table from the datasource type
    if (type === "provider") {
      const component = findComponent(asset.props, datasource.providerId)
      const source = getDatasourceForProvider(asset, component)
      return getSchemaForDatasource(asset, source, isForm)
    } else if (type === "query") {
      const queries = get(queriesStores).list
      table = queries.find(query => query._id === datasource._id)
    } else if (type === "field") {
      table = { name: datasource.fieldName }
      const { fieldType } = datasource
      if (fieldType === "attachment") {
        schema = {
          url: {
            type: "string",
          },
          name: {
            type: "string",
          },
        }
      } else if (fieldType === "array") {
        schema = {
          value: {
            type: "string",
          },
        }
      }
    } else {
      const tables = get(tablesStore).list
      table = tables.find(table => table._id === datasource.tableId)
    }

    // Determine the schema from the table if not already determined
    if (table && !schema) {
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

    // Add _id and _rev fields for certain types
    if (schema && !isForm && ["table", "link"].includes(datasource.type)) {
      schema["_id"] = { type: "string" }
      schema["_rev"] = { type: "string" }
    }

    // Ensure there are "name" properties for all fields and that field schema
    // are objects
    let fixedSchema = {}
    Object.entries(schema || {}).forEach(([fieldName, fieldSchema]) => {
      if (typeof fieldSchema === "string") {
        fixedSchema[fieldName] = {
          type: fieldSchema,
          name: fieldName,
        }
      } else {
        fixedSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
        }
      }
    })
    schema = fixedSchema
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
  const settings = getComponentSettings(component._component)
  const fieldSetting = settings.find(
    setting => setting.key === "field" && setting.type.startsWith("field/")
  )
  if (fieldSetting && component.field) {
    const type = fieldSetting.type.split("field/")[1]
    if (type) {
      schema[component.field] = { type }
    }
  }
  component._children?.forEach(child => {
    const childSchema = buildFormSchema(child)
    schema = { ...schema, ...childSchema }
  })
  return schema
}

/**
 * Recurses the input object to remove any instances of bindings.
 */
export function removeBindings(obj) {
  for (let [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      obj[key] = removeBindings(value)
    } else if (typeof value === "string") {
      obj[key] = value.replace(CAPTURE_HBS_TEMPLATE, "Invalid binding")
    }
  }
  return obj
}

/**
 * When converting from readable to runtime it can sometimes add too many square brackets,
 * this makes sure that doesn't happen.
 */
function shouldReplaceBinding(currentValue, from, convertTo) {
  if (!currentValue?.includes(from)) {
    return false
  }
  if (convertTo === "readableBinding") {
    return true
  }
  // remove all the spaces, if the input is surrounded by spaces e.g. [ Auto ID ] then
  // this makes sure it is detected
  const noSpaces = currentValue.replace(/\s+/g, "")
  const fromNoSpaces = from.replace(/\s+/g, "")
  const invalids = [
    `[${fromNoSpaces}]`,
    `"${fromNoSpaces}"`,
    `'${fromNoSpaces}'`,
  ]
  return !invalids.find(invalid => noSpaces?.includes(invalid))
}

function replaceBetween(string, start, end, replacement) {
  return string.substring(0, start) + replacement + string.substring(end)
}

/**
 * utility function for the readableToRuntimeBinding and runtimeToReadableBinding.
 */
function bindingReplacement(bindableProperties, textWithBindings, convertTo) {
  // Decide from base64 if using JS
  const isJS = isJSBinding(textWithBindings)
  if (isJS) {
    textWithBindings = decodeJSBinding(textWithBindings)
  }

  // Determine correct regex to find bindings to replace
  const regex = isJS ? CAPTURE_VAR_INSIDE_JS : CAPTURE_VAR_INSIDE_TEMPLATE

  const convertFrom =
    convertTo === "runtimeBinding" ? "readableBinding" : "runtimeBinding"
  if (typeof textWithBindings !== "string") {
    return textWithBindings
  }
  // work from longest to shortest
  const convertFromProps = bindableProperties
    .map(el => el[convertFrom])
    .sort((a, b) => {
      return b.length - a.length
    })
  const boundValues = textWithBindings.match(regex) || []
  let result = textWithBindings
  for (let boundValue of boundValues) {
    let newBoundValue = boundValue
    // we use a search string, where any time we replace something we blank it out
    // in the search, working from longest to shortest so always use best match first
    let searchString = newBoundValue
    for (let from of convertFromProps) {
      if (isJS || shouldReplaceBinding(newBoundValue, from, convertTo)) {
        const binding = bindableProperties.find(el => el[convertFrom] === from)
        let idx
        do {
          // see if any instances of this binding exist in the search string
          idx = searchString.indexOf(from)
          if (idx !== -1) {
            let end = idx + from.length,
              searchReplace = Array(binding[convertTo].length + 1).join("*")
            // blank out parts of the search string
            searchString = replaceBetween(searchString, idx, end, searchReplace)
            newBoundValue = replaceBetween(
              newBoundValue,
              idx,
              end,
              binding[convertTo]
            )
          }
        } while (idx !== -1)
      }
    }
    result = result.replace(boundValue, newBoundValue)
  }

  // Re-encode to base64 if using JS
  if (isJS) {
    result = encodeJSBinding(result)
  }

  return result
}

/**
 * Extracts a component ID from a handlebars expression setting of
 * {{ literal [componentId] }}
 */
function extractLiteralHandlebarsID(value) {
  return value?.match(/{{\s*literal\s*\[+([^\]]+)].*}}/)?.[1]
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

/**
 * Returns an array of the keys of any state variables which are set anywhere
 * in the app.
 */
export const getAllStateVariables = () => {
  let allComponents = []

  // Find all onClick settings in all layouts
  get(store).layouts.forEach(layout => {
    const components = findAllMatchingComponents(
      layout.props,
      c => c.onClick != null
    )
    allComponents = allComponents.concat(components || [])
  })

  // Find all onClick settings in all screens
  get(store).screens.forEach(screen => {
    const components = findAllMatchingComponents(
      screen.props,
      c => c.onClick != null
    )
    allComponents = allComponents.concat(components || [])
  })

  // Add state bindings for all state actions
  let bindingSet = new Set()
  allComponents.forEach(component => {
    if (!Array.isArray(component.onClick)) {
      return
    }
    component.onClick.forEach(action => {
      if (
        action["##eventHandlerType"] === "Update State" &&
        action.parameters?.type === "set" &&
        action.parameters?.key &&
        action.parameters?.value
      ) {
        bindingSet.add(action.parameters.key)
      }
    })
  })

  return Array.from(bindingSet)
}
