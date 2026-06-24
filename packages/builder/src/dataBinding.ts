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
import { JSONUtils, Constants, SchemaUtils } from "@budibase/frontend-core"
import ActionDefinitions from "@/components/design/settings/controls/ButtonActionEditor/manifest.json"
import { environment, licensing } from "@/stores/portal"
import { convertOldFieldFormat } from "@/components/design/settings/controls/FieldConfiguration/utils"
import { FIELDS, DB_TYPE_INTERNAL } from "@/constants/backend"
import { FieldType, TableSourceType } from "@budibase/types"
import type {
  Component,
  ComponentContext,
  ComponentDefinition,
  ComponentSetting,
  DataFetchDatasource,
  EnrichedBinding,
  QueryParameter,
  Role,
  Screen,
  Table,
  TableSchema,
  UIBinding,
  View,
  ViewV2,
} from "@budibase/types"
import { getTableIdFromViewId } from "@budibase/shared-core"

const { ContextScopes } = Constants

const UpdateReferenceAction = {
  ADD: "add",
  DELETE: "delete",
  MOVE: "move",
} as const

type BindingKey = "runtimeBinding" | "readableBinding"
type UpdateReferenceActionType =
  (typeof UpdateReferenceAction)[keyof typeof UpdateReferenceAction]
type BindingReference = Pick<EnrichedBinding, BindingKey>

interface DataBindingObject {
  [key: string]: unknown
}

interface DataBindingDisplay {
  name: string
  type?: string
  rank?: unknown
}

export interface DataBindingFieldSchema extends DataBindingObject {
  type: string
  name?: string
  tableId?: string
  subtype?: string
  prefixKeys?: string
  display?: DataBindingDisplay
  schema?: DataBindingSchema
  visible?: boolean
  autocolumn?: boolean
}

export type DataBindingSchema = Record<string, DataBindingFieldSchema>

type EnrichedDataBinding = Omit<
  EnrichedBinding,
  "category" | "display" | "fieldSchema"
> &
  Partial<Pick<EnrichedBinding, "category">> & {
    providerId?: string
    display?: DataBindingDisplay
    fieldSchema?: DataBindingFieldSchema
  }

export type BindableProperty = Omit<
  UIBinding,
  "fieldSchema" | "runtimeBinding" | "readableBinding"
> &
  BindingReference & {
    type?: null | string
    category: string
    icon?: string
    display?: DataBindingDisplay
    fieldSchema?: UIBinding["fieldSchema"] & DataBindingFieldSchema
  }

type SettingBinding = Omit<
  EnrichedDataBinding,
  "category" | "display" | "fieldSchema"
> & {
  category: string
  display: { name: string; type: string }
}

export interface SchemaForDatasourceResult {
  schema: DataBindingSchema
  table: Table
}

type DataBindingTable = Omit<Partial<Table>, "schema" | "sourceType"> & {
  _id?: string
  name?: string
  schema?: DataBindingSchema
  nestedSchemaFields?: unknown
  parameters?: QueryParameter[]
  sourceType?: TableSourceType | string
  views?: Record<string, View | ViewV2>
}

type ExtendedProviderDatasource = Extract<
  DataFetchDatasource,
  { type: "provider" }
> & {
  providerId?: string
}

type ExtendedViewV2Datasource = Extract<
  DataFetchDatasource,
  { type: "viewV2" }
> & {
  tableId?: string
}

type LabeledArrayDatasource = Extract<
  DataFetchDatasource,
  { type: "jsonarray" | "queryarray" }
> & {
  label?: string
}

type BuilderDatasource =
  | Exclude<
      DataFetchDatasource,
      { type: "provider" | "viewV2" | "jsonarray" | "queryarray" }
    >
  | ExtendedProviderDatasource
  | ExtendedViewV2Datasource
  | LabeledArrayDatasource

interface ComponentContextGroup {
  component: Component
  definition?: ComponentDefinition
  contexts: ComponentContext[]
}

interface SchemaOptions {
  formSchema?: boolean
  searchableSchema?: boolean
}

interface EventComponentSetting extends ComponentSetting {
  context?: Array<{ key: string; label: string }>
}

interface AssetRecord extends DataBindingObject {
  props?: unknown
  routing?: Partial<Screen["routing"]>
  onLoad?: Screen["onLoad"]
}

interface UpdateReferencesOptions {
  obj: object
  modifiedIndex: number
  action: UpdateReferenceActionType
  label: string
  originalIndex?: number
}

interface MigrateReferencesOptions {
  obj: object
  label?: string
  steps: Array<{ id?: string }>
  originalIndex?: number
}

const isDataBindingObject = (value: unknown): value is DataBindingObject => {
  return value != null && typeof value === "object" && !Array.isArray(value)
}

const isDataBindingContainer = (
  value: unknown
): value is DataBindingObject | unknown[] => {
  return value != null && typeof value === "object"
}

const asDataBindingObject = (value: unknown): DataBindingObject => {
  return isDataBindingObject(value) ? value : {}
}

const asAsset = (value: unknown): AssetRecord => {
  return asDataBindingObject(value) as AssetRecord
}

const getAssetProps = (asset: unknown): Component | undefined => {
  const props = asAsset(asset).props
  return props ? (props as Component) : undefined
}

