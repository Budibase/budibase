<script>
  import { goto, params } from "@roxi/routify"
  import { datasources, flags, integrations, queries } from "@/stores/builder"
  import { environment } from "@/stores/portal"
  import {
    Banner,
    Body,
    Button,
    Divider,
    Heading,
    Input,
    Label,
    Layout,
    notifications,
    RadioGroup,
    Select,
    Tab,
    Table,
    Tabs,
    TextArea,
  } from "@budibase/bbui"
  import KeyValueBuilder from "@/components/integration/KeyValueBuilder.svelte"
  import EditableLabel from "@/components/common/inputs/EditableLabel.svelte"
  import CodeMirrorEditor, {
    EditorModes,
  } from "@/components/common/CodeMirrorEditor.svelte"
  import RestBodyInput from "./RestBodyInput.svelte"
  import { capitalise } from "@/helpers"
  import { onMount } from "svelte"
  import restUtils from "@/helpers/data/utils"
  import {
    PaginationLocations,
    PaginationTypes,
    RawRestBodyTypes,
    RestBodyTypes as bodyTypes,
    SchemaTypeOptionsExpanded,
  } from "@/constants/backend"
  import JSONPreview from "@/components/integration/JSONPreview.svelte"
  import AccessLevelSelect from "@/components/integration/AccessLevelSelect.svelte"
  import DynamicVariableModal from "./DynamicVariableModal.svelte"
  import Placeholder from "assets/bb-spaceship.svg"
  import { cloneDeep } from "lodash/fp"

  import {
    getRestBindings,
    readableToRuntimeBinding,
    readableToRuntimeMap,
    runtimeToReadableBinding,
    runtimeToReadableMap,
    toBindingsArray,
  } from "@/dataBinding"

  export let queryId

  let query, datasource
  let breakQs = {},
    requestBindings = {}
  let saveId, url
  let response, schema, enabledHeaders
  let authConfigId
  let dynamicVariables, addVariableModal, varBinding, globalDynamicBindings
  let restBindings = getRestBindings()
  let nestedSchemaFields = {}

  $: staticVariables = datasource?.config?.staticVariables || {}

  $: customRequestBindings = toBindingsArray(
    requestBindings,
    "Binding",
    "Bindings"
  )
  $: globalDynamicRequestBindings = toBindingsArray(
    globalDynamicBindings,
    "Dynamic",
    "Dynamic"
  )
  $: dataSourceStaticBindings = toBindingsArray(
    staticVariables,
    "Datasource.Static",
    "Datasource Static"
  )

  $: mergedBindings = [
    ...restBindings,
    ...customRequestBindings,
    ...globalDynamicRequestBindings,
    ...dataSourceStaticBindings,
  ]

  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query
  $: url = buildUrl(url, breakQs)
  $: checkQueryName(url)
  $: responseSuccess = response?.info?.code >= 200 && response?.info?.code < 400
  $: isGet = query?.queryVerb === "read"
  $: authConfigs = buildAuthConfigs(datasource)
  $: schemaReadOnly = !responseSuccess
  $: variablesReadOnly = !responseSuccess
  $: showVariablesTab = shouldShowVariables(dynamicVariables, variablesReadOnly)
  $: hasSchema = Object.keys(schema || {}).length !== 0

  $: runtimeUrlQueries = readableToRuntimeMap(mergedBindings, breakQs)

  function getSelectedQuery() {
    return cloneDeep(
      $queries.list.find(q => q._id === queryId) || {
        datasourceId: $params.datasourceId,
        parameters: [],
        fields: {
          // only init the objects, everything else is optional strings
          disabledHeaders: {},
          headers: {},
        },
        queryVerb: "read",
      }
    )
  }

  const cleanUrl = inputUrl =>
    url
      ?.replace(/(https)|(http)|[{}:]/g, "")
      ?.replaceAll(".", "_")
      ?.replaceAll("/", " ")
      ?.trim() || inputUrl

  function checkQueryName(inputUrl = null) {
    if (query && (!query.name || query.flags.urlName)) {
      query.flags.urlName = true
      query.name = cleanUrl(inputUrl)
    }
  }

  function buildUrl(base, qsObj) {
    if (!base) {
      return base
    }
    let qs = restUtils.buildQueryString(
      runtimeToReadableMap(mergedBindings, qsObj)
    )
    let newUrl = base
    if (base.includes("?")) {
      const split = base.split("?")
      newUrl = split[0]
    }
    return qs.length === 0 ? newUrl : `${newUrl}?${qs}`
  }

  function buildQuery() {
    const newQuery = cloneDeep(query)
    const queryString = restUtils.buildQueryString(runtimeUrlQueries)

    newQuery.parameters = restUtils.keyValueToQueryParameters(requestBindings)
    newQuery.fields.requestBody =
      typeof newQuery.fields.requestBody === "object"
        ? readableToRuntimeMap(mergedBindings, newQuery.fields.requestBody)
        : readableToRuntimeBinding(mergedBindings, newQuery.fields.requestBody)

    newQuery.fields.path = url.split("?")[0]
    newQuery.fields.queryString = queryString
    newQuery.fields.authConfigId = authConfigId
    newQuery.fields.disabledHeaders = restUtils.flipHeaderState(enabledHeaders)
    newQuery.schema = schema || {}
    newQuery.nestedSchemaFields = nestedSchemaFields || {}

    return newQuery
  }

  async function saveQuery() {
    const toSave = buildQuery()
    try {
      const isNew = !query._rev
      const { _id } = await queries.save(toSave.datasourceId, toSave)
      saveId = _id
      query = getSelectedQuery()
      notifications.success(`Request saved successfully`)
      if (dynamicVariables) {
        datasource.config.dynamicVariables = rebuildVariables(saveId)
        datasource = await datasources.save({
          integration: integrationInfo,
          datasource,
        })
      }
      prettifyQueryRequestBody(
        query,
        requestBindings,
        dynamicVariables,
        staticVariables,
        restBindings
      )
      if (isNew) {
        $goto(`../../${_id}`)
      }
    } catch (err) {
      notifications.error(`Error saving query`)
    }
  }

  const validateQuery = async () => {
    const forbiddenBindings = /{{\s?user(\.(\w|\$)*\s?|\s?)}}/g
    const bindingError = new Error(
      "'user' is a protected binding and cannot be used"
    )

    if (forbiddenBindings.test(url)) {
      throw bindingError
    }

    if (forbiddenBindings.test(query.fields.requestBody ?? "")) {
      throw bindingError
    }

    Object.values(requestBindings).forEach(bindingValue => {
      if (forbiddenBindings.test(bindingValue)) {
        throw bindingError
      }
    })

    Object.values(query.fields.headers).forEach(headerValue => {
      if (forbiddenBindings.test(headerValue)) {
        throw bindingError
      }
    })
  }

  async function runQuery() {
    try {
      await validateQuery()
      response = await queries.preview(buildQuery())
      if (response.rows.length === 0) {
        notifications.info("Request did not return any data")
      } else {
        response.info = response.info || { code: 200 }
        // if existing schema, copy over what it is
        if (schema) {
          for (let [name, field] of Object.entries(response.schema)) {
            if (!schema[name]) {
              schema[name] = field
            }
          }
        }
        schema = response.schema
        nestedSchemaFields = response.nestedSchemaFields
        notifications.success("Request sent successfully")
      }
    } catch (error) {
      notifications.error(`Query Error: ${error.message}`)
    }
  }

  const getAuthConfigId = () => {
    let id = query.fields.authConfigId
    if (id) {
      // find the matching config on the datasource
      const matchedConfig = datasource?.config?.authConfigs?.filter(
        c => c._id === id
      )[0]
      // clear the id if the config is not found (deleted)
      // i.e. just show 'None' in the dropdown
      if (!matchedConfig) {
        id = undefined
      }
    }
    return id
  }

  const buildAuthConfigs = datasource => {
    if (datasource?.config?.authConfigs) {
      return datasource.config.authConfigs.map(c => ({
        label: c.name,
        value: c._id,
      }))
    }
    return []
  }

  const schemaMenuItems = [
    {
      text: "Create dynamic variable",
      onClick: input => {
        varBinding = `{{ data.0.[${input.name}] }}`
        addVariableModal.show()
      },
    },
  ]
  const responseHeadersMenuItems = [
    {
      text: "Create dynamic variable",
      onClick: input => {
        varBinding = `{{ info.headers.[${input.name}] }}`
        addVariableModal.show()
      },
    },
  ]

  // convert dynamic variables list to simple key/val object
  const getDynamicVariables = (datasource, queryId, matchFn) => {
    const variablesList = datasource?.config?.dynamicVariables
    if (variablesList && variablesList.length > 0) {
      const filtered = queryId
        ? variablesList.filter(variable => matchFn(variable, queryId))
        : variablesList
      return filtered.reduce(
        (acc, next) => ({ ...acc, [next.name]: next.value }),
        {}
      )
    }
    return {}
  }

  // convert dynamic variables object back to a list, enrich with query id
  const rebuildVariables = queryId => {
    let variables = []
    if (dynamicVariables) {
      variables = Object.entries(dynamicVariables).map(entry => {
        return {
          name: entry[0],
          value: entry[1],
          queryId,
        }
      })
    }

    let existing = datasource?.config?.dynamicVariables || []
    // remove existing query variables (for changes and deletions)
    existing = existing.filter(variable => variable.queryId !== queryId)
    // re-add the new query variables
    return [...existing, ...variables]
  }

  const shouldShowVariables = (dynamicVariables, variablesReadOnly) => {
    return !!(
      dynamicVariables &&
      // show when editable or when read only and not empty
      (!variablesReadOnly || Object.keys(dynamicVariables).length > 0)
    )
  }

  const updateFlag = async (flag, value) => {
    try {
      await flags.updateFlag(flag, value)
    } catch (error) {
      notifications.error("Error updating flag")
    }
  }

  const prettifyQueryRequestBody = (
    query,
    requestBindings,
    dynamicVariables,
    staticVariables,
    restBindings
  ) => {
    let customRequestBindings = toBindingsArray(requestBindings, "Binding")
    let dynamicRequestBindings = toBindingsArray(dynamicVariables, "Dynamic")
    let dataSourceStaticBindings = toBindingsArray(
      staticVariables,
      "Datasource.Static"
    )

    const prettyBindings = [
      ...restBindings,
      ...customRequestBindings,
      ...dynamicRequestBindings,
      ...dataSourceStaticBindings,
    ]

    //Parse the body here as now all bindings have been updated.
    if (query?.fields?.requestBody) {
      query.fields.requestBody =
        typeof query.fields.requestBody === "object"
          ? runtimeToReadableMap(prettyBindings, query.fields.requestBody)
          : runtimeToReadableBinding(prettyBindings, query.fields.requestBody)
    }
  }

  const paramsChanged = evt => {
    breakQs = {}
    for (let param of evt.detail) {
      breakQs[param.name] = param.value
    }
  }

  const urlChanged = evt => {
    breakQs = {}
    const qs = evt.target.value.split("?")[1]
    if (qs && qs.length > 0) {
      const parts = qs.split("&")
      for (let part of parts) {
        const [key, value] = part.split("=")
        breakQs[key] = value
      }
    }
  }

  onMount(async () => {
    query = getSelectedQuery()
    schema = query.schema

    try {
      // Clear any unsaved changes to the datasource
      await datasources.init()
    } catch (error) {
      notifications.error("Error getting datasources")
    }

    try {
      // load the environment variables
      await environment.loadVariables()
    } catch (error) {
      notifications.error(`Error getting environment variables - ${error}`)
    }

    datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
    const datasourceUrl = datasource?.config.url
    const qs = query?.fields.queryString
    breakQs = restUtils.breakQueryString(encodeURI(qs ?? ""))
    breakQs = runtimeToReadableMap(mergedBindings, breakQs)

    const path = query.fields.path
    if (
      datasourceUrl &&
      !path?.startsWith("http") &&
      !path?.startsWith("{{") // don't substitute the datasource url when query starts with a variable e.g. the upgrade path
    ) {
      query.fields.path = `${datasource.config.url}/${path ? path : ""}`
    }
    url = buildUrl(query.fields.path, breakQs)
    requestBindings = restUtils.queryParametersToKeyValue(query.parameters)
    authConfigId = getAuthConfigId()
    if (!query.fields.disabledHeaders) {
      query.fields.disabledHeaders = {}
    }
    // make sure the disabled headers are set (migration)
    for (let header of Object.keys(query.fields.headers)) {
      if (!query.fields.disabledHeaders[header]) {
        query.fields.disabledHeaders[header] = false
      }
    }
    enabledHeaders = restUtils.flipHeaderState(query.fields.disabledHeaders)
    if (query && !query.transformer) {
      query.transformer = "return data"
    }
    if (query && !query.flags) {
      query.flags = {
        urlName: false,
      }
    }
    if (query && !query.fields.bodyType) {
      if (query.fields.requestBody) {
        query.fields.bodyType = RawRestBodyTypes.JSON
      } else {
        query.fields.bodyType = RawRestBodyTypes.NONE
      }
    }
    if (query && !query.fields.pagination) {
      query.fields.pagination = {}
    }
    // if query doesn't have ID then its new - don't try to copy existing dynamic variables
    if (!queryId) {
      dynamicVariables = []
      globalDynamicBindings = getDynamicVariables(datasource)
    } else {
      dynamicVariables = getDynamicVariables(
        datasource,
        query._id,
        (variable, queryId) => variable.queryId === queryId
      )
      globalDynamicBindings = getDynamicVariables(
        datasource,
        query._id,
        (variable, queryId) => variable.queryId !== queryId
      )
    }

    prettifyQueryRequestBody(
      query,
      requestBindings,
      globalDynamicBindings,
      staticVariables,
      restBindings
    )
  })
