<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Select } from "@budibase/bbui"

  const { sort, columns, stickyColumn } = getContext("sheet")
  const orderOptions = [
    { label: "Ascending", value: "ascending" },
    { label: "Descending", value: "descending" },
  ]

  let open = false
  let anchor

  $: columnOptions = getColumnOptions($stickyColumn, $columns)
  $: console.log($sort)

  const getColumnOptions = (stickyColumn, columns) => {
    let options = []
    if (stickyColumn) {
      options.push(stickyColumn.name)
    }
    return [...options, ...columns.map(col => col.name)]
  }
</script>

<div bind:this={anchor}>
  <ActionButton
    icon="SortOrderDown"
    quiet
    size="M"
    on:click={() => (open = !open)}
    selected={!!$sort.order}
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
