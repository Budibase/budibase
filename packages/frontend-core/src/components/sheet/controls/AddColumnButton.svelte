<script>
  import { ActionButton } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { config, dispatch, loaded } = getContext("sheet")
</script>

<ActionButton
  icon="TableColumnAddRight"
  quiet
  size="M"
  on:click={() => dispatch("add-column")}
  disabled={!$loaded || !$config.allowAddColumns}
>
  Create column
</ActionButton>