</script>

<DynamicVariableModal
  {datasource}
  {dynamicVariables}
  bind:binding={varBinding}
  bind:this={addVariableModal}
  on:change={saveQuery}
/>
{#if query && queryConfig}
  <div class="inner">
    <div class="top">
      <Layout gap="S">
        <div class="top-bar">
          <EditableLabel
            type="heading"
            bind:value={query.name}
            defaultValue="Untitled"
            on:change={() => (query.flags.urlName = false)}
            on:save={saveQuery}
          />
          <div class="access">
            <Label>Access</Label>
            <AccessLevelSelect {query} {saveId} />
          </div>
        </div>
        <div class="url-block">
          <div class="verb">
            <Select
              bind:value={query.queryVerb}
              on:change={() => {}}
              options={Object.keys(queryConfig)}
              getOptionLabel={verb =>
                queryConfig[verb]?.displayName || capitalise(verb)}
            />
          </div>
          <div class="url">
            <Input
              on:blur={urlChanged}
              bind:value={url}
              placeholder="http://www.api.com/endpoint"
            />
          </div>
          <Button primary disabled={!url} on:click={runQuery}>Send</Button>
          <Button
            disabled={!query.name}
            cta
            on:click={saveQuery}
            tooltip={!hasSchema
              ? "Saving a query before sending will mean no schema is generated"
              : null}
            >Save
          </Button>
        </div>
        <Tabs selected="Bindings" quiet noPadding noHorizPadding onTop>
          <Tab title="Bindings">
            <KeyValueBuilder
              bind:object={requestBindings}
              tooltip="Set the name of the binding which can be used in Handlebars statements throughout your query"
              name="binding"
              headings
              keyPlaceholder="Binding name"
              valuePlaceholder="Default"
              bindings={[
                ...restBindings,
                ...globalDynamicRequestBindings,
                ...dataSourceStaticBindings,
              ]}
              bindingDrawerLeft="260px"
            />
          </Tab>
          <Tab title="Params">
            {#key breakQs}
              <KeyValueBuilder
                on:change={paramsChanged}
                object={breakQs}
                name="param"
                headings
                bindings={mergedBindings}
                bindingDrawerLeft="260px"
              />
            {/key}
          </Tab>
          <Tab title="Headers">
            <KeyValueBuilder
              bind:object={query.fields.headers}
              bind:activity={enabledHeaders}
              toggle
              name="header"
              headings
              bindings={mergedBindings}
              bindingDrawerLeft="260px"
            />
          </Tab>
          <Tab title="Body">
            <RadioGroup
              bind:value={query.fields.bodyType}
              options={isGet ? [bodyTypes[0]] : bodyTypes}
              direction="horizontal"
              getOptionLabel={option => option.name}
              getOptionValue={option => option.value}
            />
            <RestBodyInput bind:bodyType={query.fields.bodyType} bind:query />
          </Tab>
          <Tab title="Pagination">
            <div class="pagination">
              <Select
                label="Pagination type"
                bind:value={query.fields.pagination.type}
                options={PaginationTypes}
                placeholder="None"
              />
              {#if query.fields.pagination.type}
                <Select
                  label="Pagination parameters location"
                  bind:value={query.fields.pagination.location}
                  options={PaginationLocations}
                  placeholer="Choose where to send pagination parameters"
                />
                <Input
                  label={query.fields.pagination.type === "page"
                    ? "Page number parameter name "
                    : "Request cursor parameter name"}
                  bind:value={query.fields.pagination.pageParam}
                />
                <Input
                  label={query.fields.pagination.type === "page"
                    ? "Page size parameter name"
                    : "Request limit parameter name"}
                  bind:value={query.fields.pagination.sizeParam}
                />
                {#if query.fields.pagination.type === "cursor"}
                  <Input
                    label="Response body parameter name for cursor"
                    bind:value={query.fields.pagination.responseParam}
                  />
                {/if}
              {/if}
            </div>
          </Tab>
          <Tab title="Transformer">
            <Layout noPadding>
              {#if !$flags.queryTransformerBanner}
                <Banner
                  extraButtonText="Learn more"
                  extraButtonAction={() =>
                    window.open("https://docs.budibase.com/docs/transformers")}
                  on:change={() => updateFlag("queryTransformerBanner", true)}
                >
                  Add a JavaScript function to transform the query result.
                </Banner>
              {/if}
              <CodeMirrorEditor
                height={200}
                mode={EditorModes.JSON}
                value={query.transformer}
                resize="vertical"
                on:change={e => (query.transformer = e.detail)}
              />
            </Layout>
          </Tab>
          <div class="auth-container">
            <div />
            <!-- spacer -->
            <div class="auth-select">
              <Select
                label="Auth"
                labelPosition="left"
                placeholder="None"
                bind:value={authConfigId}
                options={authConfigs}
              />
            </div>
          </div>
        </Tabs>
      </Layout>
    </div>
    <div class="bottom">
      <Layout paddingY="S" gap="S">
        <Divider />
        {#if !response && Object.keys(schema || {}).length === 0}
          <Heading size="M">Response</Heading>
          <div class="placeholder">
            <div class="placeholder-internal">
              <img alt="placeholder" src={Placeholder} />
              <Body size="XS" textAlign="center"
                >{"enter a url in the textbox above and click send to get a response".toUpperCase()}</Body
              >
            </div>
          </div>
        {:else}
          <Tabs
            selected={!response ? "Schema" : "JSON"}
            quiet
            noPadding
            noHorizPadding
          >
            {#if response}
              <Tab title="JSON">
                <div>
                  <JSONPreview height="300" data={response.rows[0]} />
                </div>
              </Tab>
            {/if}
            {#if schema || response}
              <Tab title="Schema">
                <KeyValueBuilder
                  bind:object={schema}
                  name="schema"
                  headings
                  options={SchemaTypeOptionsExpanded}
                  menuItems={schemaMenuItems}
                  showMenu={!schemaReadOnly}
                  readOnly={schemaReadOnly}
                  compare={(option, value) => option.type === value?.type}
                />
              </Tab>
            {/if}
            {#if response}
              <Tab title="Raw">
                <TextArea disabled value={response.extra?.raw} height="300" />
              </Tab>
              <Tab title="Headers">
                <KeyValueBuilder
                  object={response.extra?.headers}
                  readOnly
                  menuItems={responseHeadersMenuItems}
                  showMenu={true}
                />
              </Tab>
              <Tab title="Preview">
                <div class="table">
                  {#if response}
                    <Table
                      schema={response?.schema}
                      data={response?.rows}
                      allowEditColumns={false}
                      allowEditRows={false}
                      allowSelectRows={false}
                    />
                  {/if}
                </div>
              </Tab>
            {/if}
            {#if showVariablesTab}
              <Tab title="Dynamic Variables">
                <Layout noPadding gap="S">
                  <Body size="S">
                    Create dynamic variables based on response body or headers
                    from this query.
                  </Body>
                  <KeyValueBuilder
                    bind:object={dynamicVariables}
                    name="Variable"
                    headings
                    keyHeading="Name"
                    keyPlaceholder="Variable name"
                    valueHeading={`Value`}
                    valuePlaceholder={`{{ value }}`}
                    readOnly={variablesReadOnly}
                  />
                </Layout>
              </Tab>
            {/if}
            {#if response}
              <div class="stats">
                <Label size="L">
                  Status: <span class={responseSuccess ? "green" : "red"}
                    >{response?.info.code}</span
                  >
                </Label>
                <Label size="L">
                  Time: <span class={responseSuccess ? "green" : "red"}
                    >{response?.info.time}</span
                  >
                </Label>
                <Label size="L">
                  Size: <span class={responseSuccess ? "green" : "red"}
                    >{response?.info.size}</span
                  >
                </Label>
              </div>
            {/if}
          </Tabs>
        {/if}
      </Layout>
    </div>
  </div>
{/if}

<style>
  .inner {
    width: 960px;
    margin: 0 auto;
    height: 100%;
  }

  .table {
    width: 960px;
  }

  .url-block {
    display: flex;
    gap: var(--spacing-s);
    z-index: 200;
  }

  .verb {
    flex: 1;
  }

  .url {
    flex: 4;
  }

  .top {
    min-height: 50%;
  }

  .bottom {
    padding-bottom: 50px;
  }

  .stats {
    display: flex;
    gap: var(--spacing-xl);
    margin-left: auto !important;
    margin-right: 0;
    align-items: center;
  }

  .green {
    color: #53a761;
  }

  .red {
    color: #ea7d82;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
  }

  .access {
    display: flex;
    gap: var(--spacing-m);
    align-items: center;
  }

  .placeholder-internal {
    display: flex;
    flex-direction: column;
    width: 200px;
    gap: var(--spacing-l);
  }

  .placeholder {
    display: flex;
    margin-top: var(--spacing-xl);
    justify-content: center;
  }

  .auth-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .auth-select {
    width: 200px;
  }

  .pagination {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-m);
  }
</style>
