<script>
  import Editor from "./QueryEditor.svelte"
  import FieldsBuilder from "./QueryFieldsBuilder.svelte"
  import { Label, Input } from "@budibase/bbui"

  const QueryTypes = {
    SQL: "sql",
    JSON: "json",
    FIELDS: "fields",
  }

  export let query
  export let datasource
  export let schema
  export let editable = true
  export let height = 500

  $: urlDisplay =
    schema.urlDisplay &&
    `${datasource.config.url}${query.fields.path}${query.fields.queryString}`

  function updateQuery({ detail }) {
    query.fields[schema.type] = detail.value
  }
</script>

{#if schema}
  {#key query._id}
    {#if schema.type === QueryTypes.SQL}
      <Editor
        editorHeight={height}
        label="Query"
        mode="sql"
        on:change={updateQuery}
        readOnly={!editable}
        value={query.fields.sql}
        parameters={query.parameters} />
    {:else if schema.type === QueryTypes.JSON}
      <Editor
        editorHeight={height}
        label="Query"
        mode="json"
        on:change={updateQuery}
        readOnly={!editable}
        value={query.fields.json}
        parameters={query.parameters} />
    {:else if schema.type === QueryTypes.FIELDS}
      <FieldsBuilder bind:fields={query.fields} {schema} {editable} />
      {#if schema.urlDisplay}
        <div class="url-row">
          <Label small>URL</Label>
          <Input thin outline disabled value={urlDisplay} />
        </div>
      {/if}
    {/if}
  {/key}
{/if}

<style>
  .url-row {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
