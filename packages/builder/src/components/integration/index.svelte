<script>
  import { TextArea, Label, Input, Heading, Spacer } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import ParameterBuilder from "./QueryParameterBuilder.svelte"

  const QueryTypes = {
    SQL: "sql",
  }

  export let query

  function updateQuery({ detail }) {
    query.queryString = detail
  }
</script>

{#if query.queryType === QueryTypes.SQL}
  <ParameterBuilder bind:parameters={query.parameters} />
  <Spacer large />
  <Editor label="Query" on:change={updateQuery} value={query.queryString} />
{/if}