const asComponent = (value: unknown): Component | undefined => {
  if (!isDataBindingObject(value)) {
    return undefined
  }
  if (
    typeof value._id === "string" &&
    typeof value._component === "string" &&
    typeof value._instanceName === "string"
  ) {
    return value as Component
  }
}

const asComponents = (value: unknown): Component[] => {
  return Array.isArray(value)
    ? value.flatMap(component => {
        const typedComponent = asComponent(component)
        return typedComponent ? [typedComponent] : []
      })
    : []
}

const asDatasource = (value: unknown): BuilderDatasource | undefined => {
  if (isDataBindingObject(value) && typeof value.type === "string") {
    return value as BuilderDatasource
  }
}

const getDatasourceTableId = (
  datasource: BuilderDatasource
): string | undefined => {
  return "tableId" in datasource ? datasource.tableId : undefined
}

const asTable = (value: unknown): DataBindingTable | undefined => {
  return isDataBindingObject(value) ? (value as DataBindingTable) : undefined
}

const asTables = (value: unknown): DataBindingTable[] => {
  return Array.isArray(value)
    ? value.flatMap(table => {
        const typedTable = asTable(table)
        return typedTable ? [typedTable] : []
      })
    : []
}

const asBudibaseTables = (value: unknown): Table[] => {
  return Array.isArray(value) ? (value as Table[]) : []
}

const hasViewId = (view: unknown): view is { id?: string; name?: string } => {
  return isDataBindingObject(view)
}

const getTableParameters = (
  table: Table | DataBindingTable | undefined
): QueryParameter[] => {
  const parameters = asDataBindingObject(table).parameters
  return Array.isArray(parameters)
    ? parameters.flatMap(param =>
        isDataBindingObject(param) &&
        typeof param.name === "string" &&
        typeof param.default === "string"
          ? [{ name: param.name, default: param.default }]
          : []
      )
    : []
}

const asAssets = (value: unknown): AssetRecord[] => {
  return Array.isArray(value) ? value.map(asAsset) : []
}

const asSchema = (value: unknown): DataBindingSchema => {
  if (!isDataBindingObject(value)) {
    return {}
  }
  return Object.entries(value).reduce<DataBindingSchema>(
    (acc, [key, field]) => {
      if (typeof field === "string") {
        acc[key] = { type: field }
      } else if (isDataBindingObject(field)) {
        const fieldType =
          typeof field.type === "string"
            ? field.type
            : "calculationType" in field
              ? "number"
              : null

        if (fieldType) {
          acc[key] = {
            ...field,
            type: fieldType,
          } as DataBindingFieldSchema
        }
      }
      return acc
    },
    {}
  )
}

const toBindableProperty = (
  binding: BindableProperty | EnrichedDataBinding
): BindableProperty => {
  const tableId =
    "tableId" in binding && typeof binding.tableId === "string"
      ? binding.tableId
      : binding.fieldSchema?.tableId || ""
  const fieldSchema = binding.fieldSchema
    ? {
        ...binding.fieldSchema,
        name: binding.fieldSchema.name || binding.display?.name || "",
        tableId,
        type: binding.fieldSchema.type,
      }
    : undefined

  return {
    ...binding,
    providerId:
      "providerId" in binding && typeof binding.providerId === "string"
        ? binding.providerId
        : "",
    category: binding.category || "",
    fieldSchema,
  }
}

const toTable = (table: DataBindingTable | Table | undefined): Table => {
  if (
    table?.type === "table" &&
    typeof table.sourceId === "string" &&
    table.schema
  ) {
    return table as Table
  }

  return {
    _id: table?._id,
    type: "table",
    sourceType:
      table?.sourceType === TableSourceType.EXTERNAL
        ? TableSourceType.EXTERNAL
        : TableSourceType.INTERNAL,
    name: table?.name || "",
    sourceId: typeof table?.sourceId === "string" ? table.sourceId : "",
    schema: asSchema(table?.schema) as TableSchema,
  }
}

