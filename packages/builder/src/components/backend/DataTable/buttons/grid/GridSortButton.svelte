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
  $: sortRows =
    $sort.length > 0 ? $sort : [{ column: null, order: "ascending" }]
  $: canAddSort =
    columnOptions.filter(option => !$sort.some(s => s.column === option.value))
      .length > 0

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

  const getColumnOptions = currentColumn => {
    const used = new Set($sort.map(sortEntry => sortEntry.column))
    if (currentColumn) {
      used.delete(currentColumn)
    }
    return columnOptions.filter(option => !used.has(option.value))
  }

  const updateSortColumn = (index, column) => {
    sort.update(state => {
      const next = [...state]
      if (!column) {
        if (next[index]) {
          next.splice(index, 1)
        }
        return next
      }
      if (next[index]) {
        next[index] = {
          ...next[index],
          column,
        }
      } else {
        next.push({ column, order: "ascending" })
      }
      return next
    })
  }

  const updateSortOrder = (index, order) => {
    sort.update(state => {
      if (!state[index]) {
        return state
      }
      const next = [...state]
      next[index] = {
        ...next[index],
        order,
      }
      return next
    })
  }

  const removeSort = index => {
    sort.update(state => state.filter((_, idx) => idx !== index))
  }

  const addSort = () => {
    const used = new Set($sort.map(sortEntry => sortEntry.column))
    const nextOption = columnOptions.find(option => !used.has(option.value))
    if (!nextOption) {
      return
    }
    sort.update(state => [
      ...state,
      {
        column: nextOption.value,
        order: "ascending",
      },
    ])
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
  {#each sortRows as sortRow, index (index)}
    <div class="sort-row">
      <Select
        placeholder="Default"
        value={sortRow.column}
        options={getColumnOptions(sortRow.column)}
        autoWidth
        on:change={e => updateSortColumn(index, e.detail)}
        label="Column"
      />
      {#if sortRow.column}
        <Select
          placeholder={null}
          value={sortRow.order || "ascending"}
          options={getOrderOptions(sortRow.column, columnOptions)}
          autoWidth
          on:change={e => updateSortOrder(index, e.detail)}
          label="Order"
        />
        <ActionButton
          class="remove-sort"
          icon="x"
          quiet
          size="S"
          on:click={() => removeSort(index)}
          aria-label="Remove sort"
        />
      {/if}
    </div>
  {/each}
  <ActionButton
    icon="plus"
    quiet
    size="S"
    on:click={addSort}
    disabled={!canAddSort}
  >
    Add sort
  </ActionButton>
</DetailPopover>

<style>
  .sort-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: var(--spacing-s);
    align-items: end;
  }

  .remove-sort {
    align-self: center;
    margin-top: 18px;
  }
</style>
