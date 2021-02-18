<script>
  import {
    Button,
    TextArea,
    Label,
    Input,
    Heading,
    Select,
    Spacer
  } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import KeyValueBuilder from "./KeyValueBuilder.svelte"

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
      {#if schema.fields[field]?.type === 'object'}
        <div>
          <Label small>{field}</Label>
          <Spacer small />
          <KeyValueBuilder bind:object={fields[field]} />
        </div>
      {:else if schema.fields[field]?.type === 'json'}
        <div>
          <Label extraSmall grey>{field}</Label>
          <Editor
            mode="json"
            on:change={({ detail }) => (fields[field] = detail.value)}
            readOnly={!editable}
            value={fields[field]} />
        </div>
      {:else}
        <div class="horizontal">
          <Label small>{field}</Label>
          <Input
            placeholder="Enter {field}"
            outline
            disabled={!editable}
            type={schema.fields[field]?.type}
            required={schema.fields[field]?.required}
            bind:value={fields[field]} />
        </div>
      {/if}
    {/each}
  </div>
</form>
{#if schema.customisable}
  <Label small>Query</Label>
  <Spacer small />
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

  .horizontal {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
