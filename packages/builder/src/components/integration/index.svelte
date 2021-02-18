<script>
  import Editor from "./QueryEditor.svelte"
  import FieldsBuilder from "./QueryFieldsBuilder.svelte"

  const QueryTypes = {
    SQL: "sql",
    JSON: "json",
    FIELDS: "fields",
  }

  export let query
  export let schema
  export let editable = true
  export let height = 500

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
    {/if}
  {/key}
{/if}
