<script>
  import CreateViewButton from "../CreateViewButton.svelte"
  import { getContext } from "svelte"

  const { rows, columns } = getContext("sheet")

  $: disabled = !$columns.length || !$rows.length
</script>

<CreateViewButton {disabled} />
