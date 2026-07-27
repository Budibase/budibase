<script lang="ts">
  import {
    Button,
    Icon,
    DrawerContent,
    Layout,
    Select,
    Label,
    Body,
    Input,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import type { TableSchema } from "@budibase/types"
  import CellEditor from "./CellEditor.svelte"
  import type { ColumnConfig } from "./types"

  interface DndItemsDetail<T> {
    items: T[]
  }

  export let columns: ColumnConfig[] = []
  export let options: string[] = []
  export let schema: TableSchema = {}
  export let allowCellEditing = true
  export let allowReorder = true

  const flipDurationMs = 150
  let dragDisabled = true

  $: unselectedColumns = getUnselectedColumns(options, columns)
  $: columns.forEach(column => {
    if (!column.id) {
      column.id = generate()
    }
  })

  const getUnselectedColumns = (
    allColumns: string[],
    selectedColumns: ColumnConfig[]
  ): string[] => {
    const optionsObj: Record<string, true> = {}
    allColumns.forEach((option: string) => {
      optionsObj[option] = true
    })
    selectedColumns?.forEach(column => {
      if (column.name) {
        delete optionsObj[column.name]
      }
    })
    return Object.keys(optionsObj)
  }

  const getRemainingColumnOptions = (selectedColumn?: string): string[] => {
    if (!selectedColumn || unselectedColumns.includes(selectedColumn)) {
      return unselectedColumns
    }
    return [selectedColumn, ...unselectedColumns]
  }

  const addColumn = () => {
    columns = [...columns, {}]
  }

  const removeColumn = (id?: string) => {
    if (!id) {
      return
    }
    columns = columns.filter(column => column.id !== id)
  }

  const updateColumnOrder = (e: CustomEvent<DndItemsDetail<ColumnConfig>>) => {
    columns = e.detail.items
  }

  const handleFinalize = (e: CustomEvent<DndItemsDetail<ColumnConfig>>) => {
    updateColumnOrder(e)
    dragDisabled = true
  }

  const addAllColumns = () => {
    const newColumns = [...(columns || [])]
    options.forEach((field: string) => {
      const fieldSchema = schema[field]
      const hasCol =
        columns && columns.findIndex(col => col.name === field) !== -1
      if (!fieldSchema?.autocolumn && !hasCol) {
        newColumns.push({
          name: field,
          displayName: field,
        })
      }
    })
    columns = newColumns
  }

  const reset = () => {
    columns = []
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<DrawerContent>
  <div class="container">
    <Layout noPadding gap="S">
      {#if columns?.length}
        <Layout noPadding gap="XS">
          <div class="column">
            <div></div>
            <Label size="L">Column</Label>
            <Label size="L">Label</Label>
            <div></div>
            <div></div>
          </div>
          <div
            class="columns"
            use:dndzone={{
              items: columns,
              flipDurationMs,
              dropTargetStyle: { outline: "none" },
              dragDisabled,
            }}
            on:finalize={handleFinalize}
            on:consider={updateColumnOrder}
          >
            {#each columns as column (column.id)}
              <div class="column" animate:flip={{ duration: flipDurationMs }}>
                <div
                  class:hide={!allowReorder}
                  class="handle"
                  aria-label="drag-handle"
                  style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                  on:mousedown={() => (dragDisabled = false)}
                >
                  <Icon name="dots-six-vertical" size="L" />
                </div>
                <Select
                  value={column?.name}
                  placeholder="Column"
                  options={getRemainingColumnOptions(column?.name)}
                  on:change={e => {
                    column.name = e.detail
                    column.displayName = e.detail
                  }}
                />
                <Input
                  value={column?.displayName}
                  placeholder="Label"
                  on:change={e => (column.displayName = e.detail)}
                />
                {#if allowCellEditing}
                  <CellEditor
                    {column}
                    on:change={e => {
                      Object.assign(column, e.detail)
                    }}
                  />
                {/if}
                <Icon
                  name="x"
                  hoverable
                  size="S"
                  on:click={() => removeColumn(column.id)}
                  disabled={columns.length === 1}
                />
              </div>
            {/each}
          </div>
        </Layout>
      {:else}
        <div class="column">
          <div class="wide">
            <Body size="S">
              The default column configuration will automatically be shown.
              <br />
              You can manually control which columns are included by adding them
              below.
            </Body>
          </div>
        </div>
      {/if}
      <div class="column">
        <div class="buttons wide">
          <Button secondary icon="plus" on:click={addColumn}>Add column</Button>
          <Button secondary quiet on:click={addAllColumns}>
            Add all columns
          </Button>
          {#if columns?.length}
            <Button secondary quiet on:click={reset}>Reset columns</Button>
          {/if}
        </div>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  .columns {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .column {
    gap: var(--spacing-l);
    display: grid;
    grid-template-columns: 20px 1fr 1fr 16px 16px;
    align-items: center;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .column:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
  .handle {
    display: grid;
    place-items: center;
  }
  .handle.hide {
    visibility: hidden;
  }
  .wide {
    grid-column: 2 / -1;
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
