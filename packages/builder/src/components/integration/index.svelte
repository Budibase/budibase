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

<ParameterBuilder bind:parameters={query.parameters} bindable={false} />
<Spacer large />

<Label grey medium>Query</Label>

{#if query.queryType === QueryTypes.SQL}
  <TextArea bind:value={query.queryString} />
  <!-- <Editor label="Query" on:change={updateQuery} value={query.queryString} /> -->
{:else if query.queryType === QueryTypes.JSON}
  <!-- <ParameterBuilder bind:parameters={query.parameters} bindable={false} />
  <Spacer large />
  <TextArea bind:value={query.queryString} /> -->
{:else if query.queryType === QueryTypes.FIELDS}
  <!-- {#each Object.keys()} -->
{/if}
