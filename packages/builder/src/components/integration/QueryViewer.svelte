<script>
  import { onMount } from "svelte"
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
      title: "Results",
      key: "RESULTS",
    },
    {
      title: "Preview",
      key: "PREVIEW",
    },
  ]

  export let query
  export let fields = []

  let config = {}
  let tab = "JSON"
  let parameters
  let data

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

  $: datasourceType = datasource.source
  $: datasourceType && fetchQueryConfig()

  function newField() {
    fields = [...fields, {}]
  }

  function deleteField(idx) {
    fields.splice(idx, 1)
    fields = fields
  }

  async function fetchQueryConfig() {
    try {
      const response = await api.get(`/api/integrations/${datasource.source}`)
      const json = await response.json()
      config = json.query
    } catch (err) {
      // TODO: Error fetching integration config
      // notifier.danger()
      console.error(err)
    }
  }

  async function previewQuery() {
    try {
      const response = await api.post(`/api/queries/preview`, {
        parameters: query.parameters.reduce(
          (acc, next) => ({
            ...acc,
            [next.name]: next.default,
          }),
          {}
        ),
        datasourceId: datasource._id,
        query: query.queryString,
      })
      const json = await response.json()

      if (response.status !== 200) throw new Error(json.message)

      data = json || []

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
      await backendUiStore.actions.queries.save(query.datasourceId, query)
      notifier.success(`Query saved successfully.`)
    } catch (err) {
      console.error(err)
      notifier.danger(`Error creating query. ${err.message}`)
    }
  }
</script>

<section>
  <div class="config">
    <Label extraSmall grey>Query Name</Label>
    <Input thin bind:value={query.name} />

    <Spacer medium />

    <Label extraSmall grey>Query Type</Label>
    <Select secondary bind:value={query.queryType}>
      <option value={''}>Select an option</option>
      {#each Object.keys(config) as queryType}
        <option value={queryType}>{queryType}</option>
      {/each}
    </Select>

    <Spacer medium />

    <IntegrationQueryEditor {query} bind:parameters />

    <Spacer medium />

    <div class="viewer-controls">
      <Button wide thin blue disabled={!data} on:click={saveQuery}>Save</Button>
      <Button wide thin primary on:click={previewQuery}>Run</Button>
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
              <div class="field">
                <Input thin type={'text'} bind:value={field.name} />
                <Select secondary thin bind:value={field.type}>
                  <option value={''}>Select an option</option>
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
            <Button thin secondary on:click={newField}>Add Field</Button>
          {/if}
        </Switcher>
      {/if}
    </section>
  </div>
</section>

<style>
  .field {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr 50px;
    margin-bottom: var(--spacing-m);
  }

  .config {
    margin-bottom: var(--spacing-s);
  }

  .delete {
    align-self: center;
    cursor: pointer;
  }

  .preview {
    width: 800px;
    height: 100%;
    overflow-y: auto;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }

  .viewer {
  }

  .viewer-controls {
    display: grid;
    grid-gap: var(--spacing-m);
    grid-auto-flow: column;
    direction: rtl;
    grid-template-columns: 10% 10% 1fr;
    margin-bottom: var(--spacing-m);
  }
</style>
