<script>
  import {
    Button,
    TextArea,
    Label,
    Input,
    Heading,
    Select,
  } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"

  export let fields = {}
  export let schema
  export let editable

  let draftField = {}

  $: fieldKeys = Object.keys(fields)
  $: schemaKeys = Object.keys(schema.fields)

  function updateCustomFields({ detail }) {
    fields.customData = detail.value
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
    </div>
  {/each}
</form>
<Label extraSmall grey>Data</Label>
{#if schema.customisable}
  <Editor
    label="Query"
    mode="json"
    on:change={updateCustomFields}
    readOnly={!editable}
    value={fields.customData} />
{/if}

<style>
  .field {
    margin-bottom: var(--spacing-m);
    display: grid;
    grid-template-columns: 1fr 2%;
    grid-gap: var(--spacing-m);
    align-items: center;
  }
</style>
