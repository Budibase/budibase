<script lang="ts">
  import { goto as gotoStore, beforeUrlChange } from "@roxi/routify"
  import { flags, appStore } from "@/stores/builder"
  import {
    datasources,
    hasRestTemplate,
    getRestTemplateIdentifier,
  } from "@/stores/builder/datasources"
  import {
    queries,
    consumeSkipUnsavedPrompt,
    markSkipUnsavedPrompt,
  } from "@/stores/builder/queries"
  import { integrations } from "@/stores/builder/integrations"
  import { restTemplates } from "@/stores/builder/restTemplates"
  import { isEqual } from "lodash"
  import { writable } from "svelte/store"
  import { fade } from "svelte/transition"
  import Portal from "svelte-portal"
  import {
    Heading,
    Button,
    Select,
    Input,
    Layout,
    Tabs,
    Tab,
    ActionButton,
    RadioGroup,
    notifications,
    Banner,
    Icon,
    Divider,
  } from "@budibase/bbui"
  import {
    BodyType,
    type Query,
    type Datasource,
    type ImportEndpoint,
    type RestTemplateSpec,
    type RestTemplateId,
    type PreviewQueryResponse,
    type UIInternalDatasource,
    type EnrichedBinding,
  } from "@budibase/types"
  import {
    customQueryIconColor,
    getRestTemplateQueryDisplayName,
    QUERY_VERB_MAP,
  } from "@/helpers/data/utils"
  import {
    RestBodyTypes,
    PaginationTypes,
    PaginationLocations,
  } from "@/constants/backend"
  import KeyValueBuilder from "./KeyValueBuilder.svelte"
  import APIEndpointVerbBadge from "./APIEndpointVerbBadge.svelte"
  import CustomEndpointInput from "./CustomEndpointInput.svelte"
  import TemplateEndpointInput from "./TemplateEndpointInput.svelte"
  import DescriptionViewer from "@/components/common/DescriptionViewer.svelte"
  import {
    buildUrl,
    buildQueryBindings,
    buildDynamicVariables,
    rebuildVariables,
    prettifyQueryRequestBody,
    getSelectedQuery,
    buildQuery,
    constructFullPath,
    validateQuery,
    runQuery,
    keyValueArrayToRecord,
    getDefaultRestAuthConfig,
    isValidEndpointUrl,
  } from "./query"
  import { applyBaseUrl } from "@budibase/shared-core"
  import restUtils from "@/helpers/data/utils"
  import { getRestTemplateImportInfoRequest } from "@/helpers/restTemplates"
  import ConnectedQueryScreens from "./ConnectedQueryScreens.svelte"
  import RestBodyInput from "./RestBodyInput.svelte"
  import CodeEditor from "../common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "../common/CodeEditor"
  import { readableToRuntimeMap, runtimeToReadableMap } from "@/dataBinding"
  import ResponsePanel from "./ResponsePanel.svelte"
  import ConnectionSelect from "./rest/ConnectionSelect.svelte"
  import AccessLevelSelect from "@/components/integration/AccessLevelSelect.svelte"
  import { getErrorMessage } from "@/helpers/errors"
  import { confirm } from "@/helpers"
  import {
    urlParamHighlightPlugin,
    urlParamHighlightTheme,
  } from "../common/CodeEditor/urlParamHighlight"
  import { environment } from "@/stores/portal"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { onMount } from "svelte"

  export let queryId
  export let datasourceId: string | undefined = undefined
  export let initialDatasourceId: string | undefined = undefined

  $beforeUrlChange
  $: goto = $gotoStore

  type EndpointWithIcon = ImportEndpoint & {
    icon?: {
      component: typeof APIEndpointVerbBadge
      props: { verb?: string; color?: string }
    }
  }
  // Expanded sidebar dimensions
  const EXPANDED_MARGIN = 0.15 // 15vh/15vw margins
  const EXPANDED_SIZE = 0.7 // 70vh/70vw size
  const sidebarExpanded = writable(false)

  let _pickedDatasourceId: string | undefined =
    datasourceId || initialDatasourceId
  let connectionSelectRef: ConnectionSelect
  let sidebarElement: HTMLDivElement
  let isTransitioning = false

  let selectedEndpointOption: EndpointWithIcon | undefined
  let endpoints: ImportEndpoint[] | undefined
  let selectedAuth = false
  let endpointsLoading = false
  let endpointLoadError: string | undefined
  let queryParams: Record<string, string> | undefined = undefined
  let localDynamicVariables: Record<string, string> | undefined = undefined
  let savingQuery = false,
    runningQuery = false
  let originalBuiltQuery: Query | undefined = undefined
  let defaultSpecServerUrl: string | undefined = undefined
  let response: PreviewQueryResponse
  let editableQuery: Query | undefined
  let datasource: Datasource | UIInternalDatasource | undefined
  let enabledHeaders: Record<string, boolean> = {}
  let globalDynamicRequestBindings: EnrichedBinding[] = []
  let dataSourceStaticBindings: EnrichedBinding[] = []
  let restBindings: EnrichedBinding[] = []
  let mergedBindings: EnrichedBinding[] = []
  let bindingPreviewContext: Record<string, any> = {}
  let baseUrlOptions: { label: string; url: string }[] = []

  // Custom query mode state
  let customUrl: string = ""
  let selectedChildTemplateId: string | undefined

  // ── DATASOURCE / MODE ────────────────────────────────────────────────────
  $: draftDatasourceId = $workspaceConnections.draft?.query?.datasourceId
  $: selectedDatasourceId =
    datasourceId || _pickedDatasourceId || draftDatasourceId
  $: datasourceLookupId = selectedDatasourceId || storeQuery?.datasourceId
  $: datasource = structuredClone(
    $datasources.list.find(d => d._id === datasourceLookupId)
  )
  $: isCustomMode = !hasRestTemplate(datasource)
  // ── QUERY INITIALISATION ─────────────────────────────────────────────────
  $: if (!datasourceId && queryId) {
    const dsId = $queries.list.find(q => q._id === queryId)?.datasourceId
    if (dsId && dsId !== _pickedDatasourceId) {
      _pickedDatasourceId = dsId
    }
  }

  $: storeQuery = queryId
    ? resolveStoreQuery($queries.list, queryId, undefined)
    : resolveStoreQuery($queries.list, undefined, selectedDatasourceId)
  $: isNewQuery = !storeQuery?._id

  $: if (!editableQuery || storeQuery?._id !== editableQuery._id) {
    editableQuery = structuredClone(storeQuery)
    queryParams = undefined
    originalBuiltQuery = undefined
    selectedAuth = false
    if (isCustomMode) {
      initCustomUrlFields(editableQuery?.fields?.path)
    }
  }

  $: if (editableQuery) {
    ensureQueryDefaults(editableQuery)
    syncEndpointFromQuery(editableQuery, endpoints)
  }

  // Reset endpoint state when the datasource changes
  $: if (selectedDatasourceId) {
    selectedEndpointOption = undefined
    selectedChildTemplateId = undefined
    endpoints = undefined
    endpointLoadError = undefined
    queryParams = undefined
    originalBuiltQuery = undefined
  }

  // ── CUSTOM MODE URL ───────────────────────────────────────────────────────
  $: {
    const connUrl = getDatasourceBaseUrl(datasource)
    baseUrlOptions = connUrl
      ? [{ label: "Connection base url", url: connUrl }]
      : []
  }
  $: if (!hasRestTemplate(datasource) && isNewQuery) {
    customUrl = getDatasourceBaseUrl(datasource) || ""
  }

  // ── TEMPLATE MODE URL ─────────────────────────────────────────────────────
  // config.url takes priority; falls back to servers[0] from the spec
  $: templateBaseUrl = getDatasourceBaseUrl(datasource) || defaultSpecServerUrl

  $: requestUrl = isCustomMode ? customUrl : editableQuery?.fields?.path

  // Swap stored base for config.url so CodeMirror shows the resolved URL
  $: displayBaseUrl =
    !isCustomMode && (templateBaseUrl ?? defaultSpecServerUrl)
      ? applyBaseUrl(
          requestUrl ?? "",
          (templateBaseUrl ?? defaultSpecServerUrl)!
        )
      : requestUrl

  $: effectiveUrl = buildUrl(displayBaseUrl, queryParams, mergedBindings)

  // ── QUERY DATA & BINDINGS ─────────────────────────────────────────────────
  $: queryString = editableQuery?.fields.queryString
  $: isGet = editableQuery?.queryVerb === "read"
  $: schema = editableQuery?.schema
  $: nestedSchemaFields = editableQuery?.nestedSchemaFields
  $: requestBindings = editableQuery
    ? restUtils.queryParametersToKeyValue(editableQuery.parameters)
    : {}
  $: pagination = editableQuery?.fields.pagination
  $: if (isCustomMode && editableQuery && !editableQuery.fields.pagination) {
    editableQuery.fields.pagination = {}
  }

  $: if (editableQuery) {
    enabledHeaders = restUtils.flipHeaderState(
      editableQuery.fields.disabledHeaders || {}
    )
  }

  $: ({ dynamicVariables: computedDynamicVariables, globalDynamicBindings } =
    datasource && editableQuery
      ? buildDynamicVariables(datasource, editableQuery._id)
      : { dynamicVariables: {}, globalDynamicBindings: {} })
  $: dynamicVariables = localDynamicVariables ?? computedDynamicVariables

  // $environment is referenced to force recalculation when env vars change
  $: {
    $environment
    ;({
      globalDynamicRequestBindings,
      dataSourceStaticBindings,
      restBindings,
      mergedBindings,
      bindingPreviewContext,
    } = buildQueryBindings(
      datasource,
      requestBindings,
      globalDynamicBindings,
      dynamicVariables
    ))
  }

  // One-shot init from queryString — queryParams is user-editable after this
  $: if (!queryParams && queryString && mergedBindings) {
    queryParams = runtimeToReadableMap(
      mergedBindings,
      restUtils.breakQueryString(encodeURI(queryString))
    )
  }

  $: runtimeUrlQueries = readableToRuntimeMap(mergedBindings, queryParams)
  $: prettyBody = editableQuery?.fields?.requestBody
    ? prettifyQueryRequestBody(editableQuery, mergedBindings)
    : undefined

  // ── BUILT QUERY & DIRTY STATE ─────────────────────────────────────────────
  $: builtQuery =
    editableQuery &&
    schema &&
    buildQuery(
      {
        ...editableQuery,
        fields: { ...editableQuery.fields, path: requestUrl },
      },
      runtimeUrlQueries,
      requestBindings,
      mergedBindings,
      enabledHeaders || {},
      schema,
      nestedSchemaFields
    )

  $: if (builtQuery && !originalBuiltQuery) {
    originalBuiltQuery = structuredClone(builtQuery)
  }

  $: if (editableQuery && datasource && !selectedAuth) {
    const withAuth = applyDefaultAuth(editableQuery, datasource)
    if (withAuth) editableQuery = withAuth
  }

  $: queryDirty =
    (!!originalBuiltQuery && !isEqual(builtQuery, originalBuiltQuery)) ||
    !!localDynamicVariables

  $: if (isNewQuery && $workspaceConnections.draft && !saveDisabled) {
    workspaceConnections.markDraftDirty()
  }

  // BB Rest template specs
  $: template =
    hasRestTemplate(datasource) && $restTemplates
      ? restTemplates.get(getRestTemplateIdentifier(datasource))
      : undefined
  $: isSharedCollection =
    template?.connectionMode === "shared" &&
    (template.templates?.length ?? 0) > 1
  $: isIndependentCollection = template?.connectionMode === "independent"
  $: activeChildTemplate = isIndependentCollection
    ? (template?.templates?.find(
        t => t.id === getRestTemplateIdentifier(datasource)
      ) ?? template?.templates?.[0])
    : isSharedCollection && selectedChildTemplateId
      ? template?.templates?.find(t => t.id === selectedChildTemplateId)
      : undefined
  $: spec =
    isIndependentCollection || isSharedCollection
      ? activeChildTemplate?.specs?.[0]
      : template?.specs?.[0]

  $: if (
    spec &&
    !endpoints &&
    !endpointsLoading &&
    !endpointLoadError &&
    !(editableQuery?._id && editableQuery?.restTemplateMetadata)
  ) {
    loadEndpoints(spec)
  }

  $: endpointOptions = buildEndpointOptions(endpoints, selectedEndpointOption)
  $: endpointVerbColor = isCustomMode
    ? customQueryIconColor(editableQuery?.queryVerb)
    : selectedEndpointOption?.icon?.props?.color
  $: endpointDocs = selectedEndpointOption?.docsUrl
  $: if (
    editableQuery &&
    isNewQuery &&
    selectedEndpointOption &&
    selectedEndpointOption.operationId !==
      editableQuery.restTemplateMetadata?.operationId
  ) {
    editableQuery = applyEndpointDefaults(
      editableQuery,
      selectedEndpointOption,
      defaultSpecServerUrl || templateBaseUrl
    )
    if ($workspaceConnections.draft) {
      workspaceConnections.updateDraftQuery({
        queryVerb: editableQuery.queryVerb,
        name: editableQuery.name,
      })
    }
  }

  // ── SAVE / RUN STATE ──────────────────────────────────────────────────────
  $: isValidCustomUrl = !isCustomMode || isValidEndpointUrl(requestUrl)
  $: existingQueryUnchanged = !isNewQuery && !queryDirty
  $: newQueryIncomplete =
    isNewQuery && (isCustomMode ? !requestUrl : !selectedEndpointOption)
  $: saveDisabled =
    savingQuery ||
    existingQueryUnchanged ||
    newQueryIncomplete ||
    !isValidCustomUrl

  const initCustomUrlFields = (fullPath: string | undefined) => {
    customUrl = fullPath || getDatasourceBaseUrl(datasource) || ""
  }

  const getDatasourceBaseUrl = (
    ds: Datasource | UIInternalDatasource | undefined
  ): string | undefined => (ds as Datasource)?.config?.url as string | undefined

  const resolveStoreQuery = (
    list: Query[] | undefined,
    qId: string | undefined,
    dsId: string | undefined
  ) => {
    if (!list) return undefined
    const existingDsId = qId
      ? list.find(q => q._id === qId)?.datasourceId
      : undefined
    const effectiveDsId = existingDsId || dsId
    return effectiveDsId
      ? getSelectedQuery(qId ?? "", effectiveDsId)
      : undefined
  }

  const applyDefaultAuth = (
    q: Query,
    ds: Datasource | UIInternalDatasource
  ): Query | undefined => {
    const defaultAuth = getDefaultRestAuthConfig(ds)
    if (!defaultAuth) {
      return
    }
    if (!q.fields?.authConfigId && !q.fields?.authConfigType) {
      return {
        ...q,
        fields: {
          ...q.fields,
          authConfigId: defaultAuth.authConfigId,
          authConfigType: defaultAuth.authConfigType,
        },
      }
    }
  }

  const loadEndpoints = async (spec?: RestTemplateSpec) => {
    const request = getRestTemplateImportInfoRequest(spec)
    if (!request) {
      return
    }
    try {
      endpointsLoading = true
      const resp = await queries.fetchImportInfo(request)
      const { endpoints: respEndpoints, url } = resp || {}
      endpointLoadError = undefined
      if (respEndpoints) {
        endpoints = respEndpoints
      }
      if (url) {
        defaultSpecServerUrl = url
      }
    } catch (err) {
      endpointLoadError = getErrorMessage(err)
      notifications.error(`Error importing template - ${endpointLoadError}`)
    } finally {
      endpointsLoading = false
    }
  }

  const getEndpointOptions = (
    endpoints: ImportEndpoint[]
  ): EndpointWithIcon[] => {
    return endpoints.reduce<EndpointWithIcon[]>((acc, e) => {
      const verb = e.method
      const color = customQueryIconColor(e.queryVerb)
      acc.push({
        ...e,
        icon: verb
          ? {
              component: APIEndpointVerbBadge,
              props: { verb, color },
            }
          : undefined,
      })
      return acc
    }, [])
  }

  // Prepend selected endpoint so it's always visible even if not in the loaded list
  const buildEndpointOptions = (
    endpoints: ImportEndpoint[] | undefined,
    selected: EndpointWithIcon | undefined
  ): EndpointWithIcon[] => {
    const options = getEndpointOptions(endpoints || [])
    if (selected && !options.find(o => o.id === selected.id)) {
      return [selected, ...options]
    }
    return options
  }

  /**
   * This initialises the query data with either the actual query or a default
   * For queries without request metadata, it will also perform a sync
   *
   * @param query
   * @param endpoints
   */
  const syncEndpointFromQuery = (
    query: Query,
    endpoints: ImportEndpoint[] | undefined
  ) => {
    // For existing queries with metadata, build endpoint from metadata
    if (query._id && query.restTemplateMetadata) {
      const metadata = query.restTemplateMetadata
      const method = QUERY_VERB_MAP[query.queryVerb]
      const endpointName = getRestTemplateQueryDisplayName(query)

      const endpoint = {
        id:
          metadata.operationId ||
          `${method.toLowerCase()}::${metadata.originalPath}`,
        name: endpointName,
        method,
        path: metadata.originalPath || "",
        description: metadata.description || "",
        queryVerb: query.queryVerb,
        docsUrl: metadata.docsUrl,
        icon: {
          component: APIEndpointVerbBadge,
          props: {
            verb: method,
            color: customQueryIconColor(query.queryVerb),
          },
        },
      }

      selectedEndpointOption = endpoint
      if (metadata.restTemplateId) {
        selectedChildTemplateId = metadata.restTemplateId
      }
      return
    }

    parseLegacyQuery(query, endpoints)
  }

  /**
   * For queries without metadata, reverse engineer the path to find the endpoint
   * This handles old queries that don't have metadata yet
   *
   * Can be removed at some point in the future
   *
   * @param query
   * @param endpoints
   */
  const parseLegacyQuery = (
    query: Query,
    endpoints: ImportEndpoint[] | undefined
  ) => {
    if (endpoints && query.fields?.path && !query.restTemplateMetadata) {
      try {
        const url = new URL(query.fields.path)
        const basePath = decodeURIComponent(url.pathname)
        const sanitized = basePath.replace(/\{\{/g, "{").replace(/\}\}/g, "}")

        const found = endpoints.find(e => {
          return (
            e.method === QUERY_VERB_MAP[query.queryVerb] && e.path === sanitized
          )
        })

        if (found) {
          selectedEndpointOption = {
            ...found,
            icon: {
              component: APIEndpointVerbBadge,
              props: {
                verb: found.method,
                color: customQueryIconColor(found.queryVerb),
              },
            },
          }
        } else {
          console.error("No matching endpoint found in list")
        }
      } catch (err) {
        console.error("Failed to parse path URL:", err)
      }
    }
  }

  // SAVE/PREVIEW
  const saveQuery = async (redirectIfNew = true) => {
    if (!builtQuery || !datasource) {
      return
    }
    // Fall back to the endpoint operation name only if the query has no name set
    const effectiveName =
      builtQuery.name || selectedEndpointOption?.name || "Untitled request"
    savingQuery = true
    try {
      const baseQuery =
        builtQuery._id &&
        storeQuery?._rev &&
        storeQuery._rev !== builtQuery._rev
          ? { ...builtQuery, _rev: storeQuery._rev }
          : builtQuery
      const queryToSave = { ...baseQuery, name: effectiveName }
      const isNew = !queryToSave._rev

      const datasourceType = datasource?.source
      const integrationInfo = $integrations[datasourceType]

      const { _id } = await queries.save(
        queryToSave.datasourceId,
        queryToSave,
        datasourceType
      )

      const existingVariables = datasource?.config?.dynamicVariables || []
      const updatedVariables = rebuildVariables(
        _id!,
        dynamicVariables,
        existingVariables
      )
      const variablesChanged = !isEqual(existingVariables, updatedVariables)

      if (variablesChanged && datasource.config) {
        datasource.config.dynamicVariables = updatedVariables
        await datasources.save({
          integration: integrationInfo!,
          datasource: datasource as Datasource,
        })
      }

      notifications.success(`Request saved successfully`)

      if (isNew && redirectIfNew) {
        markSkipUnsavedPrompt(_id)
        workspaceConnections.discardDraft()
        goto(`/builder/workspace/${$appStore.appId}/apis/query/${_id}`)
        return { ok: true }
      }

      const updatedQuery = getSelectedQuery(_id!, builtQuery.datasourceId)
      if (!updatedQuery) {
        throw new Error("Could not refresh query")
      }

      editableQuery = structuredClone(updatedQuery)
      originalBuiltQuery = undefined
      localDynamicVariables = undefined

      return { ok: true }
    } catch (err) {
      notifications.error(`Error saving query`)
    } finally {
      savingQuery = false
    }

    return { ok: false }
  }

  const previewQuery = async () => {
    if (!editableQuery || !builtQuery || !requestUrl) return
    if (!isCustomMode && !selectedEndpointOption) return
    try {
      validateQuery(
        effectiveUrl,
        editableQuery.fields.requestBody,
        requestBindings,
        editableQuery?.fields?.headers || {}
      )
      runningQuery = true

      const result = await runQuery(builtQuery, schema)
      response = result.response

      // Update query object with schema from preview
      editableQuery = {
        ...editableQuery,
        schema: result.schema,
        nestedSchemaFields: result.nestedSchemaFields,
      }

      if (result.response.rows.length === 0) {
        notifications.info("Request did not return any data")
      } else {
        notifications.success("Request sent successfully")
      }
    } catch (error) {
      notifications.error(`Query Error: ${getErrorMessage(error)}`)
    }
    runningQuery = false
  }

  const onConnectionChange = (e: CustomEvent) => {
    const {
      authConfigId,
      authConfigType,
      datasourceId: newDatasourceId,
    } = e.detail
    selectedAuth = true
    if (
      isNewQuery &&
      newDatasourceId &&
      newDatasourceId !== _pickedDatasourceId
    ) {
      _pickedDatasourceId = newDatasourceId
      const newQuery = getSelectedQuery("", newDatasourceId) as Query
      editableQuery = {
        ...newQuery,
        fields: { ...newQuery.fields, authConfigId, authConfigType },
      } as Query
      const ds = $datasources.list.find(d => d._id === newDatasourceId) as
        | Datasource
        | undefined
      const templateId = ds?.restTemplateId as string | undefined
      workspaceConnections.updateDraft({
        templateId,
        query: {
          datasourceId: newDatasourceId,
          queryVerb: templateId ? undefined : "read",
          name: "Untitled request",
        },
      })
    } else if (editableQuery) {
      editableQuery = {
        ...editableQuery,
        fields: { ...editableQuery.fields, authConfigId, authConfigType },
      } as Query
    }
  }

  // UPDATE HANDLERS
  const onUpdateParams = (
    e: CustomEvent<{
      fields: Array<{ name: string; value: string }>
      activity: Record<string, boolean>
    }>
  ) => {
    queryParams = keyValueArrayToRecord(e.detail.fields)
  }

  const onUpdateBindings = (
    e: CustomEvent<{
      fields: Array<{ name: string; value: string }>
      activity: Record<string, boolean>
    }>
  ) => {
    const newBindings = keyValueArrayToRecord(e.detail.fields)
    editableQuery = {
      ...editableQuery!,
      parameters: restUtils.keyValueToQueryParameters(newBindings),
    }
  }

  const setPaginationField = (field: string, value: unknown) => {
    if (editableQuery) {
      editableQuery = {
        ...editableQuery,
        fields: {
          ...editableQuery.fields,
          pagination: {
            ...editableQuery.fields.pagination,
            [field]: value,
          },
        },
      }
    }
  }

  const onUpdateHeaders = (
    e: CustomEvent<{
      fields: Array<{ name: string; value: string }>
      activity: Record<string, boolean>
    }>
  ) => {
    if (editableQuery) {
      editableQuery.fields.headers = keyValueArrayToRecord(e.detail.fields)
      editableQuery.fields.disabledHeaders = restUtils.flipHeaderState(
        e.detail.activity
      )
    }
  }

  const onUpdateBody = (e: CustomEvent<{ requestBody: any }>) => {
    if (editableQuery) {
      editableQuery.fields.requestBody = e.detail.requestBody
    }
  }

  const onUpdateBodyType = (e: CustomEvent<BodyType>) => {
    if (editableQuery) {
      editableQuery.fields.bodyType = e.detail
    }
  }

  const updateFlag = async (flag: string, value: any) => {
    try {
      await flags.updateFlag(flag, value)
    } catch (error) {
      notifications.error("Error updating flag")
    }
  }

  // This behaviour needs to be turned into a component!
  // Maybe add a slot behaviour to allow any component to expand to a modal?
  const moveToExpanded = (node: HTMLElement) => {
    let initialized = false

    const unsubscribe = sidebarExpanded.subscribe(expanded => {
      // Skip the initial subscription call to avoid moving the node on mount
      if (!initialized) {
        initialized = true
        return
      }

      if (expanded) {
        // Move to expanded portal sidebar - need to wait for it to be rendered
        setTimeout(() => {
          const expandedTarget = document.querySelector(
            ".side-bar.expanded .side-bar-content"
          )
          if (expandedTarget && node.parentNode !== expandedTarget) {
            expandedTarget.appendChild(node)
          }
        }, 0)
      } else {
        // Move back to collapsed sidebar
        const collapsedTarget = document.querySelector(
          ".side-bar.main .side-bar-content"
        )
        if (collapsedTarget && node.parentNode !== collapsedTarget) {
          collapsedTarget.appendChild(node)
        }
      }
    })

    return {
      destroy() {
        unsubscribe()
      },
    }
  }

  const sidebarTransition = (
    _node: HTMLElement,
    params: { direction: "in" | "out" }
  ) => {
    if (!sidebarElement) {
      return { duration: 260 }
    }

    // Get the position of the collapsed sidebar (starting position)
    const rect = sidebarElement.getBoundingClientRect()
    const startTop = rect.top
    const startRight = window.innerWidth - rect.right
    const startWidth = rect.width
    const startHeight = rect.height

    // Ending position when expanded (uses constants that match CSS .side-bar.expanded)
    const endTop = window.innerHeight * EXPANDED_MARGIN
    const endRight = window.innerWidth * EXPANDED_MARGIN
    const endWidth = window.innerWidth * EXPANDED_SIZE
    const endHeight = window.innerHeight * EXPANDED_SIZE

    isTransitioning = true

    // For 'out' transition, reset isTransitioning after the duration
    if (params.direction === "out") {
      setTimeout(() => {
        isTransitioning = false
      }, 260)
    }
    return {
      duration: 260,
      css: (t: number) => {
        // Ease in-out function and duration, taken from Drawer component
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const currentTop = startTop + (endTop - startTop) * eased
        const currentRight = startRight + (endRight - startRight) * eased
        const currentWidth = startWidth + (endWidth - startWidth) * eased
        const currentHeight = startHeight + (endHeight - startHeight) * eased

        return `
          top: ${currentTop}px;
          right: ${currentRight}px;
          width: ${currentWidth}px;
          height: ${currentHeight}px;
        `
      },
    }
  }

  const ensureQueryDefaults = (target: Query) => {
    if (!target.fields?.disabledHeaders) {
      target.fields.disabledHeaders = {}
    }
    for (let header of Object.keys(target.fields?.headers || {})) {
      if (!target.fields.disabledHeaders[header]) {
        target.fields.disabledHeaders[header] = false
      }
    }
    if (!target.transformer) {
      target.transformer = "return data"
    }
    if (!target.fields.bodyType) {
      target.fields.bodyType = target.fields.requestBody
        ? BodyType.JSON
        : BodyType.NONE
    }
  }

  const applyEndpointDefaults = (
    sourceQuery: Query,
    endpoint: EndpointWithIcon,
    templateBaseUrl?: string
  ): Query => {
    const updated = structuredClone(sourceQuery)
    const fullPath =
      endpoint && templateBaseUrl
        ? constructFullPath(templateBaseUrl, endpoint?.path || "")
        : ""
    const defaultBindings = endpoint?.defaultBindings || {}
    const staticVariables = datasource?.config?.staticVariables || {}
    const allBindings = { ...defaultBindings }
    for (const name of Object.keys(staticVariables)) {
      allBindings[name] = `{{ ${name} }}`
    }
    const parameters = Object.entries(allBindings).map(
      ([name, defaultValue]) => ({
        name,
        default: defaultValue,
      })
    )
    const bodyType =
      endpoint?.bodyType ||
      (endpoint?.originalRequestBody ? BodyType.JSON : BodyType.NONE)
    let requestBody = endpoint?.originalRequestBody
    const isKeyValueBodyType =
      bodyType === BodyType.FORM_DATA || bodyType === BodyType.ENCODED
    if (requestBody && typeof requestBody === "object" && !isKeyValueBodyType) {
      requestBody = JSON.stringify(requestBody, null, 2)
    }
    const headers = endpoint?.headers || {}
    const disabledHeaders: Record<string, boolean> = {}
    for (const header of Object.keys(headers)) {
      disabledHeaders[header] = false
    }
    updated.datasourceId = selectedDatasourceId!
    // Only apply the endpoint name if no custom name has been set.
    // A name is considered custom if it differs from the previous endpoint's operation name.
    const previousOperationName = sourceQuery.restTemplateMetadata?.originalName
    const hasCustomName =
      updated.name &&
      previousOperationName &&
      updated.name !== previousOperationName
    if (!hasCustomName) {
      updated.name = endpoint?.name || updated.name
    }
    updated.queryVerb = endpoint?.queryVerb || updated.queryVerb
    if (!updated.fields?.disabledHeaders) {
      updated.fields.disabledHeaders = {}
    }
    updated.fields = {
      ...updated.fields,
      path: fullPath,
      queryString: endpoint?.queryString || "",
      headers,
      disabledHeaders,
      requestBody,
      bodyType,
    }
    updated.parameters = parameters
    updated.transformer = updated.transformer || "return data"
    if (!updated.fields.bodyType) {
      updated.fields.bodyType = BodyType.NONE
    }
    updated.schema = updated.schema || {}
    updated.readable = true
    updated.restTemplateMetadata = endpoint
      ? {
          originalName: endpoint.name,
          operationId: endpoint.operationId,
          docsUrl: endpoint.docsUrl,
          description: endpoint.description,
          originalPath: endpoint.originalPath,
          originalRequestBody: endpoint.originalRequestBody,
          defaultBindings: endpoint.defaultBindings,
          ...(selectedChildTemplateId
            ? { restTemplateId: selectedChildTemplateId as RestTemplateId }
            : {}),
        }
      : undefined

    return updated
  }

  $beforeUrlChange(async () => {
    const dirty = isNewQuery ? !saveDisabled : queryDirty
    if (!dirty || consumeSkipUnsavedPrompt(editableQuery?._id)) {
      return true
    }
    return await confirm({
      title: "Your changes are not saved",
      body: "Your changes are not yet saved. Do you want to save them before leaving?",
      okText: "Save and continue",
      cancelText: "Discard and continue",
      size: "M",
      onConfirm: async () => {
        const saveResult = await saveQuery(false)
        if (!saveResult?.ok) {
          return false
        }
        return true
      },
      onCancel: () => {
        workspaceConnections.discardDraft()
        return true
      },
      onClose: () => false,
    })
  })

  onMount(() => {
    if (!$environment.loaded) {
      environment.loadVariables()
    }
    if ($workspaceConnections.draft && !datasourceId) {
      connectionSelectRef.open()
    }
  })
