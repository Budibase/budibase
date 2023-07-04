<script>
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
  import CellEditor from "./CellEditor.svelte"

  export let columns = []
  export let options = []
  export let schema = {}
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

  const getUnselectedColumns = (allColumns, selectedColumns) => {
    let optionsObj = {}
    allColumns.forEach(option => {
      optionsObj[option] = true
    })
    selectedColumns?.forEach(column => {
      delete optionsObj[column.name]
    })
    return Object.keys(optionsObj)
  }

  const getRemainingColumnOptions = selectedColumn => {
    if (!selectedColumn || unselectedColumns.includes(selectedColumn)) {
      return unselectedColumns
    }
    return [selectedColumn, ...unselectedColumns]
  }

  const addColumn = () => {
    columns = [...columns, {}]
  }

  const removeColumn = id => {
    columns = columns.filter(column => column.id !== id)
  }

  const updateColumnOrder = e => {
    columns = e.detail.items
  }

  const handleFinalize = e => {
    updateColumnOrder(e)
    dragDisabled = true
  }

  const addAllColumns = () => {
    let newColumns = columns || []
    options.forEach(field => {
      const fieldSchema = schema[field]
      const hasCol = columns && columns.findIndex(x => x.name === field) !== -1
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

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="S">
      {#if columns?.length}
        <Layout noPadding gap="XS">
          <div class="column">
            <div />
            <Label size="L">Column</Label>
            <Label size="L">Label</Label>
            <div />
            <div />
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
                  <Icon name="DragHandle" size="XL" />
                </div>
                <Select
                  bind:value={column.name}
                  placeholder="Column"
                  options={getRemainingColumnOptions(column.name)}
                  on:change={e => (column.displayName = e.detail)}
                />
                <Input bind:value={column.displayName} placeholder="Label" />
                {#if allowCellEditing}
                  <CellEditor bind:column />
                {/if}
                <Icon
                  name="Close"
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
              By default, all columns will automatically be shown.
              <br />
              You can manually control which columns are included by adding them
              below.
            </Body>
          </div>
        </div>
      {/if}
      <div class="column">
        <div class="buttons wide">
          <Button secondary icon="Add" on:click={addColumn}>Add column</Button>
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
