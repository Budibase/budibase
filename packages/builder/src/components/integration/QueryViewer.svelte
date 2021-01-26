<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import {
    Select,
    Button,
    Label,
    Input,
    TextArea,
    Heading,
    Spacer,
    Switcher,
  } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import api from "builderStore/api"
  import { FIELDS } from "constants/backend"
  import IntegrationQueryEditor from "components/integration/index.svelte"
  import ExternalDataSourceTable from "components/backend/DataTable/ExternalDataSourceTable.svelte"
  import EditQueryParamsPopover from "components/backend/DatasourceNavigator/popovers/EditQueryParamsPopover.svelte"
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

  $: config = $backendUiStore.integrations[datasourceType]?.query
  $: docsLink = $backendUiStore.integrations[datasourceType]?.docs

  $: shouldShowQueryConfig = config && query.queryVerb

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

      data = json || []

      if (data.length === 0) {
        notifier.info(
          "Query results empty. Please execute a query with results to create your schema."
        )
        return
      }

      notifier.success("Query executed successfully.")

      // Assume all the fields are strings and create a basic schema
      // from the first record returned by the query
      fields = Object.keys(json[0]).map(field => ({
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

<header>
  <div class="input">
    <Input placeholder="✎ Edit Query Name" bind:value={query.name} />
  </div>
  {#if config}
    <div class="props">
      <div class="query-type">
        Query type:
        <span class="query-type-span">{config[query.queryVerb].type}</span>
      </div>
      <div class="select">
        <Select primary thin bind:value={query.queryVerb}>
          {#each Object.keys(config) as queryVerb}
            <option value={queryVerb}>{queryVerb}</option>
          {/each}
        </Select>
      </div>
    </div>
    <EditQueryParamsPopover
      bind:parameters={query.parameters}
      bindable={false} />
  {/if}
</header>
<Spacer extraLarge />

{#if shouldShowQueryConfig}
  <section>
    <div class="config">
      <IntegrationQueryEditor
        {query}
        schema={config[query.queryVerb]}
        bind:parameters />

      <Spacer extraLarge />
      <Spacer large />

      <div class="viewer-controls">
        <Button blue disabled={data.length === 0} on:click={saveQuery}>
          Save Query
        </Button>
        <Button primary on:click={previewQuery}>Run Query</Button>
      </div>

      <section class="viewer">
        {#if data}
          <Switcher headings={PREVIEW_HEADINGS} bind:value={tab}>
            {#if tab === 'JSON'}
              <pre class="preview">{JSON.stringify(data[0], undefined, 2)}</pre>
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

<style>
  .input {
    width: 300px;
  }

  .select {
    width: 200px;
    margin-right: 40px;
  }

  .props {
    display: flex;
    flex-direction: row;
    margin-left: auto;
    align-items: center;
    gap: var(--layout-l);
  }

  .field {
    display: grid;
    grid-template-columns: 1fr 1fr 50px;
    gap: var(--spacing-l);
  }

  a {
    font-size: var(--font-size-s);
  }

  .config {
    margin-bottom: var(--spacing-s);
  }

  .delete {
    align-self: center;
    cursor: pointer;
  }

  .query-type {
    font-family: var(--font-sans);
    color: var(--grey-8);
    font-size: var(--font-size-s);
  }

  .query-type-span {
    text-transform: uppercase;
  }

  .preview {
    width: 800px;
    height: 100%;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  header {
    display: flex;
    align-items: center;
  }

  .viewer-controls {
    display: flex;
    flex-direction: row;
    margin-left: auto;
    direction: rtl;
    z-index: 5;
    gap: var(--spacing-m);
    min-width: 150px;
  }

  .viewer {
    margin-top: -28px;
    z-index: -2;
  }
</style>
