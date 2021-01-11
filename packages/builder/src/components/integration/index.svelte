<script>
  import { TextArea, Label, Input, Heading, Spacer } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import ParameterBuilder from "./QueryParameterBuilder.svelte"

  const QueryTypes = {
    SQL: "sql",
    JSON: "json",
    FIELDS: "fields",
  }

  export let query

  function updateQuery({ detail }) {
    query.queryString = detail
  }
</script>

{#if query.queryType === QueryTypes.SQL}
  <ParameterBuilder bind:parameters={query.parameters} bindable={false} />
  <Spacer large />
  <TextArea bind:value={query.queryString} />
  <!-- <Editor label="Query" on:change={updateQuery} value={query.queryString} /> -->
{:else if query.queryType === QueryTypes.JSON}

{:else if query.queryType === QueryTypes.FIELDS}{/if}
