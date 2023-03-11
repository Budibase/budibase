<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Select } from "@budibase/bbui"

  const { sort, visibleColumns, stickyColumn } = getContext("sheet")
  const orderOptions = [
    { label: "A-Z", value: "ascending" },
    { label: "Z-A", value: "descending" },
  ]

  let open = false
  let anchor

  $: columnOptions = getColumnOptions($stickyColumn, $visibleColumns)
  $: checkValidSortColumn($sort.column, $stickyColumn, $visibleColumns)

  const getColumnOptions = (stickyColumn, columns) => {
    let options = []
    if (stickyColumn) {
      options.push(stickyColumn.name)
    }
    return [...options, ...columns.map(col => col.name)]
  }

  // Ensure we never have a sort column selected that is not visible
  const checkValidSortColumn = (sortColumn, stickyColumn, visibleColumns) => {
    if (!sortColumn) {
      return
    }
    if (
      sortColumn !== stickyColumn?.name &&
      !visibleColumns.some(col => col.name === sortColumn)
    ) {
      if (stickyColumn) {
        sort.update(state => ({
          ...state,
          column: stickyColumn.name,
        }))
      } else {
        sort.update(state => ({
          ...state,
          column: visibleColumns[0]?.name,
        }))
      }
    }
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="SortOrderDown"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={!!$sort.column}
    disabled={!$visibleColumns.length}
  >
    Sort
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <Select bind:value={$sort.column} options={columnOptions} autoWidth />
    <Select bind:value={$sort.order} options={orderOptions} autoWidth />
  </div>
</Popover>

<style>
  .content {
    padding: 12px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
