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
  import KeyValueBuilder from "./KeyValueBuilder.svelte"

  export let fields = {}
  export let schema
  export let editable

  let draftField = {}

  $: fieldKeys = Object.keys(fields)
  $: schemaKeys = Object.keys(schema.fields)

  $: console.log({
    fields,
    schema
  })

  function updateCustomFields({ detail }) {
    fields.customData = detail.value
  }

</script>

<form on:submit|preventDefault>
  <div class="field">
    {#each schemaKeys as field}
      {#if schema.fields[field]?.type === "object"}
        <Label extraSmall grey>{field}</Label>
        <KeyValueBuilder bind:object={fields[field]} /> 
      {:else if schema.fields[field]?.type === "json"}
        <Label extraSmall grey>{field}</Label>
        <Editor
          mode="json"
          on:change={({ detail }) => fields[field] = detail.value}
          readOnly={!editable}
          value={fields[field]} />
      {:else}
        <Input
          label={field}
          placeholder="Enter {field} name"
          outline
          disabled={!editable}
          type={schema.fields[field]?.type}
          required={schema.fields[field]?.required}
          bind:value={fields[field]} />
      {/if}
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
    grid-template-columns: 1fr;
    grid-gap: var(--spacing-m);
    align-items: center;
  }

</style>
