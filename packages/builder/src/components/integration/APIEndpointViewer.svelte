<script lang="ts">
  import { goto } from "@roxi/routify"
  import { flags } from "@/stores/builder"
  import { datasources } from "@/stores/builder/datasources"
  import { queries } from "@/stores/builder/queries"
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
    type RestTemplate,
    type RestTemplateSpec,
    type PreviewQueryResponse,
    type UIInternalDatasource,
  } from "@budibase/types"
  import { customQueryIconColor, QUERY_VERB_MAP } from "@/helpers/data/utils"
  import { RestBodyTypes } from "@/constants/backend"
  import KeyValueBuilder from "./KeyValueBuilder.svelte"
  import APIEndpointVerbBadge from "./APIEndpointVerbBadge.svelte"
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
    buildAuthConfigs,
  } from "./query"
  import restUtils from "@/helpers/data/utils"
  import ConnectedQueryScreens from "./ConnectedQueryScreens.svelte"
  import RestBodyInput from "./RestBodyInput.svelte"
  import CodeEditor from "../common/CodeEditor/CodeEditor.svelte"
  import { EditorModes } from "../common/CodeEditor"
  import { readableToRuntimeMap, runtimeToReadableMap } from "@/dataBinding"
  import ResponsePanel from "./ResponsePanel.svelte"
  import AuthPicker from "./rest/AuthPicker.svelte"

  export let queryId
  export let datasourceId

  type EndpointWithIcon = ImportEndpoint & {
    icon?: {
      component: typeof APIEndpointVerbBadge
      props: { verb?: string; color?: string }
    }
  }
  type AuthConfigOption = {
    label: string
    value: string
  }

  const sidebarExpanded = writable(false)
  let sidebarElement: HTMLDivElement
  let isTransitioning = false

  // Expanded sidebar dimensions
  const EXPANDED_MARGIN = 0.15 // 15vh/15vw margins
  const EXPANDED_SIZE = 0.7 // 70vh/70vw size

  let selectedEndpointOption: EndpointWithIcon | undefined
  let endpoints: ImportEndpoint[] | undefined
  let endpointsLoading = false
  let queryParams: Record<string, string> | undefined = undefined
  let localDynamicVariables: Record<string, string> | undefined = undefined
  let savingQuery = false,
    runningQuery = false
  let originalBuiltQuery: Query | undefined = undefined
  let baseUrl: string | undefined = undefined
  let response: PreviewQueryResponse
  let query: Query | undefined
  let template: RestTemplate | undefined
  let datasource: Datasource | UIInternalDatasource | undefined
  let authConfigs: AuthConfigOption[] = []
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
    baseUrl?: string
  ): Query => {
    const updated = structuredClone(sourceQuery)
    const fullPath =
      endpoint && baseUrl
        ? constructFullPath(baseUrl, endpoint?.path || "")
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
    updated.datasourceId = datasourceId
    updated.name = endpoint?.name || updated.name
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
          operationId: endpoint.operationId,
          docsUrl: endpoint.docsUrl,
          description: endpoint.description,
          originalPath: endpoint.originalPath,
          originalRequestBody: endpoint.originalRequestBody,
          defaultBindings: endpoint.defaultBindings,
        }
      : undefined

    return updated
  }

  // Reset state when datasourceId changes
  $: if (datasourceId) {
    selectedEndpointOption = undefined
    endpoints = undefined
    queryParams = undefined
    originalBuiltQuery = undefined
  }

  // Build selectedEndpointOption from query metadata or fetch endpoints if needed
  $: if (query) {
    ensureQueryDefaults(query)
    syncEndpointFromQuery(query, endpoints)
  }

  let queryKey: string | undefined
  let appliedEndpointKey: string | undefined
  let isNewQuery = false
  $: storeQuery = getSelectedQuery(queryId, datasourceId)
  $: isNewQuery = !storeQuery?._id
  $: {
    const key = storeQuery?._id || `new::${datasourceId || ""}`
    if (!query || key !== queryKey) {
      query = structuredClone(storeQuery)
      queryKey = key
      queryParams = undefined
      originalBuiltQuery = undefined
      if (query?._id) {
        appliedEndpointKey = undefined
      }
    }
  }
  $: datasource = structuredClone(
    $datasources.list.find(
      d => d._id === datasourceId || query?.datasourceId === d._id
    )
  )
  $: authConfigs = buildAuthConfigs(datasource)

  // QUERY DATA
  $: queryString = query?.fields.queryString
  $: runtimeUrlQueries = readableToRuntimeMap(mergedBindings, queryParams)
  $: isGet = query?.queryVerb === "read"
  $: schema = query?.schema
  $: nestedSchemaFields = query?.nestedSchemaFields
  $: requestBindings = query
    ? restUtils.queryParametersToKeyValue(query.parameters)
    : {}
  $: enabledHeaders = query
    ? restUtils.flipHeaderState(query.fields.disabledHeaders || {})
    : {}

  // Init and build full API path if the query is new
  $: if (selectedEndpointOption && baseUrl && query && !query._id) {
    query = {
      ...query,
      fields: {
        ...query.fields,
        path: constructFullPath(baseUrl, selectedEndpointOption.path || ""),
      },
    }
  }

  // Build dynamic variables from the datasource and query
  $: ({ dynamicVariables: computedDynamicVariables, globalDynamicBindings } =
    datasource && query
      ? buildDynamicVariables(datasource, query._id)
      : { dynamicVariables: {}, globalDynamicBindings: {} })

  // Use local override if available, otherwise use computed variables
  $: dynamicVariables = localDynamicVariables ?? computedDynamicVariables

  // Generate all query bindings.
  $: ({
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

  // Lazily initialize queryParams from query string once dependencies are ready
  $: if (!queryParams && queryString && mergedBindings) {
    queryParams = runtimeToReadableMap(
      mergedBindings,
      restUtils.breakQueryString(encodeURI(queryString))
    )
  }

  // Fully qualified display url
  $: requestURL = buildUrl(query?.fields?.path, queryParams, mergedBindings)

  // Generates a complete runtime-ready version of the query used to monitor the
  // current edit state.
  $: builtQuery =
    query &&
    schema &&
    buildQuery(
      query,
      runtimeUrlQueries,
      requestBindings,
      mergedBindings,
      enabledHeaders || {},
      schema,
      nestedSchemaFields
    )

  // Track dirty state by comparing runtime-ready queries
  $: if (builtQuery && !originalBuiltQuery) {
    originalBuiltQuery = structuredClone(builtQuery)
  }

  $: queryDirty =
    (!!originalBuiltQuery && !isEqual(builtQuery, originalBuiltQuery)) ||
    !!localDynamicVariables

  $: prettyBody = query?.fields?.requestBody
    ? prettifyQueryRequestBody(query, mergedBindings)
    : undefined

  // BB Rest template specs
  $: template =
    datasource?.restTemplate && $restTemplates
      ? restTemplates.getByName(datasource.restTemplate)
      : undefined
  $: spec = template?.specs?.[0]

  // ENDPOINTS - only skip loading if we have both query Id AND metadata
  // Load endpoints for new queries OR existing queries without metadata
  $: if (
    spec &&
    !endpoints &&
    !endpointsLoading &&
    !(query?._id && query?.restTemplateMetadata)
  ) {
    loadEndpoints(spec)
  }

  // Build endpoint options from either endpoints list or selected endpoint from metadata
  $: endpointOptions = (() => {
    const options = getEndpointOptions(endpoints || [])

    // If we have a selected endpoint from metadata that's not in the options, add it
    if (
      selectedEndpointOption &&
      !options.find(o => o.id === selectedEndpointOption?.id)
    ) {
      return [selectedEndpointOption, ...options]
    }

    return options
  })()
  $: endpointVerbColor = selectedEndpointOption?.icon?.props?.color
  $: endpointDocs = selectedEndpointOption?.docsUrl
  $: endpointTemplateKey =
    isNewQuery && selectedEndpointOption
      ? `${selectedEndpointOption.id || selectedEndpointOption.path || ""}::${
          baseUrl || ""
        }`
      : undefined
  $: if (
    query &&
    isNewQuery &&
    selectedEndpointOption &&
    endpointTemplateKey &&
    endpointTemplateKey !== appliedEndpointKey
  ) {
    query = applyEndpointDefaults(query, selectedEndpointOption, baseUrl)
    appliedEndpointKey = endpointTemplateKey
  }

  const loadEndpoints = async (spec?: RestTemplateSpec) => {
    if (!spec) {
      return
    }
    try {
      endpointsLoading = true
      const resp = await queries.fetchImportInfo({ url: spec.url })
      const { endpoints: respEndpoints, url } = resp || {}
      if (respEndpoints) {
        endpoints = respEndpoints
      }
      if (url) {
        baseUrl = url
      }
    } catch (err) {
      console.error("could not fetch endpoints", err)
    }
    endpointsLoading = false
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

  const compareEndpoints = (option: any, value: any) => option.id === value?.id

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

      const endpoint = {
        id:
          metadata.operationId ||
          `${method.toLowerCase()}::${metadata.originalPath}`,
        name: metadata.operationId || query.name,
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
  function parseLegacyQuery(
    query: Query,
    endpoints: ImportEndpoint[] | undefined
  ) {
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
  async function saveQuery(redirectIfNew = true) {
    if (!builtQuery || !datasource) {
      return
    }
    savingQuery = true
    try {
      const isNew = !builtQuery._rev

      const datasourceType = datasource?.source
      const integrationInfo = $integrations[datasourceType]

      const { _id } = await queries.save(builtQuery.datasourceId, builtQuery)

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
        $goto(`../../${_id}`)
      }

      const updatedQuery = getSelectedQuery(_id!, builtQuery.datasourceId)
      if (!updatedQuery) {
        throw new Error("Could not refresh query")
      }

      query = structuredClone(updatedQuery)
      queryKey = updatedQuery._id || queryKey
      appliedEndpointKey = undefined
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

  async function previewQuery() {
    if (!selectedEndpointOption || !query || !builtQuery) return
    try {
      validateQuery(
        requestURL,
        query.fields.requestBody,
        requestBindings,
        query?.fields?.headers || {}
      )
      runningQuery = true

      const result = await runQuery(builtQuery, schema)
      response = result.response

      // Update query object with schema from preview
      query.schema = result.schema
      query.nestedSchemaFields = result.nestedSchemaFields

      if (result.response.rows.length === 0) {
        notifications.info("Request did not return any data")
      } else {
        notifications.success("Request sent successfully")
      }
    } catch (error) {
      notifications.error(`Query Error: ${error}`)
    }
    runningQuery = false
  }

  // UPDATE HANDLERS
  const onUpdateParams = (
    e: CustomEvent<Array<{ name: string; value: string }>>
  ) => {
    queryParams = keyValueArrayToRecord(e.detail)
  }

  const onUpdateBindings = (
    e: CustomEvent<Array<{ name: string; value: string }>>
  ) => {
    const newBindings = keyValueArrayToRecord(e.detail)
    requestBindings = newBindings
    query!.parameters = restUtils.keyValueToQueryParameters(newBindings)
  }

  const onUpdateHeaders = (
    e: CustomEvent<Array<{ name: string; value: string }>>
  ) => {
    if (query) {
      query.fields.headers = keyValueArrayToRecord(e.detail)
    }
  }

  const onUpdateBody = (e: CustomEvent<{ requestBody: any }>) => {
    if (query) {
      query.fields.requestBody = e.detail.requestBody
    }
  }

  const onUpdateBodyType = (e: CustomEvent<BodyType>) => {
    if (query) {
      query.fields.bodyType = e.detail
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
</script>

<div class="request-heading">
  <div class="heading">
    <div class="api-details">
      <img src={template?.icon} alt={`${template?.name} logo`} width="24" />
      <Heading>{template?.name}</Heading>{spec?.version}
    </div>
    <div class="actions">
      <div class="grouped">
        {#if query && selectedEndpointOption}
          <AuthPicker
            bind:authConfigId={query.fields.authConfigId}
            bind:authConfigType={query.fields.authConfigType}
            {authConfigs}
            {datasourceId}
          />
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
        {#if query?._id}
          <ConnectedQueryScreens
            icon={"link-simple-horizontal-break"}
            sourceId={query._id}
            buttonText="Usage"
          />
        {/if}
      </div>
      <div class="save-btn">
        <Button
          cta
          disabled={!queryDirty || savingQuery}
          on:click={() => saveQuery()}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
  <div class="request" style:--verb-color={endpointVerbColor}>
    <div class="picker">
      <Select
        on:change={e => {
          selectedEndpointOption = e.detail
        }}
        value={selectedEndpointOption}
        options={endpointOptions}
        getOptionValue={endpoint => endpoint}
        getOptionLabel={endpoint => endpoint.name}
        compare={compareEndpoints}
        disabled={endpointsLoading}
        readonly={!!query?._id}
        hideChevron={!!query?._id}
        loading={endpointsLoading}
        autocomplete={true}
      />
    </div>
    <div class="endpoint">
      <CodeEditor
        value={requestURL}
        mode={EditorModes.Handlebars}
        aiEnabled={false}
        readonly
        lineWrapping={false}
      />
    </div>
    <div class="send" class:loaded={selectedEndpointOption}>
      <Button
        primary
        disabled={!selectedEndpointOption || runningQuery}
        icon="paper-plane-right"
        on:click={previewQuery}
      >
        Send
      </Button>
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
        <div class="config">
          <Layout noPadding gap="S">
            {#key selectedEndpointOption?.id}
              <Tabs
                selected="Bindings"
                quiet
                noPadding
                noHorizPadding
                onTop
                disabled={!selectedEndpointOption}
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
                    actionButtonDisabled={!selectedEndpointOption}
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
                    defaults={query?.fields.headers}
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
                      value={query?.fields?.bodyType}
                      options={isGet ? [RestBodyTypes[0]] : RestBodyTypes}
                      direction="horizontal"
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.value}
                      on:change={onUpdateBodyType}
                    />
                  </span>
                  <RestBodyInput
                    bodyType={query?.fields.bodyType}
                    requestBody={prettyBody}
                    on:change={onUpdateBody}
                  />
                </Tab>
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
                        value={query?.transformer}
                        mode={EditorModes.JS}
                        aiEnabled={false}
                        on:change={e => {
                          if (!query) return
                          query.transformer = e.detail
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
    />
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
    color: white;
  }
  .bottom {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .request-heading {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    padding-bottom: var(--spacing-l);
  }
  .wrap-divider {
    margin: 0px -40px;
  }
  .wrap {
    --sidebar-width: 280px;
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
    padding: var(--spacing-m) var(--spacing-xl);
  }
  .side-bar-content > div,
  .side-bar-content > div :global(> .container) {
    height: 100%;
  }
  .actions .grouped {
    display: flex;
  }
  .send :global(.spectrum-Button-label) {
    color: white;
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
    flex-direction: row;
    gap: var(--spacing-s);
    align-items: center;
    min-width: 0;
  }
  .request .picker {
    width: 30%;
    min-width: 250px;
  }
  .request .picker :global(.spectrum-Picker),
  .endpoint {
    height: 40px;
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
  }
  .api-details {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--spacing-m);
  }
  .actions {
    display: flex;
    flex-direction: row;
    gap: var(--spacing-s);
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
</style>
