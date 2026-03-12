<script lang="ts">
  import { AbsTooltip, ActionButton } from "@budibase/bbui"

  export let row: {
    _id?: string
    onDelete?: () => void
  }

  const remove = () => {
    row.onDelete?.()
  }
</script>

<div class="file-actions">
  <AbsTooltip text="Remove file">
    <ActionButton icon="trash" size="S" on:click={remove} />
  </AbsTooltip>
</div>

<style>
  .file-actions {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
  }
</style>
