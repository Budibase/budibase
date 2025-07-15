<script>
  import { getContext } from "svelte"
  import { ActionButton, Select } from "@budibase/bbui"
  import { FieldType, isNumeric } from "@budibase/types"
  import { canBeSortColumn } from "@budibase/frontend-core"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  const { sort, columns } = getContext("grid")

  let popover

  $: columnOptions = $columns
    .filter(col => canBeSortColumn(col.schema))
    .map(col => ({
      label: col.label || col.name,
      value: col.name,
      type: col.schema?.type,
    }))
  $: orderOptions = getOrderOptions($sort.column, columnOptions)

  const getOrderOptions = (column, columnOptions) => {
    const type = columnOptions.find(col => col.value === column)?.type

    // Define labels based on column type
    let ascendingLabel, descendingLabel

    if (isNumeric(type)) {
      ascendingLabel = "Low to high"
      descendingLabel = "High to low"
    } else if (type === FieldType.DATETIME) {
      ascendingLabel = "Oldest to newest"
      descendingLabel = "Newest to oldest"
    } else {
      ascendingLabel = "A-Z"
      descendingLabel = "Z-A"
    }

    return [
      {
        label: ascendingLabel,
        value: "ascending",
      },
      {
        label: descendingLabel,
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

<DetailPopover bind:this={popover} title="Sorting" width={300}>
  <svelte:fragment slot="anchor" let:open>
    <ActionButton
      icon="sort-descending"
      quiet
      size="M"
      on:click={popover?.open}
      selected={open}
      disabled={!columnOptions.length}
    >
      Sort
    </ActionButton>
  </svelte:fragment>
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
</DetailPopover>