// Regex to match all instances of template strings
const CAPTURE_VAR_INSIDE_TEMPLATE = /{{([^}]+)}}/g
const CAPTURE_VAR_INSIDE_JS = /\$\((["'`])([^"'`]+)\1\)/g
const CAPTURE_HBS_TEMPLATE = /{{[\S\s]*?}}/g

/**
 * Gets all bindable data context fields and instance fields.
 */
export const getBindableProperties = (
  asset: unknown,
  componentId: string | undefined
): BindableProperty[] => {
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
  ].map(toBindableProperty)
}

/**
 * Gets all rest bindable data fields
 */
export const getRestBindings = (): EnrichedBinding[] => {
  const environmentVariablesEnabled = get(licensing).environmentVariablesEnabled
  const userBindings = getUserBindings()
  return [
    ...userBindings,
    ...getAuthBindings(),
    ...(environmentVariablesEnabled ? getEnvironmentBindings() : []),
  ] as EnrichedBinding[]
}

/**
 * Gets all rest bindable auth fields
 */
export const getAuthBindings = (): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
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
export const getEnvironmentBindings = (): EnrichedDataBinding[] => {
  let envVars = get(environment).variables
  return envVars.map((variable: { name: string }) => {
    return {
      type: "context",
      runtimeBinding: `env.${makePropSafe(variable.name)}`,
      readableBinding: `env.${variable.name}`,
      category: "Environment",
      icon: "key",
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
export const toBindingsArray = (
  valueMap: Record<string, unknown> | undefined,
  prefix: string,
  category?: string
): EnrichedDataBinding[] => {
  if (!valueMap) {
    return []
  }
  return Object.keys(valueMap).reduce<EnrichedDataBinding[]>((acc, binding) => {
    if (!binding) {
      return acc
    }
    let config: EnrichedDataBinding = {
      type: "context",
      runtimeBinding: binding,
      readableBinding: `${prefix}.${binding}`,
      icon: "brackets-angle",
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
export const readableToRuntimeMap = (
  bindings: BindingReference[],
  ctx: Record<string, string> | undefined
): Record<string, string> => {
  if (!bindings || !ctx) {
    return {}
  }
  return Object.keys(ctx).reduce<Record<string, string>>((acc, key) => {
    acc[key] = readableToRuntimeBinding(bindings, ctx[key])
    return acc
  }, {})
}

/**
 * Utility to covert a map of runtime bindings to readable bindings
 */
export const runtimeToReadableMap = (
  bindings: BindingReference[],
  ctx: Record<string, string> | undefined
): Record<string, string> => {
  if (!bindings || !ctx) {
    return {}
  }
  return Object.keys(ctx).reduce<Record<string, string>>((acc, key) => {
    acc[key] = runtimeToReadableBinding(bindings, ctx[key])
    return acc
  }, {})
}

/**
 * Gets the bindable properties exposed by a certain component.
 */
export const getComponentBindableProperties = (
  asset: unknown,
  componentId: string | undefined
): BindableProperty[] => {
  if (!asset || !componentId) {
    return []
  }

  const props = getAssetProps(asset)
  if (!props) {
    return []
  }

  // Ensure that the component exists and exposes context
  const component = asComponent(findComponent(props, componentId))
  if (!component) {
    return []
  }
  const def = componentStore.getDefinition(component._component) as
    | ComponentDefinition
    | undefined
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
  asset: unknown,
  componentId: string | undefined,
  type?: string,
  options = { includeSelf: false }
): ComponentContextGroup[] => {
  if (!asset || !componentId) {
    return []
  }
  const props = getAssetProps(asset)
  if (!props) {
    return []
  }

  let map: Record<string, ComponentContextGroup> = {}
  const componentPath = asComponents(findComponentPath(props, componentId))
  const componentPathIds = componentPath.map(component => component._id)
  const contextTreeLookupMap = buildContextTreeLookupMap(props) as Record<
    string,
    string
  >

  // Processes all contexts exposed by a component
  const processContexts = (scope: string) => (component: Component) => {
    const componentId = component._id
    if (!componentId) {
      return
    }
    // Filter out global contexts not in the same branch.
    // Global contexts are only valid if their branch root is an ancestor of
    // this component.
    const branch = contextTreeLookupMap[componentId]
    if (branch !== "root" && !componentPathIds.includes(branch)) {
      return
    }

    const componentType = component._component
    const contexts = getComponentContexts(componentType) as ComponentContext[]
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
      if (!map[componentId]) {
        map[componentId] = {
          component,
          definition: componentStore.getDefinition(componentType) as
            | ComponentDefinition
            | undefined,
          contexts: [],
        }
      }
      map[componentId].contexts.push(context)
    })
  }

  // Process all global contexts
  const allComponents = asComponents(findAllComponents(props))
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
  asset: unknown,
  componentId: string | undefined,
  actionType: string,
  options = { includeSelf: false }
): Array<{ readableBinding: string; runtimeBinding: string }> => {
  const contexts = getAllComponentContexts(asset, componentId, "action", {
    includeSelf: options?.includeSelf,
  })
  return contexts.flatMap(context => {
    const action = context.contexts[0]?.actions?.find(
      x => x.type === actionType
    )
    if (!action) {
      return []
    }
    let runtimeBinding = context.component._id || ""
    if (action.suffix) {
      runtimeBinding += `-${action.suffix}`
    }
    return [
      {
        readableBinding: context.component._instanceName,
        runtimeBinding,
      },
    ]
  })
}

/**
 * Gets a datasource object for a certain data provider component
 */
export const getDatasourceForProvider = (
  asset: unknown,
  component: Component | null | undefined
): BuilderDatasource | null => {
  if (!component) {
    return null
  }
  const settings = componentStore.getComponentSettings(
    component._component
  ) as ComponentSetting[]

  // If this component has a dataProvider setting, go up the stack and use it
  const dataProviderSetting = settings.find(setting => {
    return setting.type === "dataProvider"
  })
  if (dataProviderSetting) {
    const settingValue = component[dataProviderSetting.key]
    const providerId = extractLiteralHandlebarsID(settingValue)
    const props = getAssetProps(asset)
    const provider =
      providerId && props ? findComponent(props, providerId) : undefined
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
  return asDatasource(datasource) ?? null
}

/**
 * Gets all bindable data properties from component data contexts.
 */
const getContextBindings = (
  asset: unknown,
  componentId: string | undefined
): BindableProperty[] => {
  // Get all available contexts for this component
  const componentContexts = getAllComponentContexts(asset, componentId)

  // Generate bindings for each context
  return componentContexts
    .map(componentContext => {
      return generateComponentContextBindings(asset, componentContext)
    })
    .flat()
}

export const makeReadableKeyPropSafe = (key: string): string => {
  if (!key.includes(" ")) {
    return key
  }

  if (new RegExp(/^\[(.+)\]$/).test(key)) {
    return key
  }

  return `[${key}]`
}

/**
 * Generates a set of bindings for a given component context
 */
const generateComponentContextBindings = (
  asset: unknown,
  componentContext: ComponentContextGroup
): BindableProperty[] => {
  const { component, definition, contexts } = componentContext
  if (!component || !definition || !contexts?.length) {
    return []
  }

  // Create bindings for each data provider
  let bindings: BindableProperty[] = []
  contexts.forEach((context: ComponentContext) => {
    if (!context?.type) {
      return
    }

    let schema: DataBindingSchema | undefined
    let table: Table | undefined
    let readablePrefix: string | undefined
    let runtimeSuffix = context.suffix

    if (context.type === "form") {
      // Forms do not need table schemas
      // Their schemas are built from their component field names
      schema = buildFormSchema(component, asset)
      readablePrefix = "Fields"
    } else if (context.type === "static") {
      // Static contexts are fully defined by the components
      const staticSchema: DataBindingSchema = {}
      const values = context.values || []
      values.forEach(value => {
        staticSchema[value.key] = {
          name: value.label,
          type: value.type || "string",
        }
      })
      schema = staticSchema
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
        const split = (datasource.label || "").split(".")
        readablePrefix = split[split.length - 1]
      } else if (datasource.type === "viewV2") {
        // For views, use the view name
        const view = Object.values(table?.views || {}).find(
          view => hasViewId(view) && view.id === datasource.id
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
    let providerId = component._id || ""
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
      let readableBinding = makeReadableKeyPropSafe(component._instanceName)
      if (readablePrefix) {
        readableBinding += `.${readablePrefix}`
      }
      readableBinding += `.${makeReadableKeyPropSafe(fieldSchema.name || key)}`

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
        readableBinding,
        // Field schema and provider are required to construct relationship
        // datasource options, based on bindable properties
        fieldSchema: {
          ...fieldSchema,
          name: fieldSchema.name || key,
          tableId: table?._id || "",
        },
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
const isContextCompatibleWithComponent = (
  context: ComponentContext,
  component: Component | undefined
): boolean => {
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
const getComponentBindingCategory = (
  component: Component,
  context: ComponentContext,
  def: ComponentDefinition
): { icon?: string; category: string } => {
  // Default category to component name
  let icon = def.icon
  let category = component._instanceName

  // Form block edge case
  if (component._component.endsWith("formblock")) {
    if (context.type === "form") {
      category = `${component._instanceName} - Fields`
      icon = "list"
    } else if (context.type === "schema") {
      category = `${component._instanceName} - Row`
      icon = "database"
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
export const getUserBindings = (): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  const { schema } = getSchemaForDatasourcePlus(TableNames.USERS)
  // add props that are not in the user metadata table schema
  // but will be there for logged-in user
  schema["globalId"] = { type: FieldType.STRING }
  schema["fullName"] = { type: FieldType.STRING }
  const keys = Object.keys(schema).sort()
  const safeUser = makePropSafe("user")

  bindings = keys.reduce<EnrichedDataBinding[]>((acc, key) => {
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
      icon: "user",
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
const getDeviceBindings = (): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  if (get(appStore).clientFeatures?.deviceAwareness) {
    const safeDevice = makePropSafe("device")

    bindings = [
      {
        type: "context",
        runtimeBinding: `${safeDevice}.${makePropSafe("mobile")}`,
        readableBinding: `Device.Mobile`,
        category: "Device",
        icon: "device-mobile",
        display: { type: "boolean", name: "mobile" },
      },
      {
        type: "context",
        runtimeBinding: `${safeDevice}.${makePropSafe("tablet")}`,
        readableBinding: `Device.Tablet`,
        category: "Device",
        icon: "device-mobile",
        display: { type: "boolean", name: "tablet" },
      },
      {
        type: "context",
        runtimeBinding: `${safeDevice}.${makePropSafe("theme")}`,
        readableBinding: `App.Theme`,
        category: "Device",
        icon: "device-mobile",
        display: { type: "string", name: "App Theme" },
      },
    ]
  }
  return bindings
}

export const getSettingBindings = (): SettingBinding[] => {
  let bindings: SettingBinding[] = []
  const safeSetting = makePropSafe("settings")

  bindings = [
    {
      type: "context",
      runtimeBinding: `${safeSetting}.${makePropSafe("url")}`,
      readableBinding: `Settings.url`,
      category: "Settings",
      icon: "gear",
      display: { type: "string", name: "url" },
    },
    {
      type: "context",
      runtimeBinding: `${safeSetting}.${makePropSafe("logo")}`,
      readableBinding: `Settings.logo`,
      category: "Settings",
      icon: "gear",
      display: { type: "string", name: "logo" },
    },
    {
      type: "context",
      runtimeBinding: `${safeSetting}.${makePropSafe("company")}`,
      readableBinding: `Settings.company`,
      category: "Settings",
      icon: "gear",
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
const getSelectedRowsBindings = (asset: unknown): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  if (get(appStore).clientFeatures?.rowSelection) {
    // Add bindings for table components
    const props = getAssetProps(asset)
    let tables = props
      ? asComponents(
          findAllMatchingComponents(props, component =>
            component._component.endsWith("table")
          )
        )
      : []
    const safeState = makePropSafe("rowSelection")
    bindings = bindings.concat(
      tables.map(table => ({
        type: "context",
        runtimeBinding: `${safeState}.${makePropSafe(table._id)}.${makePropSafe(
          "selectedRows"
        )}`,
        readableBinding: `${table._instanceName}.Selected Row IDs (deprecated)`,
        category: "Selected Row IDs (deprecated)",
        icon: "rows",
        display: { name: table._instanceName },
      }))
    )

    // Add bindings for table blocks
    let tableBlocks = props
      ? asComponents(
          findAllMatchingComponents(props, component =>
            component._component.endsWith("tableblock")
          )
        )
      : []
    bindings = bindings.concat(
      tableBlocks.map(block => ({
        type: "context",
        runtimeBinding: `${safeState}.${makePropSafe(
          block._id + "-table"
        )}.${makePropSafe("selectedRows")}`,
        readableBinding: `${block._instanceName}.Selected Row IDs (deprecated)`,
        category: "Selected Row IDs (deprecated)",
        icon: "rows",
        display: { name: block._instanceName },
      }))
    )
  }
  return bindings
}

/**
 * Generates a state binding for a certain key name
 */
export const makeStateBinding = (
  key: string | undefined
): EnrichedDataBinding => {
  const stateKey = key || ""
  return {
    type: "context",
    runtimeBinding: `${makePropSafe("state")}.${makePropSafe(stateKey)}`,
    readableBinding: `State.${stateKey}`,
    category: "State",
    icon: "funnel",
    display: { name: stateKey },
  }
}

/**
 * Gets all state bindings that are globally available.
 */
const getStateBindings = (): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  if (get(appStore).clientFeatures?.state) {
    bindings = getAllStateVariables().map(makeStateBinding)
  }
  return bindings
}

/**
 * Gets all bindable properties from URL parameters.
 */
const getUrlBindings = (asset: unknown): EnrichedDataBinding[] => {
  const url = asAsset(asset).routing?.route ?? ""
  const split = url.split("/")
  let params: string[] = []
  split.forEach((part: string) => {
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
    icon: "align-top",
    display: { type: "string", name: param },
  }))
  const queryParamsBinding = {
    type: "context",
    runtimeBinding: makePropSafe("query"),
    readableBinding: "Query params",
    category: "URL",
    icon: "align-top",
    display: { type: "object", name: "Query params" },
  }
  return urlParamBindings.concat([queryParamsBinding])
}

/**
 * Generates all bindings for role IDs
 */
const getRoleBindings = (): EnrichedDataBinding[] => {
  return ((get(rolesStore) || []) as Role[]).map(role => {
    const displayName = role.uiMetadata?.displayName || role.name
    return {
      type: "context",
      runtimeBinding: `'${role._id}'`,
      readableBinding: `Role.${displayName}`,
      category: "Role",
      icon: "users-three",
      display: { type: "string", name: displayName },
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
}: {
  settingKey: string
  componentInstance?: Component
  componentId?: string
  componentDefinition?: ComponentDefinition
  asset?: unknown
}): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  asset = asset ?? get(selectedScreen)

  // Check if any context bindings are provided by the component for this
  // setting
  const props = getAssetProps(asset)
  const component =
    componentInstance ??
    (props && componentId ? findComponent(props, componentId) : undefined)

  if (!component) {
    return bindings
  }

  const definition =
    componentDefinition ??
    (componentStore.getDefinition(component?._component) as
      | ComponentDefinition
      | undefined)

  const settings = componentStore.getComponentSettings(
    component?._component
  ) as EventComponentSetting[]
  const eventSetting = settings.find(setting => setting.key === settingKey)

  if (eventSetting?.context?.length) {
    eventSetting.context.forEach(contextEntry => {
      bindings.push({
        readableBinding: contextEntry.label,
        runtimeBinding: `${makePropSafe("eventContext")}.${makePropSafe(
          contextEntry.key
        )}`,
        category: component._instanceName,
        icon: definition?.icon,
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
export const getActionBindings = (
  actions: DataBindingObject[] | undefined,
  actionId: string
): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  // Get the steps leading up to this value
  const index = actions?.findIndex(action => action.id === actionId)
  if (index == null || index === -1) {
    return bindings
  }
  if (!actions) {
    return bindings
  }
  const prevActions = actions.slice(0, index)

  // Generate bindings for any steps which provide context
  prevActions.forEach((action, idx) => {
    const def = ActionDefinitions.actions.find(
      x => x.name === action["##eventHandlerType"]
    )
    if (def?.context) {
      def.context.forEach(contextValue => {
        bindings.push({
          readableBinding: `Action ${idx + 1}.${contextValue.label}`,
          runtimeBinding: `actions.${idx}.${contextValue.value}`,
          category: "Actions",
          icon: "path",
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
const getEmbedBindings = (): EnrichedDataBinding[] => {
  let bindings: EnrichedDataBinding[] = []
  const safeEmbed = makePropSafe("embed")

  bindings = [
    {
      type: "context",
      runtimeBinding: `${safeEmbed}`,
      readableBinding: `ParentWindow`,
      category: "Embed",
      icon: "code",
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
export const getSchemaForDatasourcePlus = (
  resourceId: string | undefined | unknown,
  options?: SchemaOptions | null
): SchemaForDatasourceResult => {
  if (typeof resourceId !== "string") {
    return getSchemaForDatasource(null, null, options)
  }
  const isViewV2 = resourceId?.startsWith("view_")
  const datasource = isViewV2
    ? {
        type: "viewV2",
        id: resourceId,
        tableId: getTableIdFromViewId(resourceId),
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
export const getSchemaForDatasource = (
  asset: unknown,
  datasource: unknown,
  options?: SchemaOptions | null
): SchemaForDatasourceResult => {
  options = options || {}
  const datasourceConfig = asDatasource(datasource)
  let schema: DataBindingSchema | undefined
  let table: Table | DataBindingTable | undefined

  if (datasourceConfig) {
    const { type } = datasourceConfig
    const tables = asBudibaseTables(get(tablesStore).list)

    // Determine the entity which backs this datasource.
    // "provider" datasources are those targeting another data provider
    if (type === "provider") {
      const props = getAssetProps(asset)
      const component =
        props && datasourceConfig.providerId
          ? findComponent(props, datasourceConfig.providerId)
          : undefined
      const source = getDatasourceForProvider(asset, component)
      return getSchemaForDatasource(asset, source, options)
    }

    // "query" datasources are those targeting non-plus datasources or
    // custom queries
    else if (type === "query") {
      const queries = asTables(get(queriesStores).list)
      table = queries.find(query => query._id === datasourceConfig._id)
    }

    // "field" datasources are array-like fields of rows, such as attachments
    // or multi-select fields
    else if (type === "field") {
      table = { name: datasourceConfig.fieldName }
      const { fieldType } = datasourceConfig
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
      table = tables.find(table => table._id === datasourceConfig.tableId)
      let tableSchema = table?.schema
      const fieldSchema =
        datasourceConfig.fieldName && tableSchema
          ? tableSchema[datasourceConfig.fieldName]
          : undefined

      if (fieldSchema?.schema) {
        schema = asSchema(cloneDeep(fieldSchema.schema))
      } else {
        schema = asSchema(
          JSONUtils.getJSONArrayDatasourceSchema(
            tableSchema || {},
            datasourceConfig
          )
        )
      }
    }

    // "queryarray" datasources are arrays inside JSON responses
    else if (type === "queryarray") {
      const queries = asTables(get(queriesStores).list)
      table = queries.find(query => query._id === datasourceConfig.tableId)
      let tableSchema = table?.schema
      let nestedSchemaFields = table?.nestedSchemaFields
      schema = asSchema(
        JSONUtils.generateQueryArraySchemas(
          tableSchema || {},
          nestedSchemaFields as Parameters<
            typeof JSONUtils.generateQueryArraySchemas
          >[1]
        )
      )
      schema = asSchema(
        JSONUtils.getJSONArrayDatasourceSchema(schema, datasourceConfig)
      )
    }

    // Otherwise we assume we're targeting an internal table or a plus
    // datasource, and we can treat it as a table with a schema
    else {
      const tableId = getDatasourceTableId(datasourceConfig)
      table = tables.find(table => table._id === tableId)
    }

    // Determine the schema from the backing entity if not already determined
    if (table && !schema) {
      if (type === "view") {
        // Old views
        schema = asSchema(
          cloneDeep(table.views?.[datasourceConfig.name || ""]?.schema)
        )
      } else if (type === "viewV2") {
        // New views which are DS+
        const view = Object.values(table.views || {}).find(
          view => hasViewId(view) && view.id === datasourceConfig.id
        )
        schema = asSchema(cloneDeep(view?.schema))

        // Strip hidden fields
        Object.keys(schema).forEach(field => {
          if (!schema?.[field].visible) {
            delete schema?.[field]
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
        const params = getTableParameters(table)
        params.forEach(param => {
          if (typeof param?.name === "string") {
            schema = schema || {}
            schema[param.name] = { ...param, type: "string" }
          }
        })
      } else {
        // Otherwise we just want the schema of the table
        schema = asSchema(cloneDeep(table.schema))
      }
    }

    // Check for any JSON fields so we can add any top level properties
    if (schema) {
      schema = asSchema(SchemaUtils.addNestedJSONSchemaFields(schema))
    }

    // Determine if we should add ID and rev to the schema
    const isInternal = table && table?.sourceType === DB_TYPE_INTERNAL
    const isDSPlus = ["table", "link", "viewV2"].includes(datasourceConfig.type)

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
      addId = Boolean(isDSPlus && isInternal)
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
    let fixedSchema: DataBindingSchema = {}
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
          display: { name: fieldName, type: fieldSchema },
        }
      } else {
        fixedSchema[fieldName] = {
          ...fieldSchema,
          name: fieldName,
          display: { name: fieldName, type: field?.name || fieldSchema.type },
        }
      }
    })
    schema = fixedSchema
  }
  return { schema: schema || {}, table: toTable(table) }
}

/**
 * Builds a form schema given a form component.
 * A form schema is a schema of all the fields nested anywhere within a form.
 */
export const buildFormSchema = (
  component: Component | null | undefined,
  asset?: unknown
): DataBindingSchema => {
  let schema: DataBindingSchema = {}
  if (!component) {
    return schema
  }

  if (component._component.endsWith("formblock")) {
    let schema: DataBindingSchema = {}
    const datasource = getDatasourceForProvider(asset, component)
    const info = getSchemaForDatasource(component, datasource)

    if (!info?.schema) {
      return schema
    }

    if (!component.fields) {
      Object.values(info.schema)
        .filter(
          ({ autocolumn, name }) =>
            typeof name === "string" &&
            !autocolumn &&
            !["_rev", "_id"].includes(name)
        )
        .forEach(({ name }) => {
          if (name) {
            schema[name] = { type: info.schema[name].type }
          }
        })
    } else {
      // Field conversion
      const patched = convertOldFieldFormat(component.fields || []) as Array<{
        field: string
        active: boolean
      }>
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
  const settings = componentStore.getComponentSettings(
    component._component
  ) as ComponentSetting[]
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
export const getAllStateVariables = (
  screen?: unknown
): (string | undefined)[] => {
  let assets: AssetRecord[] = []
  if (screen) {
    // only include state variables from a specific screen
    assets.push(asAsset(screen))
  } else {
    // otherwise include state variables from all screens
    assets = getAllAssets()
  }
  let eventSettings: unknown[] = []
  assets.forEach(asset => {
    const props = getAssetProps(asset)
    if (!props) {
      return
    }
    findAllMatchingComponents(props, component => {
      const settings = componentStore.getComponentSettings(
        component._component
      ) as ComponentSetting[]
      const nestedTypes = [
        "buttonConfiguration",
        "componentConfiguration",
        "fieldConfiguration",
        "stepConfiguration",
      ]

      // Extracts all event settings from a component instance.
      // Recurses into nested types to find all event-like settings at any
      // depth.
      const parseEventSettings = (
        settings: ComponentSetting[] | undefined,
        comp: DataBindingObject
      ): void => {
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
                const instanceRecord = asDataBindingObject(instance)
                let type = instanceRecord._component

                // Backwards compatibility for multi-step from blocks which
                // didn't set a proper component type previously.
                if (setting.type === "stepConfiguration" && !type) {
                  type = "@budibase/standard-components/multistepformblockstep"
                }

                // Parsed nested component instances inside this setting
                if (typeof type === "string") {
                  const nestedSettings = componentStore.getComponentSettings(
                    type
                  ) as ComponentSetting[]
                  parseEventSettings(nestedSettings, instanceRecord)
                }
              })
            }
          })
      }

      parseEventSettings(settings, component)
      return false
    })
  })

  // Add on load settings from screens
  if (screen) {
    const screenAsset = asAsset(screen)
    if (screenAsset.onLoad) {
      eventSettings.push(screenAsset.onLoad)
    }
  } else {
    asAssets(get(screenStore).screens || []).forEach(screen => {
      const screenAsset = asAsset(screen)
      if (screenAsset.onLoad) {
        eventSettings.push(screenAsset.onLoad)
      }
    })
  }

  // Extract all state keys from any "update state" actions in each setting
  let bindingSet = new Set<string>()
  eventSettings.forEach(setting => {
    if (!Array.isArray(setting)) {
      return
    }
    setting.forEach(action => {
      const actionRecord = asDataBindingObject(action)
      const parameters = asDataBindingObject(actionRecord.parameters)
      if (
        actionRecord["##eventHandlerType"] === "Update State" &&
        parameters.type === "set" &&
        typeof parameters.key === "string" &&
        parameters.value
      ) {
        bindingSet.add(parameters.key)
      }
    })
  })
  return Array.from(bindingSet)
}

export const getAllAssets = (): AssetRecord[] => {
  // Get all component containing assets
  let allAssets: AssetRecord[] = []
  allAssets = allAssets.concat(asAssets(get(layoutStore).layouts || []))
  allAssets = allAssets.concat(asAssets(get(screenStore).screens || []))

  return allAssets
}

/**
 * Recurses the input object to remove any instances of bindings.
 */
export const removeBindings = (
  obj: DataBindingObject,
  replacement = "Invalid binding"
): DataBindingObject => {
  for (let [key, value] of Object.entries(obj)) {
    if (isDataBindingContainer(value)) {
      obj[key] = removeBindings(value as DataBindingObject, replacement)
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
const shouldReplaceBinding = (
  currentValue: string,
  from: string,
  convertTo: BindingKey,
  binding: BindingReference
): boolean => {
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

// If converting readable to runtime we need to ensure we don't replace words
// which are substrings of other words - e.g. a binding of `a` would turn
// `hah` into `h[a]h` which is obviously wrong. To avoid this we can remove all
// expanded versions of the binding to be replaced.
const excludeReadableExtensions = (string: string, binding: string): string => {
  // Escape any special chars in the binding so we can treat it as a literal
  // string match in the regexes below
  const escaped = binding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  // Regex to find prefixed bindings (e.g. exclude xfoo for foo)
  const regex1 = new RegExp(`[a-zA-Z0-9-_]+${escaped}[a-zA-Z0-9-_]*`, "g")
  // Regex to find prefixed bindings (e.g. exclude foox for foo)
  const regex2 = new RegExp(`[a-zA-Z0-9-_]*${escaped}[a-zA-Z0-9-_]+`, "g")
  const matches = [...string.matchAll(regex1), ...string.matchAll(regex2)]
  for (const match of matches) {
    string = string.replace(match[0], new Array(match[0].length + 1).join("*"))
  }
  return string
}

/**
 * Utility function which replaces a string between given indices.
 */
const replaceBetween = (
  string: string,
  start: number,
  end: number,
  replacement: string
): string => {
  return string.substring(0, start) + replacement + string.substring(end)
}

/**
 * Utility function for the readableToRuntimeBinding and runtimeToReadableBinding.
 */
const bindingReplacement = (
  bindableProperties: BindingReference[],
  textWithBindings: unknown,
  convertTo: BindingKey
): string => {
  if (typeof textWithBindings !== "string") {
    return textWithBindings as unknown as string
  }
  let bindingText = textWithBindings
  // Decide from base64 if using JS
  const isJS = isJSBinding(bindingText)
  if (isJS) {
    bindingText = decodeJSBinding(bindingText) ?? ""
  }

  // Determine correct regex to find bindings to replace
  const regex = isJS ? CAPTURE_VAR_INSIDE_JS : CAPTURE_VAR_INSIDE_TEMPLATE

  const convertFrom: BindingKey =
    convertTo === "runtimeBinding" ? "readableBinding" : "runtimeBinding"
  // work from longest to shortest
  const convertFromProps = bindableProperties
    // TODO check whitespaces
    .map(el => el[convertFrom])
    .filter((value): value is string => typeof value === "string")
    .sort((a, b) => {
      return b.length - a.length
    })
  const boundValues = bindingText.match(regex) || []
  let result = bindingText
  for (const boundValue of boundValues) {
    let newBoundValue = boundValue
    // we use a search string, where any time we replace something we blank it out
    // in the search, working from longest to shortest so always use best match first
    let searchString = newBoundValue
    for (let from of convertFromProps) {
      // If converting readable > runtime, blank out all extensions of this
      // string to avoid partial matches
      if (convertTo === "runtimeBinding") {
        searchString = excludeReadableExtensions(searchString, from)
      }
      const binding = bindableProperties.find(el => el[convertFrom] === from)
      if (!binding) {
        continue
      }
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
export const extractLiteralHandlebarsID = (value: unknown): string | null => {
  if (!value || typeof value !== "string") {
    return null
  }
  return value.match(/{{\s*literal\s*\[+([^\]]+)].*}}/)?.[1] ?? null
}

/**
 * Converts a readable data binding into a runtime data binding
 */
export const readableToRuntimeBinding = (
  bindableProperties: BindingReference[] | undefined,
  textWithBindings: unknown
): string => {
  return bindingReplacement(
    bindableProperties || [],
    textWithBindings,
    "runtimeBinding"
  )
}

/**
 * Converts a runtime data binding into a readable data binding
 */
export const runtimeToReadableBinding = (
  bindableProperties: BindingReference[] | undefined,
  textWithBindings: unknown
): string => {
  return bindingReplacement(
    bindableProperties || [],
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
}: UpdateReferencesOptions): void => {
  const target = obj as DataBindingObject
  if (
    action === UpdateReferenceAction.MOVE &&
    (typeof originalIndex !== "number" || originalIndex < 0)
  ) {
    return
  }
  const stepIndexRegex = new RegExp(`{{\\s*${label}\\.(\\d+)\\.`, "g")
  const updateActionStep = (
    str: string,
    index: number,
    replaceWith: number | string | undefined
  ) => str.replace(`{{ ${label}.${index}.`, `{{ ${label}.${replaceWith}.`)
  for (const key in target) {
    if (typeof target[key] === "string") {
      const value = target[key]
      let matches
      while ((matches = stepIndexRegex.exec(value)) !== null) {
        const referencedStep = parseInt(matches[1])
        if (
          action === UpdateReferenceAction.ADD &&
          referencedStep >= modifiedIndex
        ) {
          target[key] = updateActionStep(
            String(target[key]),
            referencedStep,
            referencedStep + 1
          )
        } else if (
          action === UpdateReferenceAction.DELETE &&
          referencedStep > modifiedIndex
        ) {
          target[key] = updateActionStep(
            String(target[key]),
            referencedStep,
            referencedStep - 1
          )
        } else if (action === UpdateReferenceAction.MOVE) {
          if (referencedStep === originalIndex) {
            target[key] = updateActionStep(
              String(target[key]),
              referencedStep,
              modifiedIndex
            )
          } else if (
            originalIndex !== undefined &&
            modifiedIndex <= referencedStep &&
            referencedStep < originalIndex
          ) {
            target[key] = updateActionStep(
              String(target[key]),
              referencedStep,
              referencedStep + 1
            )
          } else if (
            originalIndex !== undefined &&
            originalIndex < referencedStep &&
            referencedStep <= modifiedIndex
          ) {
            target[key] = updateActionStep(
              String(target[key]),
              referencedStep,
              referencedStep - 1
            )
          }
        }
      }
    } else if (isDataBindingContainer(target[key])) {
      updateReferencesInObject({
        obj: target[key] as object,
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
}: MigrateReferencesOptions): void => {
  const target = obj as DataBindingObject
  const stepIndexRegex = new RegExp(`{{\\s*${label}\\.(\\d+)\\.`, "g")
  const updateActionStep = (
    str: string,
    index: number,
    replaceWith: string | undefined
  ) => str.replace(`{{ ${label}.${index}.`, `{{ ${label}.${replaceWith}.`)

  for (const key in target) {
    if (typeof target[key] === "string") {
      const value = target[key]
      let matches
      while ((matches = stepIndexRegex.exec(value)) !== null) {
        const referencedStep = parseInt(matches[1])

        target[key] = updateActionStep(
          String(target[key]),
          referencedStep,
          steps[referencedStep]?.id
        )
      }
    } else if (isDataBindingContainer(target[key])) {
      migrateReferencesInObject({
        obj: target[key] as object,
        label,
        steps,
        originalIndex,
      })
    }
  }
}
