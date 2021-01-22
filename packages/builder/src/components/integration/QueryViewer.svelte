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

  $: shouldShowQueryConfig = config && query.queryVerb && query.queryType

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
  <Heading small>{query.name}</Heading>
  {#if config}
    <div class="queryVerbs">
    </div>
      <Select thin secondary bind:value={query.queryVerb}>
        {#each Object.keys(config) as queryVerb}
          <option value={queryVerb}>{queryVerb}</option>
        {/each}
      </Select>
      <Select thin secondary bind:value={query.queryType}>
        <option value={""}>Please select an option</option>
        {#each Object.keys(config[query.queryVerb]) as queryType}
          <option value={queryType}>{queryType}</option>
        {/each}
      </Select>
    <EditQueryParamsPopover bind:parameters={query.parameters} bindable={false} />
    <Spacer medium />
    <Button primary href={docsLink} target="_blank">
      <i class="ri-book-2-line" />
    </Button>
  {/if}
</header>

<Spacer large />

{#if shouldShowQueryConfig}
  <section>
    <div class="config">
      <Label extraSmall grey>Query Name</Label>
      <Input thin bind:value={query.name} />

      <Spacer medium />

      <IntegrationQueryEditor
        {query}
        schema={config[query.queryVerb][query.queryType]}
        bind:parameters />

      <Spacer medium />

      <div class="viewer-controls">
        <Button
          wide
          thin
          blue
          disabled={data.length === 0}
          on:click={saveQuery}>
          Save
        </Button>
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
{/if}

<style>
  .field {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr 50px;
    margin-bottom: var(--spacing-m);
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

  .queryVerbs {
    display: flex;
    flex: 1;
    font-size: var(--font-size-m);
    align-items: center;
    margin-left: var(--spacing-l);
  }

  .queryVerb {
    text-transform: capitalize;
    margin-right: var(--spacing-m);
    color: var(--grey-5);
    cursor: pointer;
  }

  .selected {
    color: var(--white);
    font-weight: 500;
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
