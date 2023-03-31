<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { dispatch, columns, stickyColumn } = getContext("sheet")
</script>

<ActionButton
  icon="Add"
  quiet
  size="M"
  on:click={() => dispatch("add-row-inline")}
  disabled={!$columns.length && !$stickyColumn}
>
  Create row
</ActionButton>
