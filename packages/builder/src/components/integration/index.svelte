<script>
  import { onMount } from "svelte"
  import { TextArea, Label, Input, Heading, Spacer } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import ParameterBuilder from "./QueryParameterBuilder.svelte"
  import FieldsBuilder from "./QueryFieldsBuilder.svelte"

  const QueryTypes = {
    SQL: "sql",
    JSON: "json",
    FIELDS: "fields",
  }

  export let query
  export let schema
  export let editable = true

  function updateQuery({ detail }) {
    query.fields[schema.type] = detail.value
  }
</script>


{#if schema}
  {#key query._id}
    {#if schema.type === QueryTypes.SQL}
      <Editor
        label="Query"
        mode="sql"
        on:change={updateQuery}
        readOnly={!editable}
        value={query.fields.sql} />
    {:else if schema.type === QueryTypes.JSON}
      <Editor
        label="Query"
        mode="json"
        on:change={updateQuery}
        readOnly={!editable}
        value={query.fields.json} />
    {:else if schema.type === QueryTypes.FIELDS}
      <FieldsBuilder bind:fields={query.fields} {schema} {editable} />
    {/if}
  {/key}
{/if}
