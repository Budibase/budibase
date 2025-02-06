<script>
  import { Label, Layout, Input } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import KeyValueBuilder from "./KeyValueBuilder.svelte"
  import { capitalise } from "@/helpers"

  export let fields = {}
  export let schema
  export let editable

  $: schemaKeys = Object.keys(schema?.fields || {})

  function updateCustomFields({ detail }) {
    fields.customData = detail.value
  }

  function getDisplayName(field) {
    let name
    if (schema.fields[field]?.display) {
      name = schema.fields[field]?.display
    } else {
      name = field
    }
    return capitalise(name)
  }
</script>

<form on:submit|preventDefault>
  <Layout noPadding gap="S">
    {#each schemaKeys as field}
      {#if schema.fields[field]?.type === "object"}
        <Label small>{getDisplayName(field)}</Label>
        <KeyValueBuilder
          name={getDisplayName(field)}
          readOnly={!editable}
          bind:object={fields[field]}
        />
      {:else if schema.fields[field]?.type === "json"}
        <div>
          <Label extraSmall grey>{getDisplayName(field)}</Label>
          <Editor
            mode="json"
            on:change={({ detail }) => (fields[field] = detail.value)}
            readOnly={!editable}
            value={fields[field]}
          />
        </div>
      {:else}
        <div class="horizontal">
          <Label small>{getDisplayName(field)}</Label>
          <Input
            placeholder="Enter {getDisplayName(field)}"
            outline
            disabled={!editable}
            type={schema.fields[field]?.type}
            required={schema.fields[field]?.required}
            bind:value={fields[field]}
          />
        </div>
      {/if}
    {/each}
  </Layout>
</form>
{#if schema.customisable}
  <Editor
    label="Query"
    mode="json"
    on:change={updateCustomFields}
    readOnly={!editable}
    value={fields.customData}
  />
{/if}

<style>
  .horizontal {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
