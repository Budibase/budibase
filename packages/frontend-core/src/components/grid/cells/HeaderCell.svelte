<script>
  import { getContext, onMount, tick } from "svelte"
  import { canBeDisplayColumn } from "@budibase/shared-core"
  import { Icon, Popover, Menu, MenuItem, clickOutside } from "@budibase/bbui"
  import GridCell from "./GridCell.svelte"
  import { getColumnIcon } from "../lib/utils"

  export let column
  export let idx
  export let orderable = true

  const {
    reorder,
    isReordering,
    isResizing,
    rand,
    sort,
    renderedColumns,
    dispatch,
    subscribe,
    config,
    ui,
    columns,
    definition,
    datasource,
  } = getContext("grid")

  let anchor
  let open = false
  let editIsOpen = false
  let timeout
  let popover

  $: sortedBy = column.name === $sort.column
  $: canMoveLeft = orderable && idx > 0
  $: canMoveRight = orderable && idx < $renderedColumns.length - 1
  $: ascendingLabel = ["number", "bigint"].includes(column.schema?.type)
    ? "low-high"
    : "A-Z"
  $: descendingLabel = ["number", "bigint"].includes(column.schema?.type)
    ? "high-low"
    : "Z-A"

  const editColumn = async () => {
    editIsOpen = true
    await tick()
    dispatch("edit-column", column.schema)
  }

  const cancelEdit = () => {
    popover.hide()
    editIsOpen = false
  }

  const onMouseDown = e => {
    if (e.button === 0 && orderable) {
      timeout = setTimeout(() => {
        reorder.actions.startReordering(column.name, e)
      }, 200)
    }
  }

  const onMouseUp = e => {
    if (e.button === 0 && orderable) {
      clearTimeout(timeout)
    }
  }

  const onContextMenu = e => {
    e.preventDefault()
    ui.actions.blur()
    open = !open
  }

  const sortAscending = () => {
    sort.set({
      column: column.name,
      order: "ascending",
    })
    open = false
  }

  const sortDescending = () => {
    sort.set({
      column: column.name,
      order: "descending",
    })
    open = false
  }

  const moveLeft = () => {
    reorder.actions.moveColumnLeft(column.name)
    open = false
  }

  const moveRight = () => {
    reorder.actions.moveColumnRight(column.name)
    open = false
  }

  const makeDisplayColumn = () => {
    columns.actions.changePrimaryDisplay(column.name)
    open = false
  }

  const hideColumn = () => {
    columns.update(state => {
      const index = state.findIndex(col => col.name === column.name)
      state[index].visible = false
      return state.slice()
    })
    columns.actions.saveChanges()
    open = false
  }

  const duplicateColumn = async () => {
    open = false

    // Generate new name
    let newName = `${column.name} copy`
    let attempts = 2
    while ($definition.schema[newName]) {
      newName = `${column.name} copy ${attempts++}`
    }

    // Save schema with new column
    const existingColumnDefinition = $definition.schema[column.name]
    await datasource.actions.saveDefinition({
      ...$definition,
      schema: {
        ...$definition.schema,
        [newName]: {
          ...existingColumnDefinition,
          name: newName,
          schema: {
            ...existingColumnDefinition.schema,
          },
        },
      },
    })
  }

  onMount(() => subscribe("close-edit-column", cancelEdit))
</script>

<div
  class="header-cell"
  class:open
  style="flex: 0 0 {column.width}px;"
  bind:this={anchor}
  class:disabled={$isReordering || $isResizing}
  class:sticky={idx === "sticky"}
>
  <GridCell
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:contextmenu={onContextMenu}
    width={column.width}
    left={column.left}
    defaultHeight
    center
  >
    <Icon
      size="S"
      name={getColumnIcon(column)}
      color={`var(--spectrum-global-color-gray-600)`}
    />
    <div class="name">
      {column.label}
    </div>
    {#if sortedBy}
      <div class="sort-indicator">
        <Icon
          size="S"
          name={$sort.order === "descending" ? "SortOrderDown" : "SortOrderUp"}
          color="var(--spectrum-global-color-gray-600)"
        />
      </div>
    {/if}
    <div class="more" on:click={() => (open = true)}>
      <Icon
        size="S"
        name="MoreVertical"
        color="var(--spectrum-global-color-gray-600)"
      />
    </div>
  </GridCell>
</div>

<Popover
  bind:open
  bind:this={popover}
  {anchor}
  align="right"
  offset={0}
  popoverTarget={document.getElementById(`grid-${rand}`)}
  customZindex={100}
>
  {#if editIsOpen}
    <div
      use:clickOutside={() => {
        editIsOpen = false
      }}
      class="content"
    >
      <slot />
    </div>
  {:else}
    <Menu>
      <MenuItem
        icon="Edit"
        on:click={editColumn}
        disabled={!$config.canEditColumns || column.schema.disabled}
      >
        Edit column
      </MenuItem>
      <MenuItem
        icon="Duplicate"
        on:click={duplicateColumn}
        disabled={!$config.canEditColumns}
      >
        Duplicate column
      </MenuItem>
      <MenuItem
        icon="Label"
        on:click={makeDisplayColumn}
        disabled={idx === "sticky" || !canBeDisplayColumn(column.schema.type)}
      >
        Use as display column
      </MenuItem>
      <MenuItem
        icon="SortOrderUp"
        on:click={sortAscending}
        disabled={column.name === $sort.column && $sort.order === "ascending"}
      >
        Sort {ascendingLabel}
      </MenuItem>
      <MenuItem
        icon="SortOrderDown"
        on:click={sortDescending}
        disabled={column.name === $sort.column && $sort.order === "descending"}
      >
        Sort {descendingLabel}
      </MenuItem>
      <MenuItem disabled={!canMoveLeft} icon="ChevronLeft" on:click={moveLeft}>
        Move left
      </MenuItem>
      <MenuItem
        disabled={!canMoveRight}
        icon="ChevronRight"
        on:click={moveRight}
      >
        Move right
      </MenuItem>
      <MenuItem
        disabled={idx === "sticky" || !$config.showControls}
        icon="VisibilityOff"
        on:click={hideColumn}
      >
        Hide column
      </MenuItem>
    </Menu>
  {/if}
</Popover>

<style>
  .header-cell {
    display: flex;
  }
  .header-cell:not(.sticky):hover,
  .header-cell:not(.sticky) :global(.cell:hover) {
    cursor: grab;
  }
  .header-cell.disabled {
    pointer-events: none;
  }
  .header-cell :global(.cell) {
    padding: 0 var(--cell-padding);
    gap: calc(2 * var(--cell-spacing));
    background: var(--grid-background-alt);
  }

  .name {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .more {
    display: none;
    padding: 4px;
    margin: 0 -4px;
  }
  .header-cell.open .more,
  .header-cell:hover .more {
    display: block;
  }
  .more:hover {
    cursor: pointer;
  }
  .more:hover :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-800) !important;
  }

  .header-cell.open .sort-indicator,
  .header-cell:hover .sort-indicator {
    display: none;
  }

  .content {
    width: 300px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: var(--spectrum-alias-background-color-secondary);
  }
</style>
