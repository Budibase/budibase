<script>
  import { getContext, onMount, tick } from "svelte"
  import { canBeSortColumn, canBeDisplayColumn } from "@budibase/frontend-core"
  import { Icon, Menu, MenuItem, Modal } from "@budibase/bbui"
  import GridCell from "./GridCell.svelte"
  import { getColumnIcon } from "../../../utils/schema"
  import MigrationModal from "../controls/MigrationModal.svelte"
  import { debounce } from "../../../utils/utils"
  import { FieldType, FormulaType, SortOrder } from "@budibase/types"
  import { TableNames } from "../../../constants"
  import GridPopover from "../overlays/GridPopover.svelte"

  export let column
  export let idx

  const {
    reorder,
    isReordering,
    isResizing,
    sort,
    scrollableColumns,
    dispatch,
    subscribe,
    config,
    ui,
    definition,
    datasource,
    schema,
    focusedCellId,
    filter,
    inlineFilters,
    keyboardBlocked,
  } = getContext("grid")

  const searchableTypes = [
    FieldType.STRING,
    FieldType.OPTIONS,
    FieldType.NUMBER,
    FieldType.BIGINT,
    FieldType.ARRAY,
    FieldType.LONGFORM,
  ]

  let anchor
  let open = false
  let editIsOpen = false
  let timeout
  let migrationModal
  let searchValue
  let input

  $: sortedBy = column.name === $sort.column
  $: canMoveLeft = orderable && idx > 0
  $: canMoveRight = orderable && idx < $scrollableColumns.length - 1
  $: sortingLabels = getSortingLabels(column)
  $: searchable = isColumnSearchable(column)
  $: resetSearchValue(column.name)
  $: searching = searchValue != null
  $: debouncedUpdateFilter(searchValue)
  $: orderable = !column.primaryDisplay
  $: editable = $config.canEditColumns && !column.schema.disabled
  $: keyboardBlocked.set(open)

  const close = () => {
    open = false
    editIsOpen = false
  }

  const getSortingLabels = column => {
    if (column.calculationType) {
      return {
        ascending: "low-high",
        descending: "high-low",
      }
    }
    switch (column?.schema?.type) {
      case FieldType.NUMBER:
      case FieldType.BIGINT:
        return {
          ascending: "low-high",
          descending: "high-low",
        }
      case FieldType.DATETIME:
        return {
          ascending: "old-new",
          descending: "new-old",
        }
      default:
        return {
          ascending: "A-Z",
          descending: "Z-A",
        }
    }
  }

  const resetSearchValue = name => {
    searchValue = $inlineFilters?.find(x => x.id === `inline-${name}`)?.value
  }

  const isColumnSearchable = col => {
    const { type, formulaType } = col.schema
    return (
      searchableTypes.includes(type) ||
      (type === FieldType.FORMULA && formulaType === FormulaType.STATIC) ||
      type === FieldType.AI
    )
  }

  const editColumn = async () => {
    editIsOpen = true
    await tick()
    dispatch("edit-column", column.schema)
  }

  const onMouseDown = e => {
    ui.actions.blur()
    if ((e.touches?.length || e.button === 0) && orderable) {
      timeout = setTimeout(() => {
        reorder.actions.startReordering(column.name, e)
      }, 200)
    }
  }

  const onMouseUp = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  const onContextMenu = e => {
    e.preventDefault()

    // The timeout allows time for clickoutside to close other open popvers
    // before we show this one. Without the timeout, this popover closes again
    // before it's even visible as clickoutside closes it.
    setTimeout(() => {
      ui.actions.blur()
      open = !open
    }, 10)
  }

  const sortAscending = () => {
    sort.set({
      column: column.name,
      order: SortOrder.ASCENDING,
    })
    open = false
  }

  const sortDescending = () => {
    sort.set({
      column: column.name,
      order: SortOrder.DESCENDING,
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
    datasource.actions.changePrimaryDisplay(column.name)
    open = false
  }

  const hideColumn = () => {
    const { related } = column
    const mutation = { visible: false }
    if (!related) {
      datasource.actions.addSchemaMutation(column.name, mutation)
    } else {
      datasource.actions.addSubSchemaMutation(
        related.subField,
        related.field,
        mutation
      )
    }
    datasource.actions.saveSchemaMutations()
    open = false
  }

  const duplicateColumn = async () => {
    open = false

    // Generate new name
    let newName = `${column.name} copy`
    let attempts = 2
    while ($schema[newName]) {
      newName = `${column.name} copy ${attempts++}`
    }

    // Save schema with new column
    const existingColumnDefinition = $schema[column.name]
    await datasource.actions.saveDefinition({
      ...$definition,
      schema: {
        ...$schema,
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

  const openMigrationModal = () => {
    migrationModal.show()
    open = false
  }

  const startSearching = async () => {
    $focusedCellId = null
    searchValue = ""
    await tick()
    input?.focus()
  }

  const onInputKeyDown = e => {
    if (e.key === "Enter") {
      updateFilter()
    } else if (e.key === "Escape") {
      input?.blur()
    }
  }

  const stopSearching = () => {
    searchValue = null
    updateFilter()
  }

  const onBlurInput = () => {
    if (searchValue === "") {
      searchValue = null
    }
    updateFilter()
  }

  const updateFilter = () => {
    filter.actions.addInlineFilter(column, searchValue)
  }
  const debouncedUpdateFilter = debounce(updateFilter, 250)

  const handleDoubleClick = () => {
    if (!editable || searching) {
      return
    }
    open = true
    editColumn()
  }

  onMount(() => subscribe("close-edit-column", close))
</script>

<Modal bind:this={migrationModal}>
  <MigrationModal {column} />
</Modal>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:this={anchor}
  class="header-cell"
  style="flex: 0 0 {column.width}px;"
  class:open
  class:searchable
  class:searching
  class:disabled={$isReordering || $isResizing}
  class:sticky={idx === "sticky"}
  on:dblclick={handleDoubleClick}
>
  <GridCell
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:touchstart={onMouseDown}
    on:touchend={onMouseUp}
    on:touchcancel={onMouseUp}
    on:contextmenu={onContextMenu}
    width={column.width}
    left={column.__left}
    defaultHeight
    center
  >
    {#if searching}
      <input
        bind:this={input}
        type="text"
        bind:value={searchValue}
        on:blur={onBlurInput}
        on:click={() => focusedCellId.set(null)}
        on:keydown={onInputKeyDown}
        data-grid-ignore
      />
    {/if}

    <div class="column-icon">
      <Icon size="S" name={getColumnIcon(column)} />
    </div>
    <div class="search-icon" on:click={startSearching}>
      <Icon hoverable size="S" name="Search" />
    </div>

    <div class="name">
      {column.label}
    </div>

    {#if searching}
      <div class="clear-icon" on:click={stopSearching}>
        <Icon hoverable size="S" name="Close" />
      </div>
    {:else}
      {#if sortedBy}
        <div class="sort-indicator">
          <Icon
            hoverable
            size="S"
            name={$sort.order === SortOrder.DESCENDING
              ? "SortOrderDown"
              : "SortOrderUp"}
          />
        </div>
      {/if}
      <div class="more-icon" on:click={() => (open = true)}>
        <Icon hoverable size="S" name="MoreVertical" />
      </div>
    {/if}
  </GridCell>
</div>

{#if open}
  <GridPopover
    {anchor}
    align="left"
    on:close={close}
    maxHeight={null}
    resizable
  >
    {#if editIsOpen}
      <div class="content">
        <slot />
      </div>
    {:else}
      <Menu>
        <MenuItem icon="Edit" on:click={editColumn} disabled={!editable}>
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
          disabled={column.primaryDisplay || !canBeDisplayColumn(column.schema)}
        >
          Use as display column
        </MenuItem>
        <MenuItem
          icon="SortOrderUp"
          on:click={sortAscending}
          disabled={!canBeSortColumn(column.schema) ||
            (column.name === $sort.column &&
              $sort.order === SortOrder.ASCENDING)}
        >
          Sort {sortingLabels.ascending}
        </MenuItem>
        <MenuItem
          icon="SortOrderDown"
          on:click={sortDescending}
          disabled={!canBeSortColumn(column.schema) ||
            (column.name === $sort.column &&
              $sort.order === SortOrder.DESCENDING)}
        >
          Sort {sortingLabels.descending}
        </MenuItem>
        <MenuItem
          disabled={!canMoveLeft}
          icon="ChevronLeft"
          on:click={moveLeft}
        >
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
          disabled={column.primaryDisplay || !$config.showControls}
          icon="VisibilityOff"
          on:click={hideColumn}
        >
          Hide column
        </MenuItem>
        {#if $config.canEditColumns && column.schema.type === "link" && column.schema.tableId === TableNames.USERS && !column.schema.autocolumn}
          <MenuItem icon="User" on:click={openMigrationModal}>
            Migrate to user column
          </MenuItem>
        {/if}
      </Menu>
    {/if}
  </GridPopover>
{/if}

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

  /* Icon colors */
  .header-cell :global(.spectrum-Icon) {
    color: var(--spectrum-global-color-gray-600);
  }
  .header-cell :global(.spectrum-Icon.hoverable:hover) {
    color: var(--spectrum-global-color-gray-800) !important;
    cursor: pointer;
  }

  /* Search icon */
  .search-icon {
    display: none;
  }
  .header-cell.searchable:not(.open):hover .search-icon,
  .header-cell.searchable.searching .search-icon {
    display: block;
  }
  .header-cell.searchable:not(.open):hover .column-icon,
  .header-cell.searchable.searching .column-icon {
    display: none;
  }

  /* Main center content */
  .name {
    flex: 1 1 auto;
    width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .header-cell.searching .name {
    opacity: 0;
    pointer-events: none;
  }
  input {
    display: none;
    font-family: var(--font-sans);
    outline: none;
    border: 1px solid transparent;
    background: transparent;
    color: var(--spectrum-global-color-gray-800);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0 30px;
    border-radius: 2px;
  }
  input:focus {
    border: 1px solid var(--accent-color);
  }
  input:not(:focus) {
    background: var(--spectrum-global-color-gray-200);
  }
  .header-cell.searching input {
    display: block;
  }

  /* Right icons */
  .more-icon {
    display: none;
    padding: 4px;
    margin: 0 -4px;
  }
  .header-cell.open .more-icon,
  .header-cell:hover .more-icon {
    display: block;
  }
  .header-cell.open .sort-indicator,
  .header-cell:hover .sort-indicator {
    display: none;
  }

  .content {
    width: 360px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: var(--spectrum-alias-background-color-secondary);
  }
</style>
