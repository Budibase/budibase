<script>
  import { goto } from "@roxi/routify"
  import {
    Icon,
    Select,
    Button,
    ButtonGroup,
    Body,
    Label,
    Layout,
    Input,
    Heading,
    Tabs,
    Tab,
  } from "@budibase/bbui"
  import { notifications, Divider } from "@budibase/bbui"
  import ExtraQueryConfig from "./ExtraQueryConfig.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"
  import BindingBuilder from "components/integration/QueryViewerBindingBuilder.svelte"
  import { datasources, integrations, queries } from "stores/backend"
  import { capitalise } from "../../helpers"
  import CodeMirrorEditor from "components/common/CodeMirrorEditor.svelte"
  import JSONPreview from "./JSONPreview.svelte"
  import { SchemaTypeOptions } from "constants/backend"
  import KeyValueBuilder from "./KeyValueBuilder.svelte"
  import { fieldsToSchema, schemaToFields } from "helpers/data/utils"
  import AccessLevelSelect from "./AccessLevelSelect.svelte"

  export let query

  const transformerDocs = "https://docs.budibase.com/docs/transformers"

  let fields = query?.schema ? schemaToFields(query.schema) : []
  let parameters
  let data = []
  let saveId

  $: datasource = $datasources.list.find(ds => ds._id === query.datasourceId)
  $: query.schema = fieldsToSchema(fields)
  $: datasourceType = datasource?.source
  $: integrationInfo = datasourceType ? $integrations[datasourceType] : null
  $: queryConfig = integrationInfo?.query
  $: shouldShowQueryConfig = queryConfig && query.queryVerb
  $: readQuery = query.queryVerb === "read" || query.readable
  $: queryInvalid = !query.name || (readQuery && data.length === 0)

  //Cast field in query preview response to number if specified by schema
  $: {
    for (let i = 0; i < data.length; i++) {
      let row = data[i]
      for (let fieldName of Object.keys(fields)) {
        if (fields[fieldName] === "number" && !isNaN(Number(row[fieldName]))) {
          row[fieldName] = Number(row[fieldName])
        } else {
          row[fieldName] = row[fieldName]?.toString()
        }
      }
    }
  }

  // seed the transformer
  if (query && !query.transformer) {
    query.transformer = "return data"
  }

  function resetDependentFields() {
    if (query.fields.extra) {
      query.fields.extra = {}
    }
  }

  function populateExtraQuery(extraQueryFields) {
    query.fields.extra = extraQueryFields
  }

  async function previewQuery() {
    try {
      const response = await queries.preview(query)
      if (response.rows.length === 0) {
        notifications.info(
          "Query results empty. Please execute a query with results to create your schema."
        )
        return
      }
      data = response.rows
      fields = response.schema
      notifications.success("Query executed successfully")
    } catch (error) {
      notifications.error(`Query Error: ${error.message}`)
    }
  }

  async function saveQuery() {
    try {
      const { _id } = await queries.save(query.datasourceId, query)
      saveId = _id
      notifications.success(`Query saved successfully`)

      // Go to the correct URL if we just created a new query
      if (!query._rev) {
        $goto(`../../${_id}`)
      }
    } catch (error) {
      notifications.error("Error saving query")
    }
  }
</script>

<div class="wrapper">
  <Layout gap="S" noPadding>
    <Heading size="M">Query {integrationInfo?.friendlyName}</Heading>
    <Divider />
    <Heading size="S">Config</Heading>
    <div class="config">
      <div class="config-field">
        <Label>Query Name</Label>
        <Input bind:value={query.name} />
      </div>
      {#if queryConfig}
        <div class="config-field">
          <Label>Function</Label>
          <Select
            bind:value={query.queryVerb}
            on:change={resetDependentFields}
            options={Object.keys(queryConfig)}
            getOptionLabel={verb =>
              queryConfig[verb]?.displayName || capitalise(verb)}
          />
        </div>
        <div class="config-field">
          <AccessLevelSelect {saveId} {query} label="Access Level" />
        </div>
        {#if integrationInfo?.extra && query.queryVerb}
          <ExtraQueryConfig
            {query}
            {populateExtraQuery}
            config={integrationInfo.extra}
          />
        {/if}
        {#key query.parameters}
          <BindingBuilder
            queryBindings={query.parameters}
            bindable={false}
            on:change={e => {
              query.parameters = e.detail.map(binding => {
                return {
                  name: binding.name,
                  default: binding.value,
                }
              })
            }}
          />
        {/key}
      {/if}
    </div>
    {#if shouldShowQueryConfig}
      <Divider />
      <div class="config">
        <Heading size="S">Fields</Heading>
        <Body size="S">Fill in the fields specific to this query.</Body>
        <IntegrationQueryEditor
          {datasource}
          {query}
          height={200}
          schema={queryConfig[query.queryVerb]}
          bind:parameters
        />
        <Divider />
      </div>
      <div class="config">
        <div class="help-heading">
          <Heading size="S">Transformer</Heading>
          <Icon
            on:click={() => window.open(transformerDocs)}
            hoverable
            name="Help"
            size="L"
          />
        </div>
        <Body size="S"
          >Add a JavaScript function to transform the query result.</Body
        >
        <CodeMirrorEditor
          height={200}
          label="Transformer"
          value={query.transformer}
          resize="vertical"
          on:change={e => (query.transformer = e.detail)}
        />
        <Divider />
      </div>
      <div class="viewer-controls">
        <Heading size="S">Results</Heading>
        <ButtonGroup gap="XS">
          <Button cta disabled={queryInvalid} on:click={saveQuery}>
            Save Query
          </Button>
          <Button secondary on:click={previewQuery}>Run Query</Button>
        </ButtonGroup>
      </div>
      <Body size="S">
        Below, you can preview the results from your query and change the
        schema.
      </Body>
      <section class="viewer">
        {#if data}
          <Tabs selected="JSON">
            <Tab title="JSON">
              <JSONPreview data={data[0]} minHeight="120" />
            </Tab>
            <Tab title="Schema">
              <KeyValueBuilder
                bind:object={fields}
                name="field"
                headings
                options={SchemaTypeOptions}
              />
            </Tab>
            <Tab title="Preview">
              <ExternalDataSourceTable {query} {data} />
            </Tab>
          </Tabs>
        {/if}
      </section>
    {/if}
  </Layout>
</div>

<style>
  .wrapper {
    width: 640px;
    margin: auto;
  }

  .config {
    display: grid;
    grid-gap: var(--spacing-s);
    z-index: 1;
  }

  .config-field {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .help-heading {
    display: flex;
    justify-content: space-between;
  }

  .viewer {
    min-height: 200px;
    width: 640px;
  }

  .viewer-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: var(--spacing-m);
    min-width: 150px;
    align-items: center;
  }
</style>
