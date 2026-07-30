<script lang="ts">
  import { getContext } from "svelte"
  import type { Readable, Writable } from "svelte/store"
  import { ActionButton, Icon, Select } from "@budibase/bbui"
  import {
    FieldType,
    SortOrder,
    isNumeric,
    type UIFieldSchema,
  } from "@budibase/types"
  import { canBeSortColumn } from "@budibase/frontend-core"
  import DetailPopover from "@/components/common/DetailPopover.svelte"

  interface SortEntry {
    column: string
    order: SortOrder
  }

  interface ColumnOption {
    label: string
    value: string
    type: FieldType
  }

  interface OrderOption {
    label: string
    value: SortOrder
  }

  interface GridColumn {
    label?: string
    name: string
    schema: UIFieldSchema
  }

  interface GridContext {
    sort: Writable<SortEntry[]>
    columns: Readable<GridColumn[]>
  }

  const { sort, columns } = getContext<GridContext>("grid")

  let popover: DetailPopover | undefined

  $: columnOptions = $columns
    .filter(col => canBeSortColumn(col.schema))
    .map(col => ({
      label: col.label || col.name,
      value: col.name,
      type: col.schema.type,
    }))
  $: sortRows = $sort.length > 0 ? $sort : [undefined]
  $: canAddSort = columnOptions.some(
    option => !$sort.some(sortEntry => sortEntry.column === option.value)
  )

  const getOrderOptions = (
    column: string,
    columnOptions: ColumnOption[]
  ): OrderOption[] => {
    const type = columnOptions.find(col => col.value === column)?.type

    // Define labels based on column type
    let ascendingLabel, descendingLabel

    if (type && isNumeric(type)) {
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
        value: SortOrder.ASCENDING,
      },
      {
        label: descendingLabel,
        value: SortOrder.DESCENDING,
      },
    ]
  }

  const getColumnOptions = (currentColumn?: string): ColumnOption[] => {
    const used = new Set($sort.map(sortEntry => sortEntry.column))
    if (currentColumn) {
      used.delete(currentColumn)
    }
    return columnOptions.filter(option => !used.has(option.value))
  }

  const updateSortColumn = (index: number, column?: string) => {
    sort.update(currentSort => {
      const currentSortEntry = currentSort[index]

      if (!column) {
        if (!currentSortEntry) {
          return [...currentSort]
        }

        return currentSort.filter((_, sortIndex) => sortIndex !== index)
      }

      if (currentSortEntry) {
        return currentSort.map((sortEntry, sortIndex) => {
          if (sortIndex !== index) {
            return sortEntry
          }

          return {
            ...sortEntry,
            column,
          }
        })
      }

      return [
        ...currentSort,
        {
          column,
          order: SortOrder.ASCENDING,
        },
      ]
    })
  }

  const updateSortOrder = (index: number, order: SortOrder) => {
    sort.update(currentSort => {
      if (!currentSort[index]) {
        return currentSort
      }

      return currentSort.map((sortEntry, sortIndex) => {
        if (sortIndex !== index) {
          return sortEntry
        }

        return {
          ...sortEntry,
          order,
        }
      })
    })
  }

  const removeSort = (index: number) => {
    sort.update(state => state.filter((_, idx) => idx !== index))
  }

  const addSort = () => {
    const nextOption = columnOptions.find(
      option => !$sort.some(sortEntry => sortEntry.column === option.value)
    )

    if (!nextOption) {
      return
    }

    sort.update(currentSort => [
      ...currentSort,
      {
        column: nextOption.value,
        order: SortOrder.ASCENDING,
      },
    ])
  }
</script>

<DetailPopover bind:this={popover} title="Sorting" width={360}>
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
        value={sortRow?.column}
        options={getColumnOptions(sortRow?.column)}
        on:change={e => updateSortColumn(index, e.detail)}
        label="Column"
      />
      {#if sortRow?.column}
        <Select
          placeholder={false}
          value={sortRow.order || SortOrder.ASCENDING}
          options={getOrderOptions(sortRow.column, columnOptions)}
          on:change={e => updateSortOrder(index, e.detail)}
          label="Order"
        />
        <div class="remove-sort">
          <Icon
            name="x"
            hoverable
            color="var(--spectrum-global-color-gray-600)"
            hoverColor="var(--spectrum-global-color-gray-900)"
            size="S"
            on:click={() => removeSort(index)}
            tooltip="Remove sort"
          />
        </div>
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
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) auto;
    gap: var(--spacing-s);
    align-items: end;
  }

  .remove-sort {
    align-self: end;
    height: var(--spectrum-global-dimension-size-400);
    display: flex;
    align-items: center;
  }
</style>
