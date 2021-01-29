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
  <div class="field">
    {#each schemaKeys as field}
      <Input
        placeholder="Enter {field} name"
        outline
        disabled={!editable}
        type={schema.fields[field]?.type}
        required={schema.fields[field]?.required}
        bind:value={fields[field]} />
    {/each}
  </div>
</form>
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
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-m);
    align-items: center;
  }
</style>
