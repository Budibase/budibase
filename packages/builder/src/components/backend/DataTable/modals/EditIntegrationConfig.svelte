<script>
  import { Select, Button, Input, TextArea, Heading } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { backendUiStore } from "builderStore"

  export let table

  let fields = []

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

<form>
  <Heading extraSmall black>Schema</Heading>
  <!-- {#each Object.keys(table.schema) as schemaKey, idx}
    <Input
      thin
      type={'text'}
      label={schemaKey}
      bind:value={table.schema[schemaKey]} />
  {/each} -->
  {#each fields as field}
    <div class="field">
      <Input thin type={'text'} bind:value={field.name} />
      <Select secondary thin bind:value={field.type}>
        <option value={''}>Select an option</option>
        <option value={'STRING'}>Text</option>
        <option value={'NUMBER'}>Number</option>
        <option value={'BOOLEAN'}>Boolean</option>
        <option value={'DATETIME'}>Datetime</option>
      </Select>
    </div>
  {/each}

  <Button thin secondary on:click={newField}>Add Field</Button>
  <Heading extraSmall black>Datasource</Heading>
  {#each Object.keys(table.integration) as configKey}
    <Input
      thin
      type={configKey.type}
      label={configKey}
      bind:value={table.integration[configKey]} />
  {/each}
</form>

<style>
  .field {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;
    margin-bottom: var(--spacing-xs);
  }
</style>
