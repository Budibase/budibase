<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { dispatch, columns, stickyColumn, config } = getContext("sheet")
</script>

<ActionButton
  icon="TableRowAddBottom"
  quiet
  size="M"
  on:click={() => dispatch("add-row")}
  disabled={!$config.allowAddRows || (!$columns.length && !$stickyColumn)}
>
  Create row
</ActionButton>