</script>

<div class="request-heading">
  <div class="heading">
    <div class="api-details">
      {#if editableQuery}
        <input
          class="query-name-input"
          placeholder="Untitled request"
          value={editableQuery.name}
          on:keydown={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
          on:blur={e => {
            if (editableQuery) {
              editableQuery = { ...editableQuery, name: e.currentTarget.value }
              if (isNewQuery && $workspaceConnections.draft) {
                workspaceConnections.updateDraftQuery({
                  name: e.currentTarget.value,
                })
              }
            }
          }}
        />
      {/if}
    </div>
    <div class="actions">
      <div class="grouped">
        {#if editableQuery}
          <div class="access">
            <AccessLevelSelect query={editableQuery} label="Access" />
          </div>
        {/if}
        {#if endpointDocs}
          <ActionButton
            quiet
            icon="arrow-square-up-right"
            on:click={() => {
              window.open(endpointDocs, "_blank")
            }}
          >
            Docs
          </ActionButton>
        {/if}
        {#if editableQuery?._id}
          <ConnectedQueryScreens
            icon={"link-simple-horizontal-break"}
            sourceId={editableQuery._id}
            buttonText="Usage"
          />
        {/if}
      </div>
      <div class="save-btn">
        <Button cta disabled={saveDisabled} on:click={() => saveQuery()}>
          Save
        </Button>
      </div>
    </div>
  </div>
  <div class="request" style:--verb-color={endpointVerbColor}>
    <div class="request-top">
      <ConnectionSelect
        bind:this={connectionSelectRef}
        authConfigId={editableQuery?.fields?.authConfigId}
        restTemplateId={datasource?.restTemplateId}
        datasourceId={datasourceLookupId}
        disabled={!isNewQuery}
        editText="Edit connection + auth"
        on:change={onConnectionChange}
      />
      {#if isCustomMode}
        <div class="picker">
          <CustomEndpointInput
            disabled={!datasource}
            verb={editableQuery?.queryVerb ?? "read"}
            url={customUrl}
            {baseUrlOptions}
            on:verbChange={e => {
              if (editableQuery) {
                editableQuery.queryVerb = e.detail
                if (e.detail === "read") {
                  editableQuery.fields.bodyType = BodyType.NONE
                  editableQuery.fields.requestBody = undefined
                }
                if (isNewQuery && $workspaceConnections.draft) {
                  workspaceConnections.updateDraftQuery({ queryVerb: e.detail })
                }
              }
            }}
            on:urlChange={e => {
              customUrl = e.detail
              if (editableQuery)
                editableQuery.fields.path = (e.detail ?? "").split("?")[0]
            }}
            on:urlCommit={e => {
              const [base, qs] = (e.detail ?? "").split("?")
              if (editableQuery) editableQuery.fields.path = base
              if (qs) {
                customUrl = base
                const newParams = runtimeToReadableMap(
                  mergedBindings,
                  restUtils.breakQueryString(qs)
                )
                queryParams = { ...(queryParams ?? {}), ...newParams }
              }
            }}
          />
        </div>
      {:else}
        <div class="picker">
          <TemplateEndpointInput
            templates={isSharedCollection ? (template?.templates ?? []) : []}
            {endpointOptions}
            selectedEndpoint={selectedEndpointOption}
            {endpointsLoading}
            disabled={!selectedDatasourceId}
            readonly={!!editableQuery?._id}
            selectedChildId={selectedChildTemplateId}
            on:childChange={e => {
              selectedChildTemplateId = e.detail
              selectedEndpointOption = undefined
              endpoints = undefined
              endpointLoadError = undefined
            }}
            on:endpointChange={e => {
              selectedEndpointOption = e.detail
              if (!e.detail) {
                endpoints = undefined
                endpointLoadError = undefined
                queryParams = undefined
                originalBuiltQuery = undefined
                if (editableQuery) {
                  editableQuery = getSelectedQuery(
                    "",
                    editableQuery.datasourceId
                  ) as Query
                }
              }
            }}
          />
        </div>
      {/if}
    </div>
    <div class="request-bottom">
      <div class="endpoint">
        <CodeEditor
          value={effectiveUrl}
          mode={EditorModes.Handlebars}
          aiEnabled={false}
          readonly
          lineWrapping={false}
          extraExtensions={[urlParamHighlightPlugin, urlParamHighlightTheme]}
        />
      </div>
      <div
        class="send"
        class:loaded={isCustomMode ? !!customUrl : !!selectedEndpointOption}
      >
        <Button
          primary
          disabled={isCustomMode
            ? !customUrl || runningQuery
            : !selectedEndpointOption || runningQuery}
          icon="paper-plane-right"
          on:click={previewQuery}
        >
          Send
        </Button>
      </div>
    </div>
  </div>
</div>
<div class="bottom">
  <div class="wrap-divider">
    <Divider noMargin />
  </div>
  <div class="wrap">
    <div class="main">
      <Layout noPadding>
        {#if !isCustomMode && selectedEndpointOption}
          <div class="details">
            <Layout noPadding gap="XS">
              <Heading size="XS">{selectedEndpointOption?.name || ""}</Heading>
              <DescriptionViewer
                description={selectedEndpointOption?.description}
                label={""}
                baseUrl={endpointDocs}
              />
            </Layout>
          </div>
        {/if}
        <div class="config">
          <Layout noPadding gap="S">
            {#key selectedEndpointOption?.id}
              <Tabs
                selected="Bindings"
                quiet
                noPadding
                noHorizPadding
                onTop
                disabled={isCustomMode ? !datasource : !selectedEndpointOption}
              >
                <Tab title="Bindings">
                  <KeyValueBuilder
                    defaults={requestBindings}
                    tooltip="Set the name of the binding which can be used in Handlebars statements throughout your query"
                    name="binding"
                    headings
                    keyPlaceholder="Binding name"
                    valuePlaceholder="Default"
                    bindings={[
                      ...dataSourceStaticBindings,
                      ...restBindings,
                      ...globalDynamicRequestBindings,
                    ]}
                    context={bindingPreviewContext}
                    on:change={onUpdateBindings}
                    actionButtonDisabled={isCustomMode
                      ? !datasource
                      : !selectedEndpointOption}
                  />
                </Tab>
                <Tab title="Params">
                  {#key queryParams}
                    <KeyValueBuilder
                      name="param"
                      defaults={queryParams}
                      headings
                      bindings={mergedBindings}
                      context={bindingPreviewContext}
                      on:change={onUpdateParams}
                    />
                  {/key}
                </Tab>
                <Tab title="Headers">
                  <KeyValueBuilder
                    defaults={editableQuery?.fields.headers}
                    activity={enabledHeaders}
                    toggle
                    name="header"
                    headings
                    bindings={mergedBindings}
                    context={bindingPreviewContext}
                    on:change={onUpdateHeaders}
                  />
                </Tab>
                <Tab title="Body">
                  <span class="bodyType-radio-group">
                    <RadioGroup
                      value={editableQuery?.fields?.bodyType}
                      options={isGet ? [RestBodyTypes[0]] : RestBodyTypes}
                      direction="horizontal"
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.value}
                      on:change={onUpdateBodyType}
                    />
                  </span>
                  <RestBodyInput
                    bodyType={editableQuery?.fields.bodyType}
                    requestBody={prettyBody}
                    on:change={onUpdateBody}
                  />
                </Tab>
                {#if isCustomMode}
                  <Tab title="Pagination">
                    <div class="pagination">
                      {#if pagination}
                        <Select
                          label="Pagination type"
                          value={pagination.type}
                          options={PaginationTypes}
                          placeholder="None"
                          on:change={e => setPaginationField("type", e.detail)}
                        />
                        {#if pagination.type}
                          <Select
                            label="Pagination parameters location"
                            value={pagination.location}
                            options={PaginationLocations}
                            placeholder="Choose where to send pagination parameters"
                            on:change={e =>
                              setPaginationField("location", e.detail)}
                          />
                          <Input
                            label={pagination.type === "page"
                              ? "Page number parameter name"
                              : "Request cursor parameter name"}
                            value={pagination.pageParam}
                            on:change={e =>
                              setPaginationField("pageParam", e.detail)}
                          />
                          <Input
                            label={pagination.type === "page"
                              ? "Page size parameter name"
                              : "Request limit parameter name"}
                            value={pagination.sizeParam}
                            on:change={e =>
                              setPaginationField("sizeParam", e.detail)}
                          />
                          {#if pagination.type === "cursor"}
                            <Input
                              label="Response body parameter name for cursor"
                              value={pagination.responseParam}
                              on:change={e =>
                                setPaginationField("responseParam", e.detail)}
                            />
                          {/if}
                        {/if}
                      {/if}
                    </div>
                  </Tab>
                {/if}
                <Tab title="Transformer">
                  <Layout noPadding>
                    {#if !$flags.queryTransformerBanner}
                      <Banner
                        extraButtonText="Learn more"
                        extraButtonAction={() =>
                          window.open(
                            "https://docs.budibase.com/docs/transformers"
                          )}
                        on:change={() =>
                          updateFlag("queryTransformerBanner", true)}
                      >
                        Add a JavaScript function to transform the query result.
                      </Banner>
                    {/if}
                    <div class="embed">
                      <CodeEditor
                        value={editableQuery?.transformer}
                        mode={EditorModes.JS}
                        aiEnabled={false}
                        on:change={e => {
                          if (!editableQuery) return
                          editableQuery.transformer = e.detail
                        }}
                      />
                    </div>
                  </Layout>
                </Tab>
              </Tabs>
            {/key}
          </Layout>
        </div>
      </Layout>
    </div>
    <div class="side-bar-wrapper">
      <div
        class="side-bar main"
        class:hidden={$sidebarExpanded || isTransitioning}
        bind:this={sidebarElement}
      >
        <div class="side-bar-header">
          <div class="side-bar-title">Response</div>
          <ActionButton
            size="M"
            quiet
            selected={$sidebarExpanded}
            on:click={() => sidebarExpanded.set(!$sidebarExpanded)}
          >
            <Icon
              name={$sidebarExpanded ? "arrows-in-simple" : "arrows-out-simple"}
              size="S"
            />
          </ActionButton>
        </div>
        <Divider size="S" noMargin />
        <div class="side-bar-content">
          <div use:moveToExpanded>
            <ResponsePanel
              {datasource}
              {response}
              {schema}
              {dynamicVariables}
              fullscreen={$sidebarExpanded}
              on:change={e => {
                const {
                  dynamicVariables: updatedDynamicVariables,
                  schema: updatedSchema,
                } = e.detail || {}
                if (updatedDynamicVariables) {
                  localDynamicVariables = updatedDynamicVariables
                }
                if (updatedSchema) {
                  schema = updatedSchema
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<Portal target=".modal-container">
  {#if $sidebarExpanded}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="underlay"
      transition:fade={{ duration: 260 }}
      on:click={() => sidebarExpanded.set(false)}
    ></div>
  {/if}
  {#if $sidebarExpanded}
    <div
      class="side-bar expanded"
      in:sidebarTransition={{ direction: "in" }}
      out:sidebarTransition={{ direction: "out" }}
    >
      <div class="side-bar-header">
        <div class="side-bar-title">Response</div>
        <ActionButton
          size="M"
          quiet
          selected={$sidebarExpanded}
          on:click={() => sidebarExpanded.set(!$sidebarExpanded)}
        >
          <Icon
            name={$sidebarExpanded ? "arrows-in-simple" : "arrows-out-simple"}
            size="S"
          />
        </ActionButton>
      </div>
      <div class="side-bar-content">
        <!-- Content is moved here by the moveToExpanded action -->
      </div>
    </div>
  {/if}
</Portal>

<style>
  .details :global(.markdown-viewer code) {
    color: var(--spectrum-alias-text-color);
  }
  .bottom {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .request-heading {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    padding-bottom: var(--spacing-l);
  }
  .wrap-divider {
    margin: 0px -40px;
  }
  .wrap {
    --sidebar-width: 380px;
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  .wrap > .main {
    padding-top: var(--spacing-l);
    flex: 1;
  }
  .side-bar-wrapper {
    width: var(--sidebar-width);
    flex-shrink: 0;
    position: relative;
  }
  .side-bar {
    position: absolute;
    top: -0px;
    /* Initial offset for the global padding */
    bottom: -40px;
    right: -40px;
    width: var(--sidebar-width);
    background: var(--spectrum-global-color-gray-50);
    border-left: var(--border-light);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    transition:
      width 260ms ease-out,
      right 260ms ease-out,
      top 260ms ease-out,
      bottom 260ms ease-out,
      border-radius 260ms ease-out,
      box-shadow 260ms ease-out;
  }
  .side-bar.hidden {
    visibility: hidden;
    pointer-events: none;
  }
  .side-bar.expanded {
    position: fixed;
    top: 15vh;
    right: 15vw;
    width: 70vw;
    height: 70vh;
    bottom: auto;
    border: var(--border-light);
    border-radius: 8px;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }
  .underlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
    transition: opacity 260ms ease-out;
  }
  .side-bar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-m) var(--spacing-xl);
    gap: var(--spacing-xl);
  }
  .side-bar-title {
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }
  .side-bar-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-m) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
  }
  .side-bar-content > div,
  .side-bar-content > div :global(> .container),
  .side-bar-content > div :global(> .panel) {
    height: 100%;
  }

  .actions .grouped {
    display: flex;
    gap: var(--spacing-m);
  }
  .send :global(.spectrum-Button-label) {
    color: var(--spectrum-alias-text-color);
  }
  .send :global(.icon) {
    color: var(--spectrum-global-color-gray-700);
  }
  .request .send.loaded :global(.spectrum-Button--primary:not(.is-disabled)) {
    background-color: color-mix(in srgb, var(--verb-color) 35%, transparent);
    transition: background-color 130ms ease-in-out;
  }
  .request
    .send.loaded
    :global(.spectrum-Button--primary:not(.is-disabled):hover) {
    background-color: color-mix(in srgb, var(--verb-color) 50%, transparent);
  }
  .request {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
    min-width: 0;
  }
  .request :global(.spectrum-ActionButton) {
    height: 40px;
    border-radius: 4px;
  }
  .request .picker {
    flex: 1;
  }
  .request .picker :global(.spectrum-Picker),
  .endpoint {
    height: 40px;
  }
  .request .picker :global(.spectrum-Picker.is-readonly:hover),
  .request
    .picker
    :global(.spectrum-Picker.is-readonly:hover .spectrum-Picker-label),
  .request
    .picker
    :global(.spectrum-Picker.is-readonly:hover .spectrum-Picker-menuIcon) {
    background: unset;
    color: unset;
    cursor: default;
  }
  .endpoint {
    border: 0.5px dashed var(--spectrum-global-color-gray-300);
    background: var(--spectrum-global-color-gray-200);
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    color: var(--spectrum-alias-text-color);
    border-radius: 4px;
    padding-left: var(--spacing-m);
    padding-right: var(--spacing-m);
    box-sizing: border-box;
    gap: var(--spacing-s);
  }
  .endpoint :global(.code-editor) {
    max-width: 100%;
  }
  .endpoint :global(.cm-editor) {
    background: transparent !important;
    font-family: var(--font-sans);
    /* To match the picker size */
    font-size: var(--spectrum-picker-text-size);
  }
  .endpoint :global(.cm-line .binding-wrap) {
    color: var(--verb-color) !important;
    padding: 2px;
    border-radius: 4px;
    transition:
      background-color 130ms ease-in-out,
      color 130ms ease-in-out;
  }
  .endpoint :global(.code-editor .cm-scroller) {
    overflow: hidden;
  }

  .heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--spacing-xl);
  }
  .api-details {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-m);
  }
  .query-name-input {
    flex: 1;
    color: var(--spectrum-global-color-gray-900);
    font-family: inherit;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: -0.02em;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 3px;
    padding: 4px 6px;
    margin-left: -6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: text;
    transition:
      background-color 150ms,
      border-color 150ms;
  }
  .query-name-input::placeholder {
    color: var(--spectrum-global-color-gray-600);
  }
  .query-name-input:focus {
    outline: none;
    margin-left: 0;
    background-color: var(--spectrum-global-color-gray-50);
    border-color: var(--spectrum-global-color-gray-400);
    text-overflow: clip;
  }
  .actions {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-s);
  }
  .access {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }
  .pagination {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-m);
  }
  .embed :global(.cm-editor) {
    min-height: 200px;
    border: 1px solid var(--spectrum-global-color-gray-400);
    border-radius: 4px;
  }
  .embed :global(.cm-gutters) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .request-top,
  .request-bottom {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }
</style>
