<script>
  import CreateRowButton from "../CreateRowButton.svelte"
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext } from "svelte"

  const { rows, columns } = getContext("sheet")

  $: hasCols = !!$columns.length
  $: hasRows = !!$rows.length
</script>

<CreateRowButton
  title="Create row"
  modalContentComponent={CreateEditRow}
  disabled={!hasCols}
  highlighted={hasCols && !hasRows}
/>
