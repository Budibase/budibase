<script>
  import {
    Button,
    TextArea,
    Label,
    Input,
    Heading,
    Spacer,
    Select
  } from "@budibase/bbui"

  export let fields = {}
  export let schema

  let customSchema = {}
  let draftField = {}

  function addField() {
    // Add the new field to custom fields for the query
    customSchema[draftField.name] = {
      type: draftField.type
    }
    // reset the draft field
    draftField = {}
  }
</script>

<form on:submit|preventDefault>
  {#each Object.keys(schema.fields) as field}
    <Label extraSmall grey>{field}</Label>
    <Input
      type={schema.fields[field]?.type}
      required={schema.fields[field]?.required}
      bind:value={fields[field]} />
    <Spacer medium />
  {/each}
  {#if schema.customisable}
    <Label>Add Custom Field</Label>
    {#each Object.keys(customSchema) as field}
      <Label extraSmall grey>{field}</Label>
      <Input 
        thin
        type={customSchema[field]?.type}
        bind:value={fields[field]} 
      />
      <Spacer medium />
    {/each}
    <div class="new-field">
      <Label extraSmall grey>Name</Label>
      <Label extraSmall grey>Type</Label>
      <Input thin bind:value={draftField.name} />
      <Select thin secondary bind:value={draftField.name}>
        <option value={"text"}>String</option>
        <option value={"number"}>Number</option>
      </Select>
    </div>
    <Button small thin primary on:click={addField}>Add Field</Button>
  {/if}
</form>

<style>
.new-field {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spacing-m);
  margin-top: var(--spacing-m);
  margin-bottom: var(--spacing-m);
}
</style>