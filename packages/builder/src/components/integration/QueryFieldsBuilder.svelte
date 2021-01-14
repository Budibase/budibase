<script>
  import {
    Button,
    TextArea,
    Label,
    Input,
    Heading,
    Select
  } from "@budibase/bbui"

  export let fields = {}
  export let schema
  export let editable

  let draftField = {}

  $: fieldKeys = Object.keys(fields)
  $: schemaKeys = Object.keys(schema.fields)

  $: console.log({ fields, schema })

  function addField() {
    // Add the new field to custom fields for the query
    schema.fields[draftField.name] = {
      type: draftField.type
    }
    // reset the draft field
    draftField = {}
  }

  function removeField(field) {
    delete fields[field]
    fields = fields

    delete schema.fields[field]
    schema = schema
  }
</script>

<form on:submit|preventDefault>
  {#each schemaKeys as field}
    <Label extraSmall grey>{field}</Label>
    <div class="field">
      <Input
        disabled={!editable}
        type={schema.fields[field]?.type}
        required={schema.fields[field]?.required}
        bind:value={fields[field]} />
        {#if !schema.fields[field]?.required}
          <i class="ri-close-circle-line" on:click={() => removeField(field)} />
        {/if}
      </div>
  {/each}
</form>
{#if schema.customisable && editable}
  <div>
      <Label>Add Custom Field</Label>
      <div class="new-field">
        <Label extraSmall grey>Name</Label>
        <Label extraSmall grey>Type</Label>
        <Input thin bind:value={draftField.name} />
        <Select thin secondary bind:value={draftField.type}>
          <option value={"text"}>String</option>
          <option value={"number"}>Number</option>
        </Select>
      </div>
      <Button small thin secondary on:click={addField}>Add Field</Button>
  </div>
{/if}


<style>
.new-field {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-m);
  margin-top: var(--spacing-m);
  margin-bottom: var(--spacing-m);
}

.field {
  margin-bottom: var(--spacing-m);
  display: grid;
  grid-template-columns: 1fr 2%;
  grid-gap: var(--spacing-m);
  align-items: center;
}

i {
  transition: all 0.2s;
}

i:hover {
  transform: scale(1.1);
  font-weight: 500;
  cursor: pointer;
}

</style>