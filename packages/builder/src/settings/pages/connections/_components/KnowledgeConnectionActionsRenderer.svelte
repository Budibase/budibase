<script lang="ts">
  import { Button } from "@budibase/bbui"

  interface KnowledgeConnectionRow {
    canDelete: boolean
    onDelete?: () => Promise<void>
  }

  export let row: KnowledgeConnectionRow
</script>

{#if row.canDelete}
  <Button size="S" quiet warning on:click={() => row.onDelete?.()}>
    Delete
  </Button>
{/if}
