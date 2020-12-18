<script>
  import { TextArea } from "@budibase/bbui"

  const QueryTypes = {
    SQL: "sql",
  }

  export let queryType
  export let query
</script>

{#if queryType === QueryTypes.SQL}
  <TextArea thin label="Query" bind:value={query} />
{/if}
