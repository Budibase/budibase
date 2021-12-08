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
  } from "helpers/data/utils"
  import {
    RestBodyTypes as bodyTypes,
    SchemaTypeOptions,
  } from "constants/backend"
  import JSONPreview from "components/integration/JSONPreview.svelte"
  import AccessLevelSelect from "components/integration/AccessLevelSelect.svelte"
  import Placeholder from "assets/bb-spaceship.svg"

  let query, datasource
  let breakQs = {},
    bindings = {}
  let url = ""
  let saveId
  let response, schema, isGet
  let datasourceType, integrationInfo, queryConfig, responseSuccess

  $: datasource = $datasources.list.find(ds => ds._id === query?.datasourceId)
  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query
  $: url = buildUrl(url, breakQs)
  $: checkQueryName(url)
  $: isGet = query?.queryVerb === "read"
  $: responseSuccess =
    response?.info?.code >= 200 && response?.info?.code <= 206

  function getSelectedQuery() {
    return (
      $queries.list.find(q => q._id === $queries.selected) || {
        datasourceId: $params.selectedDatasource,
        parameters: [],
        fields: {},
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

  function learnMoreBanner() {}

  function buildQuery() {
    const newQuery = { ...query }
    const queryString = buildQueryString(breakQs)
    newQuery.fields.path = url.split("?")[0]
    newQuery.fields.queryString = queryString
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
    } catch (err) {
      notifications.error(`Error creating query. ${err.message}`)
    }
  }

  async function runQuery() {
    try {
      response = await queries.preview(buildQuery(query))
      if (response.rows.length === 0) {
        notifications.info("Request did not return any data.")
      } else {
        response.info = response.info || { code: 200 }
        notifications.success("Request sent successfully.")
      }
    } catch (err) {
      notifications.error(err)
    }
  }

  onMount(() => {
    query = getSelectedQuery()
    const qs = query?.fields.queryString
    breakQs = breakQueryString(qs)
    url = buildUrl(query.fields.path, breakQs)
    schema = schemaToFields(query.schema)
    bindings = queryParametersToKeyValue(query.parameters)
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
  })
</script>

{#if query}
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
            <Input bind:value={url} />
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
              bind:activity={query.fields.enabledHeaders}
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
        </Tabs>
      </Layout>
    </div>
    <div class="bottom">
      <Layout paddingY="S" gap="S">
        <Divider size="S" />
        {#if !response}
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
          <Tabs selected="JSON" quiet noPadding noHorizPadding>
            <Tab title="JSON">
              <div>
                <JSONPreview height="300" data={response.rows[0]} />
              </div>
            </Tab>
            <Tab title="Schema">
              <KeyValueBuilder
                bind:object={response.schema}
                name="header"
                headings
                options={SchemaTypeOptions}
              />
            </Tab>
            <Tab title="Raw">
              <TextArea disabled value={response.raw} height="300" />
            </Tab>
            <Tab title="Preview">
              {#if response}
                <Table
                  schema={response?.schema}
                  data={response?.rows}
                  allowEditColumns={false}
                  allowEditRows={false}
                  allowSelectRows={false}
                />
              {/if}
            </Tab>
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
</style>
