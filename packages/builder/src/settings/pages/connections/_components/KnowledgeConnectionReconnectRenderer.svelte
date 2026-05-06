<script lang="ts">
  import { ActionButton } from "@budibase/bbui"

  interface KnowledgeConnectionRow {
    id: string
    reconnect?: () => void
  }

  export let row: KnowledgeConnectionRow
</script>

<ActionButton size="S" on:click={() => row.reconnect?.()}>
  Reconnect
</ActionButton>
