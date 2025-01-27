import { cloneDeep } from "lodash/fp"
import { get } from "svelte/store"
import {
  buildContextTreeLookupMap,
  findAllComponents,
  findAllMatchingComponents,
  findComponent,
  findComponentPath,
  getComponentContexts,
} from "@/helpers/components"
import {
  componentStore,
  screenStore,
  appStore,
  layoutStore,
  queries as queriesStores,
  tables as tablesStore,
  roles as rolesStore,
  selectedScreen,
} from "@/stores/builder"
import {
  makePropSafe,
  isJSBinding,
  decodeJSBinding,
  encodeJSBinding,
  getJsHelperList,
} from "@budibase/string-templates"
import { TableNames } from "./constants"
import { JSONUtils, Constants } from "@budibase/frontend-core"
import ActionDefinitions from "@/components/design/settings/controls/ButtonActionEditor/manifest.json"
import { environment, licensing } from "@/stores/portal"
import { convertOldFieldFormat } from "@/components/design/settings/controls/FieldConfiguration/utils"
import { FIELDS, DB_TYPE_INTERNAL } from "@/constants/backend"
import { FieldType } from "@budibase/types"

const { ContextScopes } = Constants

// Regex to match all instances of template strings
const CAPTURE_VAR_INSIDE_TEMPLATE = /{{([^}]+)}}/g
const CAPTURE_VAR_INSIDE_JS = /\$\("([^")]+)"\)/g
const CAPTURE_HBS_TEMPLATE = /{{[\S\s]*?}}/g

const UpdateReferenceAction = {
  ADD: "add",
  DELETE: "delete",
  MOVE: "move",
}

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (asset, componentId) => {
  const contextBindings = getContextBindings(asset, componentId)
  const userBindings = getUserBindings()
  const urlBindings = getUrlBindings(asset)
  const deviceBindings = getDeviceBindings()
  const stateBindings = getStateBindings()
  const selectedRowsBindings = getSelectedRowsBindings(asset)
  const roleBindings = getRoleBindings()
  const embedBindings = getEmbedBindings()
  return [
    ...contextBindings,
    ...urlBindings,
    ...stateBindings,
    ...userBindings,
    ...deviceBindings,
    ...selectedRowsBindings,
    ...roleBindings,
    ...embedBindings,
  ]
}

/**
 * Gets all rest bindable data fields
 */
export const getRestBindings = () => {
  const environmentVariablesEnabled = get(licensing).environmentVariablesEnabled
  const userBindings = getUserBindings()
  return [
    ...userBindings,
    ...getAuthBindings(),
    ...(environmentVariablesEnabled ? getEnvironmentBindings() : []),
  ]
}

/**
 * Gets all rest bindable auth fields
 */
export const getAuthBindings = () => {
  let bindings = []
  const safeUser = makePropSafe("user")
  const safeOAuth2 = makePropSafe("oauth2")
  const safeAccessToken = makePropSafe("accessToken")

  const authBindings = [
    {
      runtime: `${safeUser}.${safeOAuth2}.${safeAccessToken}`,
      readable: `Current User.OAuthToken`,
      key: "accessToken",
      display: { name: "OAuthToken", type: "text" },
    },
  ]

  bindings = authBindings.map(fieldBinding => {
    return {
      type: "context",
      runtimeBinding: fieldBinding.runtime,
      readableBinding: fieldBinding.readable,
      fieldSchema: { type: "string", name: fieldBinding.key },
      providerId: "user",
      category: "Current User",
      display: fieldBinding.display,
    }
  })
  return bindings
}

/**
 * Gets all bindings for environment variables
 */
export const getEnvironmentBindings = () => {
  let envVars = get(environment).variables
  return envVars.map(variable => {
    return {
      type: "context",
      runtimeBinding: `env.${makePropSafe(variable.name)}`,
      readableBinding: `env.${variable.name}`,
      category: "Environment",
      icon: "Key",
      display: { type: "string", name: variable.name },
    }
  })
}

/**
 * Utility - convert a key/value map to an array of custom 'context' bindings
 * @param {object} valueMap Key/value pairings
 * @param {string} prefix A contextual string prefix/path for a user readable binding
 * @return {object[]} An array containing readable/runtime binding objects
 */
export const toBindingsArray = (valueMap, prefix, category) => {
  if (!valueMap) {
    return []
  }
  return Object.keys(valueMap).reduce((acc, binding) => {
    if (!binding) {
      return acc
    }
    let config = {
      type: "context",
      runtimeBinding: binding,
      readableBinding: `${prefix}.${binding}`,
      icon: "Brackets",
    }
    if (category) {
      config.category = category
    }
    acc.push(config)
    return acc
  }, [])
}

/**
 * Utility to covert a map of readable bindings to runtime
 */
