<script>
  import CreateRowButton from "../CreateRowButton.svelte"
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext } from "svelte"

  const { rows, columns, filter, loaded } = getContext("sheet")

  $: hasCols = !$loaded || $columns.length
  $: hasRows = !$loaded || $filter.length || $rows.length
</script>

<CreateRowButton
  title="Create row"
  modalContentComponent={CreateEditRow}
  disabled={!hasCols}
  highlighted={hasCols && !hasRows}
/>
