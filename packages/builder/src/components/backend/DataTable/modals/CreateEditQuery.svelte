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
  import { backendUiStore } from "builderStore"

  const PREVIEW_HEADINGS = [
    {
      title: "Preview",
      key: "PREVIEW",
    },
    {
      title: "Schema",
      key: "SCHEMA",
    },
  ]

  export let datasource
  export let query
  export let fields = []

  console.log(query)

  let config = {}
  let queryType
  let previewTab = "PREVIEW"
  let preview

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
      const response = await api.post(`/api/datasources/queries/preview`, {
        type: datasource.source,
        config: datasource.config,
        query: query.queryString,
      })
      const json = await response.json()
      if (response.status !== 200) {
        throw new Error(json.message)
      }
      preview = json[0] || {}

      // TODO: refactor
      fields = Object.keys(preview).map(field => ({
        name: field,
        type: "STRING",
      }))
    } catch (err) {
      notifier.danger(`Query Error: ${err.message}`)
      console.error(err)
    }
  }

  onMount(() => {
    fetchQueryConfig()
  })
</script>

<section>
  <div class="config">
    <h6>Datasource Type</h6>
    <span>{datasource.source}</span>

    <Spacer medium />

    <Label extraSmall grey>Query Name</Label>
    <Input type="text" thin bind:value={query.name} />

    <Spacer medium />

    <Label extraSmall grey>Query Type</Label>
    <Select secondary bind:value={queryType}>
      <option value={''}>Select an option</option>
      {#each Object.keys(config) as queryType}
        <option value={queryType}>{queryType}</option>
      {/each}
    </Select>

    <Spacer medium />

    <IntegrationQueryEditor {queryType} bind:query={query.queryString} />

    <Spacer small />

    <Button thin secondary on:click={previewQuery}>Preview Query</Button>

    <Spacer small />

    {#if preview}
      <Switcher headings={PREVIEW_HEADINGS} bind:value={previewTab}>
        {#if previewTab === 'PREVIEW'}
          <pre class="preview">{JSON.stringify(preview, undefined, 2)}</pre>
        {:else if previewTab === 'SCHEMA'}
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
  </div>
</section>

<style>
  .field {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr 50px;
    margin-bottom: var(--spacing-m);
  }

  h6 {
    font-family: var(--font-sans);
    font-weight: 600;
    text-rendering: var(--text-render);
    color: var(--ink);
    font-size: var(--heading-font-size-xs);
    color: var(--ink);
    margin-bottom: var(--spacing-xs);
    margin-top: var(--spacing-xs);
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
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }
</style>
