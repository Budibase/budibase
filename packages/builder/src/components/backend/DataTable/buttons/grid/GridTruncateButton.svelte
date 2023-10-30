<script>
  import TruncateButton from "../TruncateButton.svelte"
  import { getContext } from "svelte"

  export let disabled = false

  const { rows } = getContext("grid")
</script>

<TruncateButton
  {disabled}
  on:truncate={rows.actions.deleteAllRows}
/>
