<script>
  import { goto } from "@sveltech/routify"
  import {
    Select,
    Button,
    Body,
    Label,
    Input,
    Heading,
    Spacer,
    Switcher,
  } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import api from "builderStore/api"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"
  import ParameterBuilder from "components/integration/QueryParameterBuilder.svelte"
  import { backendUiStore } from "builderStore"

  const PREVIEW_HEADINGS = [
    {
      title: "JSON",
      key: "JSON",
    },
    {
      title: "Schema",
      key: "SCHEMA",
    },
    {
      title: "Preview",
      key: "PREVIEW",
    },
  ]

  export let query
  export let fields = []

  let config
  let tab = "JSON"
  let parameters
  let data = []
  let popover

  $: datasource = $backendUiStore.datasources.find(
    ds => ds._id === query.datasourceId
  )

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

  $: integrationInfo = $backendUiStore.integrations[datasourceType]
  $: queryConfig = integrationInfo?.query

  $: shouldShowQueryConfig = queryConfig && query.queryVerb

  function newField() {
    fields = [...fields, {}]
  }

  function deleteField(idx) {
    fields.splice(idx, 1)
    fields = fields
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
        notifier.info(
          "Query results empty. Please execute a query with results to create your schema."
        )
        return
      }

      notifier.success("Query executed successfully.")

      // Assume all the fields are strings and create a basic schema from the
      // unique fields returned by the server
      fields = json.schemaFields.map(field => ({
        name: field,
        type: "STRING",
      }))
    } catch (err) {
      notifier.danger(`Query Error: ${err.message}`)
      console.error(err)
    }
  }

  async function saveQuery() {
    try {
      const { _id } = await backendUiStore.actions.queries.save(
        query.datasourceId,
        query
      )
      notifier.success(`Query saved successfully.`)
      $goto(`../../${_id}`)
    } catch (err) {
      console.error(err)
      notifier.danger(`Error creating query. ${err.message}`)
    }
  }
</script>

<section class="config">
  <Heading medium lh>Query {integrationInfo?.friendlyName}</Heading>
  <hr />
  <Spacer extraLarge />
  <Heading small lh>Config</Heading>
  <Body small grey>Provide a name for your query and select its function.</Body>
  <Spacer large />
  <div class="config-field">
    <Label small>Query Name</Label>
    <Input thin outline bind:value={query.name} />
  </div>
  <Spacer extraLarge />
  {#if queryConfig}
    <div class="config-field">
      <Label small>Function</Label>
      <Select primary outline thin bind:value={query.queryVerb}>
        {#each Object.keys(queryConfig) as queryVerb}
          <option value={queryVerb}>
            {queryConfig[queryVerb]?.displayName || queryVerb}
          </option>
        {/each}
      </Select>
    </div>
    <Spacer extraLarge />
    <hr />
    <Spacer extraLarge />
    <Spacer small />
    <ParameterBuilder bind:parameters={query.parameters} bindable={false} />
    <hr />
  {/if}
</section>

{#if shouldShowQueryConfig}
  <section>
    <Spacer extraLarge />
    <Spacer small />
    <div class="config">
      <Heading small lh>Fields</Heading>
      <Body small grey>Fill in the fields specific to this query.</Body>
      <Spacer medium />
      <Spacer extraLarge />
      <IntegrationQueryEditor
        {datasource}
        {query}
        schema={queryConfig[query.queryVerb]}
        bind:parameters />
      <Spacer extraLarge />
      <hr />
      <Spacer extraLarge />
      <Spacer medium />
      <div class="viewer-controls">
        <Heading small lh>Results</Heading>
        <div class="button-container">
          <Button
            secondary
            thin
            disabled={data.length === 0 || !query.name}
            on:click={saveQuery}>
            Save Query
          </Button>
          <Spacer medium />
          <Button thin primary on:click={previewQuery}>Run Query</Button>
        </div>
      </div>
      <Body small grey>
        Below, you can preview the results from your query and change the
        schema.
      </Body>

      <Spacer extraLarge />
      <Spacer medium />

      <section class="viewer">
        {#if data}
          <Switcher headings={PREVIEW_HEADINGS} bind:value={tab}>
            {#if tab === 'JSON'}
              <pre
                class="preview">
                <!-- prettier-ignore -->
                {#if !data[0]}
                  
                  Please run your query to fetch some data.

                {:else}
                  {JSON.stringify(data[0], undefined, 2)}
                {/if}
            </pre>
            {:else if tab === 'PREVIEW'}
              <ExternalDataSourceTable {query} {data} />
            {:else if tab === 'SCHEMA'}
              {#each fields as field, idx}
                <Spacer small />
                <div class="field">
                  <Input
                    outline
                    placeholder="Field Name"
                    type={'text'}
                    bind:value={field.name} />
                  <Select thin border bind:value={field.type}>
                    <option value={''}>Select a field type</option>
                    <option value={'STRING'}>Text</option>
                    <option value={'NUMBER'}>Number</option>
                    <option value={'BOOLEAN'}>Boolean</option>
                    <option value={'DATETIME'}>Datetime</option>
                  </Select>
                  <i
                    class="ri-close-circle-line delete"
                    on:click={() => deleteField(idx)} />
                </div>
              {/each}
              <Spacer small />
              <Button thin secondary on:click={newField}>Add Field</Button>
            {/if}
          </Switcher>
        {/if}
      </section>
    </div>
  </section>
{/if}
<Spacer extraLarge />
<Spacer extraLarge />

<style>
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

  .button-container {
    display: flex;
  }

  hr {
    margin-top: var(--layout-m);
    border: 1px solid var(--grey-2);
  }

  .config {
    margin-bottom: var(--spacing-s);
  }

  .delete {
    align-self: center;
    cursor: pointer;
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
    background-color: var(--grey-1);
    padding: var(--spacing-m);
    border-radius: 8px;
    color: var(--grey-6);
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
