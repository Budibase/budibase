<script>
  import {
    Select,
    Button,
    Input,
    TextArea,
    Heading,
    Spacer,
  } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { backendUiStore } from "builderStore"

  export let table

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
</script>

<section>
  <div class="config">
    <h6>Schema</h6>
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
  }
</style>
