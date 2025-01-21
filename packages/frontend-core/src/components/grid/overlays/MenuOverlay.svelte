<script>
  import { Menu, MenuItem, Helpers } from "@budibase/bbui"
  import { FieldType } from "@budibase/types"
  import { getContext } from "svelte"
  import { NewRowID } from "../lib/constants"
  import GridPopover from "./GridPopover.svelte"
  import { getCellID } from "../lib/utils"

  const {
    focusedRow,
    menu,
    rows,
    config,
    dispatch,
    focusedRowId,
    notifications,
    hasBudibaseIdentifiers,
    selectedRowCount,
    copyAllowed,
    pasteAllowed,
    selectedCellCount,
    visibleColumns,
    selectedCells,
  } = getContext("grid")

  let anchor

  $: style = makeStyle($menu)
  $: isNewRow = $focusedRowId === NewRowID
  $: hasAIColumns = $visibleColumns.some(
    col => col.schema.type === FieldType.AI
  )

  const makeStyle = menu => {
    return `left:${menu.left}px; top:${menu.top}px;`
  }

  const deleteRow = () => {
    menu.actions.close()
    rows.actions.deleteRows([$focusedRow])
    $notifications.success("Deleted 1 row")
  }

  const duplicateRow = async () => {
    menu.actions.close()
    const newRow = await rows.actions.duplicateRow($focusedRow)
    if (newRow) {
      const firstCol = $visibleColumns[0]
      const lastCol = $visibleColumns[$visibleColumns.length - 1]
      const startCellId = getCellID(newRow._id, firstCol.name)
      const endCellId = getCellID(newRow._id, lastCol.name)
      selectedCells.actions.selectRange(startCellId, endCellId)
    }
  }

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    $notifications.success("Copied to clipboard")
  }

  const generateAIColumns = async () => {
    menu.actions.close()
    await rows.actions.applyRowChanges({ rowId: $focusedRowId })
    $notifications.success("Generated AI columns")
  }
</script>

<div bind:this={anchor} {style} class="menu-anchor" />

{#if $menu.visible}
  {#key style}
    <GridPopover {anchor} on:close={menu.actions.close} maxHeight={null}>
      <Menu>
        {#if $menu.multiRowMode}
          <MenuItem
            icon="Duplicate"
            disabled={!$config.canAddRows || $selectedRowCount > 50}
            on:click={() => dispatch("request-bulk-duplicate")}
            on:click={menu.actions.close}
          >
            Duplicate {$selectedRowCount} rows
          </MenuItem>
          <MenuItem
            icon="Delete"
            disabled={!$config.canDeleteRows}
            on:click={() => dispatch("request-bulk-delete")}
            on:click={menu.actions.close}
          >
            Delete {$selectedRowCount} rows
          </MenuItem>
        {:else if $menu.multiCellMode}
          <MenuItem
            icon="Copy"
            disabled={!$copyAllowed}
            on:click={() => dispatch("copy")}
            on:click={menu.actions.close}
          >
            Copy
          </MenuItem>
          <MenuItem
            icon="Paste"
            disabled={!$pasteAllowed}
            on:click={() => dispatch("paste")}
            on:click={menu.actions.close}
          >
            Paste
          </MenuItem>
          <MenuItem
            icon="Delete"
            disabled={!$config.canEditRows}
            on:click={() => dispatch("request-bulk-delete")}
          >
            Delete {$selectedCellCount} cells
          </MenuItem>
        {:else}
          <MenuItem
            icon="Copy"
            disabled={!$copyAllowed}
            on:click={() => dispatch("copy")}
            on:click={menu.actions.close}
          >
            Copy
          </MenuItem>
          <MenuItem
            icon="Paste"
            disabled={!$pasteAllowed}
            on:click={() => dispatch("paste")}
            on:click={menu.actions.close}
          >
            Paste
          </MenuItem>
          <MenuItem
            icon="Maximize"
            disabled={isNewRow ||
              !$config.canEditRows ||
              !$config.canExpandRows}
            on:click={() => dispatch("edit-row", $focusedRow)}
            on:click={menu.actions.close}
          >
            Edit row in modal
          </MenuItem>
          <MenuItem
            icon="Copy"
            disabled={isNewRow || !$focusedRow?._id || !$hasBudibaseIdentifiers}
            on:click={() => copyToClipboard($focusedRow?._id)}
            on:click={menu.actions.close}
          >
            Copy row _id
          </MenuItem>
          <MenuItem
            icon="Copy"
            disabled={isNewRow ||
              !$focusedRow?._rev ||
              !$hasBudibaseIdentifiers}
            on:click={() => copyToClipboard($focusedRow?._rev)}
            on:click={menu.actions.close}
          >
            Copy row _rev
          </MenuItem>
          <MenuItem
            icon="Duplicate"
            disabled={isNewRow || !$config.canAddRows}
            on:click={duplicateRow}
          >
            Duplicate row
          </MenuItem>
          <MenuItem
            icon="Delete"
            disabled={isNewRow || !$config.canDeleteRows}
            on:click={deleteRow}
          >
            Delete row
          </MenuItem>
          {#if $config.aiEnabled}
            <MenuItem
              icon="MagicWand"
              disabled={isNewRow || !hasAIColumns}
              on:click={generateAIColumns}
            >
              Generate AI Columns
            </MenuItem>
          {/if}
        {/if}
      </Menu>
    </GridPopover>
  {/key}
{/if}

<style>
  .menu-anchor {
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }
</style>
