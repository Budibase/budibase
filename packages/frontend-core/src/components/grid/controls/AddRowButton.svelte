<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { dispatch, columns, stickyColumn, config, loaded } = getContext("grid")
</script>

<ActionButton
  icon="TableRowAddBottom"
  quiet
  size="M"
  on:click={() => dispatch("add-row-inline")}
  disabled={!loaded ||
    !$config.allowAddRows ||
    (!$columns.length && !$stickyColumn)}
>
  Add row
</ActionButton>
