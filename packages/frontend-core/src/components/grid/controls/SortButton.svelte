<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Select } from "@budibase/bbui"

  const { sort, columns, stickyColumn } = getContext("grid")

  let open = false
  let anchor

  $: columnOptions = getColumnOptions($stickyColumn, $columns)
  $: checkValidSortColumn($sort.column, $stickyColumn, $columns)
  $: orderOptions = getOrderOptions($sort.column, columnOptions)

  const getColumnOptions = (stickyColumn, columns) => {
    let options = []
    if (stickyColumn) {
      options.push({
        label: stickyColumn.label || stickyColumn.name,
        value: stickyColumn.name,
        type: stickyColumn.schema?.type,
      })
    }
    return [
      ...options,
      ...columns.map(col => ({
        label: col.label || col.name,
        value: col.name,
        type: col.schema?.type,
      })),
    ]
  }

  const getOrderOptions = (column, columnOptions) => {
    const type = columnOptions.find(col => col.value === column)?.type
    return [
      {
        label: type === "number" ? "Low-high" : "A-Z",
        value: "ascending",
      },
      {
        label: type === "number" ? "High-low" : "Z-A",
        value: "descending",
      },
    ]
  }

  const updateSortColumn = e => {
    sort.update(state => ({
      ...state,
      column: e.detail,
    }))
  }

  const updateSortOrder = e => {
    sort.update(state => ({
      ...state,
      order: e.detail,
    }))
  }

  // Ensure we never have a sort column selected that is not visible
  const checkValidSortColumn = (sortColumn, stickyColumn, columns) => {
    if (!sortColumn) {
      return
    }
    if (
      sortColumn !== stickyColumn?.name &&
      !columns.some(col => col.name === sortColumn)
    ) {
      if (stickyColumn) {
        sort.update(state => ({
          ...state,
          column: stickyColumn.name,
        }))
      } else {
        sort.update(state => ({
          ...state,
          column: columns[0]?.name,
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
    selected={open}
    disabled={!columnOptions.length}
  >
    Sort
  </ActionButton>
</div>

<Popover bind:open {anchor} align="left">
  <div class="content">
    <Select
      placeholder={null}
      value={$sort.column}
      options={columnOptions}
      autoWidth
      on:change={updateSortColumn}
      label="Column"
    />
    <Select
      placeholder={null}
      value={$sort.order}
      options={orderOptions}
      autoWidth
      on:change={updateSortOrder}
      label="Order"
    />
  </div>
</Popover>

<style>
  .content {
    padding: 6px 12px 12px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .content :global(.spectrum-Picker) {
    width: 140px;
  }
</style>
