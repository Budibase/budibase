<script>
  import {
    Select,
    Button,
    Input,
    TextArea,
    Heading,
    Spacer,
  } from "@budibase/bbui"
  import { notifier } from "builderStore/store/notifications"
  import { FIELDS } from "constants/backend"
  import { backendUiStore } from "builderStore"
  import * as api from "../api"

  export let table

  let smartSchemaRow
  let fields = Object.keys(table.schema).map(field => ({
    name: field,
    type: table.schema[field].type.toUpperCase(),
  }))

  $: {
    const schema = {}
    for (let field of fields) {
      if (!field.name) continue
      schema[field.name] = FIELDS[field.type]
    }
    table.schema = schema
  }

  function newField() {
    fields = [...fields, {}]
  }

  function deleteField(idx) {
    fields.splice(idx, 1)
    fields = fields
  }

  async function smartSchema() {
    try {
      const rows = await api.fetchDataForView($backendUiStore.selectedView)
      const first = rows[0]
      smartSchemaRow = first
      fields = Object.keys(first).map(key => ({
        // TODO: Smarter type mapping
        name: key,
        type: "STRING",
      }))
    } catch (err) {
      notifier.danger("Error determining schema. Please enter fields manually.")
    }
  }
</script>

<section>
  <div class="config">
    <h6>Schema</h6>
    {#if smartSchemaRow}
      <pre>{JSON.stringify(smartSchemaRow, undefined, 2)}</pre>
    {/if}
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
    <Button thin primary on:click={smartSchema}>Smart Schema</Button>
  </div>

  <div class="config">
    <h6>Datasource</h6>
    {#each Object.keys(table.integration) as configKey}
      {#if configKey === 'query'}
        <TextArea
          thin
          label={configKey}
          bind:value={table.integration[configKey]} />
      {:else}
        <Input
          thin
          type={configKey.type}
          label={configKey}
          bind:value={table.integration[configKey]} />
      {/if}
      <Spacer small />
    {/each}
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
    margin-bottom: var(--spacing-m);
    margin-top: var(--spacing-l);
  }

  .config {
    margin-bottom: var(--spacing-s);
  }

  .delete {
    align-self: center;
    cursor: pointer;
  }
</style>
