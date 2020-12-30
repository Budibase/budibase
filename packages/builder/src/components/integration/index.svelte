<script>
  import { TextArea } from "@budibase/bbui"
  import Editor from "./Editor.svelte"

  const QueryTypes = {
    SQL: "sql",
  }

  export let queryType
  export let query

  $: console.log(query)
</script>

{#if queryType === QueryTypes.SQL}
  <Editor label="Query" bind:value={query} />
{/if}
