<script>
  import { TextArea, Label, Input, Heading, Spacer } from "@budibase/bbui"
  import Editor from "./QueryEditor.svelte"
  import ParameterBuilder from "./QueryParameterBuilder.svelte"

  const QueryTypes = {
    SQL: "sql",
  }

  export let query
</script>

{#if query.queryType === QueryTypes.SQL}
  <ParameterBuilder bind:parameters={query.parameters} />
  <Spacer large />
  <Editor label="Query" bind:value={query.queryString} />
{/if}
