<script>
  import { params } from "@roxi/routify"
  import { datasources, integrations, queries, flags } from "stores/backend"
  import {
    Layout,
    Input,
    Select,
    Tabs,
    Tab,
    Banner,
    Divider,
    Button,
    Heading,
    RadioGroup,
    Label,
    Body,
    TextArea,
    Table,
    notifications,
  } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import EditableLabel from "components/common/inputs/EditableLabel.svelte"
  import CodeMirrorEditor, {
    EditorModes,
  } from "components/common/CodeMirrorEditor.svelte"
  import RestBodyInput from "../../_components/RestBodyInput.svelte"
  import { capitalise } from "helpers"
  import { onMount } from "svelte"
  import {
    fieldsToSchema,
    schemaToFields,
    breakQueryString,
    buildQueryString,
    keyValueToQueryParameters,
    queryParametersToKeyValue,
    flipHeaderState,
  } from "helpers/data/utils"
  import {
    RestBodyTypes as bodyTypes,
    SchemaTypeOptions,
  } from "constants/backend"
  import JSONPreview from "components/integration/JSONPreview.svelte"
  import AccessLevelSelect from "components/integration/AccessLevelSelect.svelte"
  import Placeholder from "assets/bb-spaceship.svg"
  import { cloneDeep } from "lodash/fp"

  let query, datasource
  let breakQs = {},
    bindings = {}
  let url = ""
  let saveId, isGet
  let response, schema, enabledHeaders
  let datasourceType, integrationInfo, queryConfig, responseSuccess
  let authConfigId
  let dynamicVariables

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

  function getSelectedQuery() {
    return cloneDeep(
      $queries.list.find(q => q._id === $queries.selected) || {
        datasourceId: $params.selectedDatasource,
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

  function checkQueryName(inputUrl = null) {
    if (query && (!query.name || query.flags.urlName)) {
      query.flags.urlName = true
      query.name = url || inputUrl
    }
  }

  function buildUrl(base, qsObj) {
    if (!base) {
      return base
    }
    const qs = buildQueryString(qsObj)
    let newUrl = base
    if (base.includes("?")) {
      newUrl = base.split("?")[0]
    }
    return qs.length > 0 ? `${newUrl}?${qs}` : newUrl
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

  function learnMoreBanner() {
    window.open("https://docs.budibase.com/building-apps/data/transformers")
  }

  function buildQuery() {
    const newQuery = { ...query }
    const queryString = buildQueryString(breakQs)
    newQuery.fields.path = url.split("?")[0]
    newQuery.fields.queryString = queryString
    newQuery.fields.authConfigId = authConfigId
    newQuery.fields.disabledHeaders = flipHeaderState(enabledHeaders)
    newQuery.schema = fieldsToSchema(schema)
    newQuery.parameters = keyValueToQueryParameters(bindings)
    return newQuery
  }

  async function saveQuery() {
    const toSave = buildQuery()
    try {
      const { _id } = await queries.save(toSave.datasourceId, toSave)
      saveId = _id
      query = getSelectedQuery()
      notifications.success(`Request saved successfully.`)

      if (dynamicVariables) {
        const dynamicVars = rebuildVariables(saveId)
        datasource.config.dynamicVariables = dynamicVars
        await datasources.save(datasource)
      }
    } catch (err) {
      notifications.error(`Error saving query. ${err.message}`)
    }
  }

  async function runQuery() {
    try {
      response = await queries.preview(buildQuery(query))
      if (response.rows.length === 0) {
        notifications.info("Request did not return any data.")
      } else {
        response.info = response.info || { code: 200 }
        schema = response.schema
        notifications.success("Request sent successfully.")
      }
    } catch (err) {
      notifications.error(err)
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

  // convert dynamic variables list to simple key/val object
  const variablesToObject = datasource => {
    const variablesList = datasource?.config?.dynamicVariables
    if (variablesList && variablesList.length > 0) {
      return variablesList.reduce(
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
    return variables
  }

  const shouldShowVariables = (dynamicVariables, variablesReadOnly) => {
    if (
      dynamicVariables &&
      // show when editable or when read only and not empty
      (!variablesReadOnly || Object.keys(dynamicVariables).length > 0)
    ) {
      return true
    }
    return false
  }

  const schemaMenuItems = [
    {
      text: "Create dynamic variable",
      onClick: () => {
        console.log("create variable")
      },
    },
  ]
  const responseHeadersMenuItems = [
    {
      text: "Create dynamic variable",
      onClick: () => {
        console.log("create variable")
      },
    },
  ]

  onMount(async () => {
    query = getSelectedQuery()
    // clear any unsaved changes to the datasource
    await datasources.init()
    datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
    const datasourceUrl = datasource?.config.url
    const qs = query?.fields.queryString
    breakQs = breakQueryString(qs)
    if (datasourceUrl && !query.fields.path?.startsWith(datasourceUrl)) {
      const path = query.fields.path
      query.fields.path = `${datasource.config.url}/${path ? path : ""}`
    }
    url = buildUrl(query.fields.path, breakQs)
    schema = schemaToFields(query.schema)
    bindings = queryParametersToKeyValue(query.parameters)
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
    enabledHeaders = flipHeaderState(query.fields.disabledHeaders)
    if (query && !query.transformer) {
      query.transformer = "return data"
    }
    if (query && !query.flags) {
      query.flags = {
        urlName: false,
      }
    }
    if (query && !query.fields.bodyType) {
      query.fields.bodyType = "none"
    }
    dynamicVariables = variablesToObject(datasource)
  })
</script>

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
          />
          <div class="access">
            <Label>Access level</Label>
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
            <Input bind:value={url} placeholder="http://www.api.com/endpoint" />
          </div>
          <Button cta disabled={!url} on:click={runQuery}>Send</Button>
        </div>
        <Tabs selected="Bindings" quiet noPadding noHorizPadding>
          <Tab title="Bindings">
            <KeyValueBuilder
              bind:object={bindings}
              tooltip="Set the name of the binding which can be used in Handlebars statements throughout your query"
              name="binding"
              headings
              keyPlaceholder="Binding name"
              valuePlaceholder="Default"
            />
          </Tab>
          <Tab title="Params">
            <KeyValueBuilder bind:object={breakQs} name="param" headings />
          </Tab>
          <Tab title="Headers">
            <KeyValueBuilder
              bind:object={query.fields.headers}
              bind:activity={enabledHeaders}
              toggle
              name="header"
              headings
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
          <Tab title="Transformer">
            <Layout noPadding>
              {#if !$flags.queryTransformerBanner}
                <Banner
                  extraButtonText="Learn more"
                  extraButtonAction={learnMoreBanner}
                  on:change={() =>
                    flags.updateFlag("queryTransformerBanner", true)}
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
        <Divider size="S" />
        {#if !response && Object.keys(schema).length === 0}
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
                  options={SchemaTypeOptions}
                  menuItems={schemaMenuItems}
                  showMenu={!schemaReadOnly}
                  readOnly={schemaReadOnly}
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
                  <Body size="S"
                    >{"Create dynamic variables to use body and headers results in other queries"}</Body
                  >
                  <KeyValueBuilder
                    bind:object={dynamicVariables}
                    name="Variable"
                    headings
                    keyHeading="Name"
                    keyPlaceholder="e.g. cookie"
                    valueHeading={`Value`}
                    valuePlaceholder={`e.g. {{ headers.set-cookie }}`}
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
                <Button disabled={!responseSuccess} cta on:click={saveQuery}
                  >Save query</Button
                >
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
</style>