export const readableToRuntimeMap = (bindings, ctx) => {
  if (!bindings || !ctx) {
    return {}
  }
  return Object.keys(ctx).reduce((acc, key) => {
    acc[key] = readableToRuntimeBinding(bindings, ctx[key])
    return acc
  }, {})
}

/**
 * Utility to covert a map of runtime bindings to readable bindings
 */
export const runtimeToReadableMap = (bindings, ctx) => {
  if (!bindings || !ctx) {
    return {}
  }
  return Object.keys(ctx).reduce((acc, key) => {
    acc[key] = runtimeToReadableBinding(bindings, ctx[key])
    return acc
  }, {})
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
  const def = componentStore.getDefinition(component?._component)
  if (!def?.context) {
    return []
  }
  const contexts = Array.isArray(def.context) ? def.context : [def.context]

  // Get the bindings for the component
  const componentContext = {
    component,
    definition: def,
    contexts,
  }
  return generateComponentContextBindings(asset, componentContext)
}

/**
 * Gets all component contexts available to a certain component. This handles
 * both global and local bindings, taking into account a component's position
 * in the component tree.
 */
export const getAllComponentContexts = (
  asset,
  componentId,
  type,
  options = { includeSelf: false }
) => {
  if (!asset || !componentId) {
    return []
  }
  let map = {}
  const componentPath = findComponentPath(asset.props, componentId)
  const componentPathIds = componentPath.map(component => component._id)
  const contextTreeLookupMap = buildContextTreeLookupMap(asset.props)

  // Processes all contexts exposed by a component
  const processContexts = scope => component => {
    // Filter out global contexts not in the same branch.
    // Global contexts are only valid if their branch root is an ancestor of
    // this component.
    const branch = contextTreeLookupMap[component._id]
    if (branch !== "root" && !componentPathIds.includes(branch)) {
      return
    }

    const componentType = component._component
    const contexts = getComponentContexts(componentType)
    contexts.forEach(context => {
      // Ensure type matches
      if (type && context.type !== type) {
        return
      }
      // Ensure scope matches
      let contextScope = context.scope || ContextScopes.Global
      if (contextScope !== scope) {
        return
      }
      // Ensure the context is compatible with the component's current settings
      if (!isContextCompatibleWithComponent(context, component)) {
        return
      }
      if (!map[component._id]) {
        map[component._id] = {
          component,
          definition: componentStore.getDefinition(componentType),
          contexts: [],
        }
      }
      map[component._id].contexts.push(context)
    })
  }

  // Process all global contexts
  const allComponents = findAllComponents(asset.props)
  allComponents.forEach(processContexts(ContextScopes.Global))

  // Process all local contexts in the immediate tree
  componentPath.forEach(processContexts(ContextScopes.Local))

  // Exclude self if required
  if (!options?.includeSelf) {
    delete map[componentId]
  }

  // Only return components which provide at least 1 matching context
  return Object.values(map).filter(x => x.contexts.length > 0)
}

/**
 * Gets all components available to this component that expose a certain action
 */
export const getActionProviders = (
  asset,
  componentId,
  actionType,
  options = { includeSelf: false }
) => {
  const contexts = getAllComponentContexts(asset, componentId, "action", {
    includeSelf: options?.includeSelf,
  })
  return (
    contexts
      // Find the definition of the action in question, if one is provided
      .map(context => ({
        ...context,
        action: context.contexts[0]?.actions?.find(x => x.type === actionType),
      }))
      // Filter out contexts which don't have this action
      .filter(({ action }) => action != null)
      // Generate bindings for this component and action
      .map(({ component, action }) => {
        let runtimeBinding = component._id
        if (action.suffix) {
          runtimeBinding += `-${action.suffix}`
        }
        return {
          readableBinding: component._instanceName,
          runtimeBinding,
        }
      })
  )
}

/**
 * Gets a datasource object for a certain data provider component
 */
