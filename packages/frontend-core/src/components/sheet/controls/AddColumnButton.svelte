<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { config, dispatch } = getContext("sheet")
</script>

<ActionButton
  icon="TableColumnAddRight"
  quiet
  size="M"
  on:click={() => dispatch("add-column")}
  disabled={!$config.allowAddColumns}
>
  Create column
</ActionButton>
