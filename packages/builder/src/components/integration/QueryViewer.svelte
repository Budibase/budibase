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
  import api from "builderStore/api"
  import ExtraQueryConfig from "./ExtraQueryConfig.svelte"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"
  import { datasources, integrations, queries } from "stores/backend"
  import { capitalise } from "../../helpers"

  export let query
  export let fields = []

  let parameters
  let data = []
  const typeOptions = [
    { label: "Text", value: "STRING" },
    { label: "Number", value: "NUMBER" },
    { label: "Boolean", value: "BOOLEAN" },
    { label: "Datetime", value: "DATETIME" },
  ]

  $: datasource = $datasources.list.find(ds => ds._id === query.datasourceId)
  $: query.schema = fields.reduce(
    (acc, next) => ({
      ...acc,
      [next.name]: {
        name: next.name,
        type: "string",
      },
    }),
    {}
  )
  $: datasourceType = datasource?.source
  $: integrationInfo = $integrations[datasourceType]
  $: queryConfig = integrationInfo?.query
  $: shouldShowQueryConfig = queryConfig && query.queryVerb
  $: readQuery = query.queryVerb === "read" || query.readable
  $: queryInvalid = !query.name || (readQuery && data.length === 0)

  function newField() {
    fields = [...fields, {}]
  }

  function deleteField(idx) {
    fields.splice(idx, 1)
    fields = fields
  }

  function resetDependentFields() {
    if (query.fields.extra) query.fields.extra = {}
  }

  function populateExtraQuery(extraQueryFields) {
    query.fields.extra = extraQueryFields
  }

  async function previewQuery() {
    try {
      const response = await api.post(`/api/queries/preview`, {
        fields: query.fields,
        queryVerb: query.queryVerb,
        parameters: query.parameters.reduce(
          (acc, next) => ({
            ...acc,
            [next.name]: next.default,
          }),
          {}
        ),
        datasourceId: datasource._id,
      })
      const json = await response.json()

      if (response.status !== 200) throw new Error(json.message)

      data = json.rows || []

      if (data.length === 0) {
        notifications.info(
          "Query results empty. Please execute a query with results to create your schema."
        )
        return
      }

      notifications.success("Query executed successfully.")

      // Assume all the fields are strings and create a basic schema from the
      // unique fields returned by the server
      fields = json.schemaFields.map(field => ({
        name: field,
        type: "STRING",
      }))
    } catch (err) {
      notifications.error(`Query Error: ${err.message}`)
      console.error(err)
    }
  }

  async function saveQuery() {
    try {
      const { _id } = await queries.save(query.datasourceId, query)
      notifications.success(`Query saved successfully.`)
      $goto(`../${_id}`)
    } catch (err) {
      console.error(err)
      notifications.error(`Error creating query. ${err.message}`)
    }
  }
</script>

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
      {#if integrationInfo?.extra && query.queryVerb}
        <ExtraQueryConfig
          {query}
          {populateExtraQuery}
          config={integrationInfo.extra}
        />
      {/if}
      <ParameterBuilder bind:parameters={query.parameters} bindable={false} />
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
        height={300}
        schema={queryConfig[query.queryVerb]}
        bind:parameters
      />
      <Divider />
    </div>
    <div class="viewer-controls">
      <Heading size="S">Results</Heading>
      <ButtonGroup>
        <Button cta disabled={queryInvalid} on:click={saveQuery}>
          Save Query
        </Button>
        <Button secondary on:click={previewQuery}>Run Query</Button>
      </ButtonGroup>
    </div>
    <Body size="S">
      Below, you can preview the results from your query and change the schema.
    </Body>
    <section class="viewer">
      {#if data}
        <Tabs selected="JSON">
          <Tab title="JSON">
            <pre
              class="preview">
                <!-- prettier-ignore -->
                {#if !data[0]}
                  Please run your query to fetch some data.
                {:else}
                  {JSON.stringify(data[0], undefined, 2)}
                {/if}
              </pre>
          </Tab>
          <Tab title="Schema">
            <Layout gap="S">
              {#each fields as field, idx}
                <div class="field">
                  <Input placeholder="Field Name" bind:value={field.name} />
                  <Select bind:value={field.type} options={typeOptions} />
                  <Icon name="bleClose" on:click={() => deleteField(idx)} />
                </div>
              {/each}
              <div>
                <Button secondary on:click={newField}>Add Field</Button>
              </div>
            </Layout>
          </Tab>
          <Tab title="Preview">
            <ExternalDataSourceTable {query} {data} />
          </Tab>
        </Tabs>
      {/if}
    </section>
  {/if}
</Layout>

<style>
  .config {
    display: grid;
    grid-gap: var(--spacing-s);
  }
  .config-field {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }

  .field {
    display: grid;
    grid-template-columns: 1fr 1fr 5%;
    gap: var(--spacing-l);
  }

  .viewer {
    min-height: 200px;
  }

  .preview {
    height: 100%;
    min-height: 120px;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    background-color: var(--grey-2);
    padding: var(--spacing-m);
    border-radius: 8px;
    color: var(--ink);
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