export const getDatasourceForProvider = (asset, component) => {
  const settings = componentStore.getComponentSettings(component?._component)

  // If this component has a dataProvider setting, go up the stack and use it
  const dataProviderSetting = settings.find(setting => {
    return setting.type === "dataProvider"
  })
  if (dataProviderSetting) {
    const settingValue = component[dataProviderSetting.key]
    const providerId = extractLiteralHandlebarsID(settingValue)
    const provider = findComponent(asset?.props, providerId)
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

  // For legacy compatibility, we need to be able to handle datasources that are
  // just strings. These are not generated any more, so could be removed in
  // future.
  // TODO: remove at some point
  const datasource = component[datasourceSetting?.key]
  if (typeof datasource === "string") {
    return {
      tableId: datasource,
      type: "table",
    }
  }
  return datasource
}

/**
 * Gets all bindable data properties from component data contexts.
 */
const getContextBindings = (asset, componentId) => {
  // Get all available contexts for this component
  const componentContexts = getAllComponentContexts(asset, componentId)

  // Generate bindings for each context
  return componentContexts
    .map(componentContext => {
      return generateComponentContextBindings(asset, componentContext)
    })
    .flat()
}

/**
 * Generates a set of bindings for a given component context
 */
const generateComponentContextBindings = (asset, componentContext) => {
  const { component, definition, contexts } = componentContext
  if (!component || !definition || !contexts?.length) {
    return []
  }

  // Create bindings for each data provider
  let bindings = []
  contexts.forEach(context => {
    if (!context?.type) {
      return
    }

    let schema
    let table
    let readablePrefix
    let runtimeSuffix = context.suffix

    if (context.type === "form") {
      // Forms do not need table schemas
      // Their schemas are built from their component field names
      schema = buildFormSchema(component, asset)
      readablePrefix = "Fields"
    } else if (context.type === "static") {
      // Static contexts are fully defined by the components
      schema = {}
      const values = context.values || []
      values.forEach(value => {
        schema[value.key] = {
          name: value.label,
          type: value.type || "string",
        }
      })
    } else if (context.type === "schema") {
      // Schema contexts are generated dynamically depending on their data
      const datasource = getDatasourceForProvider(asset, component)
      if (!datasource) {
        return
      }
      const info = getSchemaForDatasource(asset, datasource)
      schema = info.schema
      table = info.table

      // Determine what to prefix bindings with
      if (datasource.type === "jsonarray" || datasource.type === "queryarray") {
        // For JSON arrays, use the array name as the readable prefix
        const split = datasource.label.split(".")
        readablePrefix = split[split.length - 1]
      } else if (datasource.type === "viewV2") {
        // For views, use the view name
        const view = Object.values(table?.views || {}).find(
          view => view.id === datasource.id
        )
        readablePrefix = view?.name
      } else {
        // Otherwise use the table name
        readablePrefix = info.table?.name
      }
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
      const safeKey = key.split(".").map(makePropSafe).join(".")
      const runtimeBinding = `${safeComponentId}.${safeKey}`

      // Optionally use a prefix with readable bindings
      let readableBinding = component._instanceName
      if (readablePrefix) {
        readableBinding += `.${readablePrefix}`
      }
      readableBinding += `.${fieldSchema.name || key}`

      // Determine which category this binding belongs in
      const bindingCategory = getComponentBindingCategory(
        component,
        context,
        definition
      )
      // Create the binding object
      bindings.push({
        type: "context",
        runtimeBinding,
        readableBinding: `${readableBinding}`,
        // Field schema and provider are required to construct relationship
        // datasource options, based on bindable properties
        fieldSchema,
        providerId,
        // Table ID is used by JSON fields to know what table the field is in
        tableId: table?._id,
        component: component._component,
        category: bindingCategory.category,
        icon: bindingCategory.icon,
        display: {
          name: `${fieldSchema.name || key}`,
          type: fieldSchema.display?.type || fieldSchema.type,
        },
      })
    })
  })

  return bindings
}

/**
 * Checks if a certain data context is compatible with a certain instance of a
 * configured component.
 */
const isContextCompatibleWithComponent = (context, component) => {
  if (!component) {
    return false
  }
  const { _component, actionType } = component
  const { type } = context

  // Certain types of form blocks only allow certain contexts
  if (_component.endsWith("formblock")) {
    if (
      (actionType === "Create" && type === "schema") ||
      (actionType === "View" && type === "form")
    ) {
      return false
    }
  }

  // Allow the context by default
  return true
}

// Enrich binding category information for certain components
const getComponentBindingCategory = (component, context, def) => {
  // Default category to component name
  let icon = def.icon
  let category = component._instanceName

  // Form block edge case
  if (component._component.endsWith("formblock")) {
    if (context.type === "form") {
      category = `${component._instanceName} - Fields`
      icon = "Form"
    } else if (context.type === "schema") {
      category = `${component._instanceName} - Row`
      icon = "Data"
    }
  }

  return {
    icon,
    category,
  }
}

/**
 * Gets all bindable properties from the logged-in user.
 */
export const getUserBindings = () => {
  let bindings = []
  const { schema } = getSchemaForDatasourcePlus(TableNames.USERS)
  // add props that are not in the user metadata table schema
  // but will be there for logged-in user
  schema["globalId"] = { type: FieldType.STRING }
  const keys = Object.keys(schema).sort()
  const safeUser = makePropSafe("user")

  bindings = keys.reduce((acc, key) => {
    const fieldSchema = schema[key]
    acc.push({
      type: "context",
      runtimeBinding: `${safeUser}.${makePropSafe(key)}`,
      readableBinding: `Current User.${key}`,
      // Field schema and provider are required to construct relationship
      // datasource options, based on bindable properties
      fieldSchema,
      providerId: "user",
      category: "Current User",
      icon: "User",
      display: {
        name: key,
      },
    })
    return acc
  }, [])

  return bindings
}

