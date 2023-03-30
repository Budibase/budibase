<script>
  import { getContext } from "svelte"
  import SheetCell from "./SheetCell.svelte"
  import { getCellRenderer } from "../lib/renderers"

  const { rows, selectedCellId, menu, selectedCellAPI } = getContext("sheet")

  export let rowSelected
  export let rowHovered
  export let rowIdx
  export let selected
  export let selectedUser
  export let reorderSource
  export let reorderTarget
  export let column
  export let row
  export let cellId

  let api

  $: {
    if (selected) {
      selectedCellAPI.set({
        ...api,
        isReadonly: () => !!column.schema.autocolumn,
      })
    }
  }
</script>

<SheetCell
  {rowSelected}
  {rowHovered}
  {rowIdx}
  {selected}
  {selectedUser}
  {reorderSource}
  {reorderTarget}
  on:click={() => selectedCellId.set(cellId)}
  on:contextmenu={e => menu.actions.open(cellId, e)}
  width={column.width}
>
  <svelte:component
    this={getCellRenderer(column)}
    bind:api
    value={row[column.name]}
    schema={column.schema}
    {selected}
    onChange={val => rows.actions.updateRow(row._id, column.name, val)}
    readonly={column.schema.autocolumn}
  />
</SheetCell>
