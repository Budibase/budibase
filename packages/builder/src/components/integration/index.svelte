<script>
  import { TextArea, Label, Input } from "@budibase/bbui"
  import Editor from "./Editor.svelte"

  const CAPTURE_VAR_INSIDE_MUSTACHE = /{{([^}]+)}}/g

  const QueryTypes = {
    SQL: "sql",
  }

  export let type
  export let query

  // $: parameters = Array.from(
  //   query
  //     .matchAll(CAPTURE_VAR_INSIDE_MUSTACHE)
  //     .map(([_, paramName]) => paramName)
  // )
</script>

<!-- {#each parameters as param}
  <Label grey extraSmall>{param}</Label>
  <Input thin bind:value={query.params[param]} />
{/each} -->

{#if type === QueryTypes.SQL}
  <Editor label="Query" bind:value={query} />
{/if}