/**
 * Gets all device bindings that are globally available.
 */
const getDeviceBindings = () => {
  let bindings = []
  if (get(appStore).clientFeatures?.deviceAwareness) {
    const safeDevice = makePropSafe("device")

    bindings = [
      {
        type: "context",
        runtimeBinding: `${safeDevice}.${makePropSafe("mobile")}`,
        readableBinding: `Device.Mobile`,
        category: "Device",
        icon: "DevicePhone",
        display: { type: "boolean", name: "mobile" },
      },
      {
        type: "context",
        runtimeBinding: `${safeDevice}.${makePropSafe("tablet")}`,
        readableBinding: `Device.Tablet`,
        category: "Device",
        icon: "DevicePhone",
        display: { type: "boolean", name: "tablet" },
      },
      {
        type: "context",
        runtimeBinding: `${safeDevice}.${makePropSafe("theme")}`,
        readableBinding: `App.Theme`,
        category: "Device",
        icon: "DevicePhone",
        display: { type: "string", name: "App Theme" },
      },
    ]
  }
  return bindings
}

export const getSettingBindings = () => {
  let bindings = []
  const safeSetting = makePropSafe("settings")

  bindings = [
    {
      type: "context",
      runtimeBinding: `${safeSetting}.${makePropSafe("url")}`,
      readableBinding: `Settings.url`,
      category: "Settings",
      icon: "Settings",
      display: { type: "string", name: "url" },
    },
    {
      type: "context",
      runtimeBinding: `${safeSetting}.${makePropSafe("logo")}`,
      readableBinding: `Settings.logo`,
      category: "Settings",
      icon: "Settings",
      display: { type: "string", name: "logo" },
    },
    {
      type: "context",
      runtimeBinding: `${safeSetting}.${makePropSafe("company")}`,
      readableBinding: `Settings.company`,
      category: "Settings",
      icon: "Settings",
      display: { type: "string", name: "company" },
    },
  ]

  return bindings
}

/**
 * Gets all selected rows bindings for tables in the current asset.
 * TODO: remove in future because we don't need a separate store for this
 * DEPRECATED
 */
const getSelectedRowsBindings = asset => {
  let bindings = []
  if (get(appStore).clientFeatures?.rowSelection) {
    // Add bindings for table components
    let tables = findAllMatchingComponents(asset?.props, component =>
      component._component.endsWith("table")
    )
    const safeState = makePropSafe("rowSelection")
    bindings = bindings.concat(
      tables.map(table => ({
        type: "context",
        runtimeBinding: `${safeState}.${makePropSafe(table._id)}.${makePropSafe(
          "selectedRows"
        )}`,
        readableBinding: `${table._instanceName}.Selected Row IDs (deprecated)`,
        category: "Selected Row IDs (deprecated)",
        icon: "ViewRow",
        display: { name: table._instanceName },
      }))
    )

    // Add bindings for table blocks
    let tableBlocks = findAllMatchingComponents(asset?.props, component =>
      component._component.endsWith("tableblock")
    )
    bindings = bindings.concat(
      tableBlocks.map(block => ({
        type: "context",
        runtimeBinding: `${safeState}.${makePropSafe(
          block._id + "-table"
        )}.${makePropSafe("selectedRows")}`,
        readableBinding: `${block._instanceName}.Selected Row IDs (deprecated)`,
        category: "Selected Row IDs (deprecated)",
        icon: "ViewRow",
        display: { name: block._instanceName },
      }))
    )
  }
  return bindings
}

/**
 * Generates a state binding for a certain key name
 */
export const makeStateBinding = key => {
  return {
    type: "context",
    runtimeBinding: `${makePropSafe("state")}.${makePropSafe(key)}`,
    readableBinding: `State.${key}`,
    category: "State",
    icon: "AutomatedSegment",
    display: { name: key },
  }
}

/**
 * Gets all state bindings that are globally available.
 */
