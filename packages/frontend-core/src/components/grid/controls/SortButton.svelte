<script>
  import { getContext } from "svelte"
  import { ActionButton, Popover, Select } from "@budibase/bbui"
  import { canBeSortColumn } from "@budibase/shared-core"

  const { sort, columns } = getContext("grid")

  let open = false
  let anchor

  $: columnOptions = $columns
    .map(col => ({
      label: col.label || col.name,
      value: col.name,
      type: col.schema?.type,
    }))
    .filter(col => canBeSortColumn(col.type))
  $: orderOptions = getOrderOptions($sort.column, columnOptions)

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
      column: e.detail,
      order: e.detail ? state.order : "ascending",
    }))
  }

  const updateSortOrder = e => {
    sort.update(state => ({
      ...state,
      order: e.detail,
    }))
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
      placeholder="Default"
      value={$sort.column}
      options={columnOptions}
      autoWidth
      on:change={updateSortColumn}
      label="Column"
    />
    {#if $sort.column}
      <Select
        placeholder={null}
        value={$sort.order || "ascending"}
        options={orderOptions}
        autoWidth
        on:change={updateSortOrder}
        label="Order"
      />
    {/if}
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
