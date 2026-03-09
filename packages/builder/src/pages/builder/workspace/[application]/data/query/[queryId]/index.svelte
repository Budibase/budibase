<script>
  import { queries } from "@/stores/builder"
  import QueryViewer from "@/components/integration/QueryViewer.svelte"
  import { cloneDeep } from "lodash/fp"

  $: query = $queries.selected
  $: editableQuery = cloneDeep(query)
</script>

{#if query}
  <QueryViewer query={editableQuery} />
{/if}