const getStateBindings = () => {
  let bindings = []
  if (get(appStore).clientFeatures?.state) {
    bindings = getAllStateVariables().map(makeStateBinding)
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
  const urlParamBindings = params.map(param => ({
    type: "context",
    runtimeBinding: `${safeURL}.${makePropSafe(param)}`,
    readableBinding: `URL.${param}`,
    category: "URL",
    icon: "RailTop",
    display: { type: "string", name: param },
  }))
  const queryParamsBinding = {
    type: "context",
    runtimeBinding: makePropSafe("query"),
    readableBinding: "Query params",
    category: "URL",
    icon: "RailTop",
    display: { type: "object", name: "Query params" },
  }
  return urlParamBindings.concat([queryParamsBinding])
}

/**
 * Generates all bindings for role IDs
 */
const getRoleBindings = () => {
  return (get(rolesStore) || []).map(role => {
    return {
      type: "context",
      runtimeBinding: `'${role._id}'`,
      readableBinding: `Role.${role.uiMetadata.displayName}`,
      category: "Role",
      icon: "UserGroup",
      display: { type: "string", name: role.uiMetadata.displayName },
    }
  })
}

/**
 * Gets all bindable event context properties provided in the component
 * setting
 */
export const getEventContextBindings = ({
  settingKey,
  componentInstance,
  componentId,
  componentDefinition,
  asset,
}) => {
  let bindings = []
  asset = asset ?? get(selectedScreen)

  // Check if any context bindings are provided by the component for this
  // setting
  const component = componentInstance ?? findComponent(asset.props, componentId)

  if (!component) {
    return bindings
  }

  const definition =
    componentDefinition ?? componentStore.getDefinition(component?._component)

  const settings = componentStore.getComponentSettings(component?._component)
  const eventSetting = settings.find(setting => setting.key === settingKey)

  if (eventSetting?.context?.length) {
    eventSetting.context.forEach(contextEntry => {
      bindings.push({
        readableBinding: contextEntry.label,
        runtimeBinding: `${makePropSafe("eventContext")}.${makePropSafe(
          contextEntry.key
        )}`,
        category: component._instanceName,
        icon: definition.icon,
        display: {
          name: contextEntry.label,
        },
      })
    })
  }
  return bindings
}

/**
 * Gets all bindable properties exposed in an event action flow up until
 * the specified action ID, as well as context provided for the action
 * setting as a whole by the component.
 */
export const getActionBindings = (actions, actionId) => {
  let bindings = []
  // Get the steps leading up to this value
  const index = actions?.findIndex(action => action.id === actionId)
  if (index == null || index === -1) {
    return bindings
  }
  const prevActions = actions.slice(0, index)

  // Generate bindings for any steps which provide context
  prevActions.forEach((action, idx) => {
    const def = ActionDefinitions.actions.find(
      x => x.name === action["##eventHandlerType"]
    )
    if (def.context) {
      def.context.forEach(contextValue => {
        bindings.push({
          readableBinding: `Action ${idx + 1}.${contextValue.label}`,
          runtimeBinding: `actions.${idx}.${contextValue.value}`,
          category: "Actions",
          icon: "JourneyAction",
          display: {
            name: contextValue.label,
          },
        })
      })
    }
  })
  return bindings
}

/**
 * Gets all device bindings for embeds.
 */
const getEmbedBindings = () => {
  let bindings = []
  const safeEmbed = makePropSafe("embed")

  bindings = [
    {
      type: "context",
      runtimeBinding: `${safeEmbed}`,
      readableBinding: `ParentWindow`,
      category: "Embed",
      icon: "DistributeVertically",
    },
  ]
  return bindings
}

/**
 * Gets the schema for a certain datasource plus.
 * The options which can be passed in are:
 *   formSchema: whether the schema is for a form
 *   searchableSchema: whether to generate a searchable schema, which may have
 *     fewer fields than a readable schema
 * @param resourceId the DS+ resource ID
 * @param options options for generating the schema
 * @return {{schema: Object, table: Object}}
 */
export const getSchemaForDatasourcePlus = (resourceId, options) => {
  const isViewV2 = resourceId?.startsWith("view_")
  const datasource = isViewV2
    ? {
        type: "viewV2",
        id: resourceId,
        tableId: resourceId.split("_").slice(1, 3).join("_"),
      }
    : { type: "table", tableId: resourceId }
  return getSchemaForDatasource(null, datasource, options)
}

/**
 * Gets a schema for a datasource object.
 * The options which can be passed in are:
 *   formSchema: whether the schema is for a form
 *   searchableSchema: whether to generate a searchable schema, which may have
 *     fewer fields than a readable schema
 * @param asset the current root client app asset (layout or screen). This is
 *   optional and only needed for "provider" datasource types.
 * @param datasource the datasource definition
 * @param options options for generating the schema
 * @return {{schema: Object, table: Table}}
 */
export const getSchemaForDatasource = (asset, datasource, options) => {
  options = options || {}
  let schema, table

  if (datasource) {
    const { type } = datasource
    const tables = get(tablesStore).list

    // Determine the entity which backs this datasource.
    // "provider" datasources are those targeting another data provider
    if (type === "provider") {
      const component = findComponent(asset?.props, datasource.providerId)
      const source = getDatasourceForProvider(asset, component)
      return getSchemaForDatasource(asset, source, options)
    }

    // "query" datasources are those targeting non-plus datasources or
    // custom queries
    else if (type === "query") {
      const queries = get(queriesStores).list
      table = queries.find(query => query._id === datasource._id)
    }

    // "field" datasources are array-like fields of rows, such as attachments
    // or multi-select fields
    else if (type === "field") {
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
    }

    // "jsonarray" datasources are arrays inside JSON fields
    else if (type === "jsonarray") {
      table = tables.find(table => table._id === datasource.tableId)
      let tableSchema = table?.schema
      schema = JSONUtils.getJSONArrayDatasourceSchema(tableSchema, datasource)
    }

    // "queryarray" datasources are arrays inside JSON responses
    else if (type === "queryarray") {
      const queries = get(queriesStores).list
      table = queries.find(query => query._id === datasource.tableId)
      let tableSchema = table?.schema
      let nestedSchemaFields = table?.nestedSchemaFields
      schema = JSONUtils.generateQueryArraySchemas(
        tableSchema,
        nestedSchemaFields
      )
      schema = JSONUtils.getJSONArrayDatasourceSchema(schema, datasource)
    }

    // Otherwise we assume we're targeting an internal table or a plus
    // datasource, and we can treat it as a table with a schema
    else {
      table = tables.find(table => table._id === datasource.tableId)
    }

    // Determine the schema from the backing entity if not already determined
    if (table && !schema) {
      if (type === "view") {
        // Old views
        schema = cloneDeep(table.views?.[datasource.name]?.schema)
      } else if (type === "viewV2") {
        // New views which are DS+
        const view = Object.values(table.views || {}).find(
          view => view.id === datasource.id
        )
        schema = cloneDeep(view?.schema)

        // Strip hidden fields
        Object.keys(schema || {}).forEach(field => {
          if (!schema[field].visible) {
            delete schema[field]
          }
        })
      } else if (
        type === "query" &&
        (options.formSchema || options.searchableSchema)
      ) {
        // For queries, if we are generating a schema for a form or a searchable
        // schema then we want to use the query parameters rather than the
        // query schema
        schema = {}
        const params = table.parameters || []
        params.forEach(param => {
          if (param?.name) {
            schema[param.name] = { ...param, type: "string" }
          }
        })
      } else {
        // Otherwise we just want the schema of the table
        schema = cloneDeep(table.schema)
      }
    }

    // Check for any JSON fields so we can add any top level properties
    if (schema) {
      let jsonAdditions = {}
      Object.keys(schema).forEach(fieldKey => {
        const fieldSchema = schema[fieldKey]
        if (fieldSchema?.type === "json") {
          const jsonSchema = JSONUtils.convertJSONSchemaToTableSchema(
            fieldSchema,
            {
              squashObjects: true,
            }
          )
          Object.keys(jsonSchema).forEach(jsonKey => {
            jsonAdditions[`${fieldKey}.${jsonKey}`] = {
              type: jsonSchema[jsonKey].type,
              nestedJSON: true,
            }
          })
        }
      })
      schema = { ...schema, ...jsonAdditions }
    }

    // Determine if we should add ID and rev to the schema
    const isInternal = table && table?.sourceType === DB_TYPE_INTERNAL
    const isDSPlus = ["table", "link", "viewV2"].includes(datasource.type)

    // ID is part of the readable schema for all tables
    // Rev is part of the readable schema for internal tables only
    let addId = isDSPlus
    let addRev = isDSPlus && isInternal

    // Don't add ID or rev for form schemas
    if (options.formSchema) {
      addId = false
      addRev = false
    }

    // ID is only searchable for internal tables
    else if (options.searchableSchema) {
      addId = isDSPlus && isInternal
    }

    // Add schema properties if required
    if (schema) {
      if (addId) {
        schema["_id"] = { type: "string" }
      }
      if (addRev) {
        schema["_rev"] = { type: "string" }
      }
    }

    // Ensure there are "name" properties for all fields and that field schema
    // are objects
    let fixedSchema = {}
    Object.entries(schema || {}).forEach(([fieldName, fieldSchema]) => {
      const field = Object.values(FIELDS).find(
        field =>
          field.type === fieldSchema.type &&
          field.subtype === fieldSchema.subtype
      )

      if (typeof fieldSchema === "string") {
        fixedSchema[fieldName] = {
          type: fieldSchema,
          name: fieldName,
          display: { type: fieldSchema },
        }
      } else {
        fixedSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
          display: { type: field?.name || fieldSchema.type },
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
export const buildFormSchema = (component, asset) => {
  let schema = {}
  if (!component) {
    return schema
  }

  if (component._component.endsWith("formblock")) {
    let schema = {}
    const datasource = getDatasourceForProvider(asset, component)
    const info = getSchemaForDatasource(component, datasource)

    if (!info?.schema) {
      return schema
    }

    if (!component.fields) {
      Object.values(info.schema)
        .filter(
          ({ autocolumn, name }) =>
            !autocolumn && !["_rev", "_id"].includes(name)
        )
        .forEach(({ name }) => {
          schema[name] = { type: info?.schema[name].type }
        })
    } else {
      // Field conversion
      const patched = convertOldFieldFormat(component.fields || [])
      patched?.forEach(({ field, active }) => {
        if (!active) return
        if (info?.schema[field]) {
          schema[field] = { type: info?.schema[field].type }
        }
      })
    }

    return schema
  }

  // Otherwise find all field component children
  const settings = componentStore.getComponentSettings(component._component)
  const fieldSetting = settings.find(
    setting => setting.key === "field" && setting.type.startsWith("field/")
  )
  if (fieldSetting) {
    const type = fieldSetting.type.split("field/")[1]
    const key = component.field || component._instanceName
    if (type && key) {
      schema[key] = { type }
    }
  }
  component._children?.forEach(child => {
    const childSchema = buildFormSchema(child, asset)
    schema = { ...schema, ...childSchema }
  })
  return schema
}

/**
 * Returns an array of the keys of any state variables which are set anywhere
 * in the app.
 */
export const getAllStateVariables = () => {
  // Find all button action settings in all components
  let eventSettings = []
  getAllAssets().forEach(asset => {
    findAllMatchingComponents(asset.props, component => {
      const settings = componentStore.getComponentSettings(component._component)
      const nestedTypes = [
        "buttonConfiguration",
        "fieldConfiguration",
        "stepConfiguration",
      ]

      // Extracts all event settings from a component instance.
      // Recurses into nested types to find all event-like settings at any
      // depth.
      const parseEventSettings = (settings, comp) => {
        if (!settings?.length) {
          return
        }

        // Extract top level event settings
        settings
          .filter(setting => setting.type === "event")
          .forEach(setting => {
            eventSettings.push(comp[setting.key])
          })

        // Recurse into any nested instance types
        settings
          .filter(setting => nestedTypes.includes(setting.type))
          .forEach(setting => {
            const instances = comp[setting.key]
            if (Array.isArray(instances) && instances.length) {
              instances.forEach(instance => {
                let type = instance?._component

                // Backwards compatibility for multi-step from blocks which
                // didn't set a proper component type previously.
                if (setting.type === "stepConfiguration" && !type) {
                  type = "@budibase/standard-components/multistepformblockstep"
                }

                // Parsed nested component instances inside this setting
                const nestedSettings = componentStore.getComponentSettings(type)
                parseEventSettings(nestedSettings, instance)
              })
            }
          })
      }

      parseEventSettings(settings, component)
    })
  })

  // Add on load settings from screens
  get(screenStore).screens.forEach(screen => {
    if (screen.onLoad) {
      eventSettings.push(screen.onLoad)
    }
  })

  // Extract all state keys from any "update state" actions in each setting
  let bindingSet = new Set()
  eventSettings.forEach(setting => {
    if (!Array.isArray(setting)) {
      return
    }
    setting.forEach(action => {
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

export const getAllAssets = () => {
  // Get all component containing assets
  let allAssets = []
  allAssets = allAssets.concat(get(layoutStore).layouts || [])
  allAssets = allAssets.concat(get(screenStore).screens || [])

  return allAssets
}

/**
 * Recurses the input object to remove any instances of bindings.
 */
export const removeBindings = (obj, replacement = "Invalid binding") => {
  for (let [key, value] of Object.entries(obj)) {
    if (value && typeof value === "object") {
      obj[key] = removeBindings(value, replacement)
    } else if (typeof value === "string") {
      obj[key] = value.replace(CAPTURE_HBS_TEMPLATE, replacement)
    }
  }
  return obj
}

/**
 * When converting from readable to runtime it can sometimes add too many square brackets,
 * this makes sure that doesn't happen.
 */
const shouldReplaceBinding = (currentValue, from, convertTo, binding) => {
  if (!currentValue?.includes(from)) {
    return false
  }
  // some cases we have the same binding for readable/runtime, specific logic for this
  const sameBindings = binding.runtimeBinding.includes(binding.readableBinding)
  const convertingToReadable = convertTo === "readableBinding"
  const helperNames = Object.keys(getJsHelperList())
  const matchedHelperNames = helperNames.filter(
    name => name.includes(from) && currentValue.includes(name)
  )
  // edge case - if the binding is part of a helper it may accidentally replace it
  if (matchedHelperNames.length > 0) {
    const indexStart = currentValue.indexOf(from),
      indexEnd = indexStart + from.length
    for (let helperName of matchedHelperNames) {
      const helperIndexStart = currentValue.indexOf(helperName),
        helperIndexEnd = helperIndexStart + helperName.length
      if (indexStart >= helperIndexStart && indexEnd <= helperIndexEnd) {
        return false
      }
    }
  }

  if (convertingToReadable && !sameBindings) {
    // Don't replace if the value already matches the readable binding
    return currentValue.indexOf(binding.readableBinding) === -1
  } else if (convertingToReadable) {
    // if the runtime and readable bindings are very similar we have to assume it should be replaced
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

/**
 * Utility function which replaces a string between given indices.
 */
const replaceBetween = (string, start, end, replacement) => {
  return string.substring(0, start) + replacement + string.substring(end)
}

/**
 * Utility function for the readableToRuntimeBinding and runtimeToReadableBinding.
 */
const bindingReplacement = (
  bindableProperties,
  textWithBindings,
  convertTo
) => {
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
      const binding = bindableProperties.find(el => el[convertFrom] === from)
      if (
        isJS ||
        shouldReplaceBinding(newBoundValue, from, convertTo, binding)
      ) {
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
const extractLiteralHandlebarsID = value => {
  if (!value || typeof value !== "string") {
    return null
  }
  return value.match(/{{\s*literal\s*\[+([^\]]+)].*}}/)?.[1]
}

/**
 * Converts a readable data binding into a runtime data binding
 */
export const readableToRuntimeBinding = (
  bindableProperties,
  textWithBindings
) => {
  return bindingReplacement(
    bindableProperties,
    textWithBindings,
    "runtimeBinding"
  )
}

/**
 * Converts a runtime data binding into a readable data binding
 */
export const runtimeToReadableBinding = (
  bindableProperties,
  textWithBindings
) => {
  return bindingReplacement(
    bindableProperties,
    textWithBindings,
    "readableBinding"
  )
}

/**
 * Used to update binding references for automation or action steps
 *
 * @param obj - The object to be updated
 * @param originalIndex - The original index of the step being moved. Not applicable to add/delete.
 * @param modifiedIndex - The new index of the step being modified
 * @param action - Used to determine if a step is being added, deleted or moved
 * @param label - The binding text that describes the steps
 */
export const updateReferencesInObject = ({
  obj,
  modifiedIndex,
  action,
  label,
  originalIndex,
}) => {
  const stepIndexRegex = new RegExp(`{{\\s*${label}\\.(\\d+)\\.`, "g")
  const updateActionStep = (str, index, replaceWith) =>
    str.replace(`{{ ${label}.${index}.`, `{{ ${label}.${replaceWith}.`)
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      let matches
      while ((matches = stepIndexRegex.exec(obj[key])) !== null) {
        const referencedStep = parseInt(matches[1])
        if (
          action === UpdateReferenceAction.ADD &&
          referencedStep >= modifiedIndex
        ) {
          obj[key] = updateActionStep(
            obj[key],
            referencedStep,
            referencedStep + 1
          )
        } else if (
          action === UpdateReferenceAction.DELETE &&
          referencedStep > modifiedIndex
        ) {
          obj[key] = updateActionStep(
            obj[key],
            referencedStep,
            referencedStep - 1
          )
        } else if (action === UpdateReferenceAction.MOVE) {
          if (referencedStep === originalIndex) {
            obj[key] = updateActionStep(obj[key], referencedStep, modifiedIndex)
          } else if (
            modifiedIndex <= referencedStep &&
            modifiedIndex < originalIndex
          ) {
            obj[key] = updateActionStep(
              obj[key],
              referencedStep,
              referencedStep + 1
            )
          } else if (
            modifiedIndex >= referencedStep &&
            modifiedIndex > originalIndex
          ) {
            obj[key] = updateActionStep(
              obj[key],
              referencedStep,
              referencedStep - 1
            )
          }
        }
      }
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      updateReferencesInObject({
        obj: obj[key],
        modifiedIndex,
        action,
        label,
        originalIndex,
      })
    }
  }
}

// Migrate references
// Switch all bindings to reference their ids
export const migrateReferencesInObject = ({
  obj,
  label = "steps",
  steps,
  originalIndex,
}) => {
  const stepIndexRegex = new RegExp(`{{\\s*${label}\\.(\\d+)\\.`, "g")
  const updateActionStep = (str, index, replaceWith) =>
    str.replace(`{{ ${label}.${index}.`, `{{ ${label}.${replaceWith}.`)

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      let matches
      while ((matches = stepIndexRegex.exec(obj[key])) !== null) {
        const referencedStep = parseInt(matches[1])

        obj[key] = updateActionStep(
          obj[key],
          referencedStep,
          steps[referencedStep]?.id
        )
      }
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      migrateReferencesInObject({
        obj: obj[key],
        steps,
        originalIndex,
      })
    }
  }
}
