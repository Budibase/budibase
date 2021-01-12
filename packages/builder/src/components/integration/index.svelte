<script>
  import { TextArea, Label, Input, Heading, Spacer } from "@budibase/bbui"
  import Editor from "./SvelteEditor.svelte"
  import ParameterBuilder from "./QueryParameterBuilder.svelte"

  const QueryTypes = {
    SQL: "sql",
    JSON: "json",
    FIELDS: "fields",
  }

  export let query

  function updateQuery({ detail }) {
    query.queryString = detail.value
  }
</script>

<ParameterBuilder bind:parameters={query.parameters} bindable={false} />
<Spacer large />

<Heading extraSmall black>Query</Heading>
<Spacer large />

{#if query.queryType === QueryTypes.SQL}
  <!-- <TextArea bind:value={query.queryString} /> -->
  <Editor
    label="Query"
    mode="sql"
    on:change={updateQuery}
    value={query.queryString} />
{:else if query.queryType === QueryTypes.JSON}
  <Spacer large />
  <Editor
    label="Query"
    mode="json"
    on:change={updateQuery}
    value={query.queryString} />
{:else if query.queryType === QueryTypes.FIELDS}
  <!-- {#each Object.keys()} -->
{/if}
