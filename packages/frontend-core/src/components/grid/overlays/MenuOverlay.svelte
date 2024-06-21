<script>
  import { Menu, MenuItem, Helpers } from "@budibase/bbui"
  import { getContext } from "svelte"
  import { NewRowID } from "../lib/constants"
  import GridPopover from "./GridPopover.svelte"
  import { getCellID } from "../lib/utils"

  const {
    focusedRow,
    menu,
    rows,
    columns,
    focusedCellId,
    stickyColumn,
    config,
    copiedCell,
    clipboard,
    dispatch,
    focusedCellAPI,
    focusedRowId,
    notifications,
    hasBudibaseIdentifiers,
    selectedRowCount,
  } = getContext("grid")

  let anchor

  $: style = makeStyle($menu)
  $: isNewRow = $focusedRowId === NewRowID

  const makeStyle = menu => {
    return `left:${menu.left}px; top:${menu.top}px;`
  }

  const deleteRow = () => {
    rows.actions.deleteRows([$focusedRow])
    menu.actions.close()
    $notifications.success("Deleted 1 row")
  }

  const bulkDelete = () => {
    dispatch("request-bulk-delete")
  }

  const duplicate = async () => {
    menu.actions.close()
    const newRow = await rows.actions.duplicateRow($focusedRow)
    if (newRow) {
      const column = $stickyColumn?.name || $columns[0].name
      $focusedCellId = getCellID(newRow._id, column)
    }
  }

  const bulkDuplicate = () => {
    dispatch("request-bulk-duplicate")
  }

  const copyToClipboard = async value => {
    await Helpers.copyToClipboard(value)
    $notifications.success("Copied to clipboard")
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
            on:click={bulkDuplicate}
          >
            Duplicate {$selectedRowCount} rows
          </MenuItem>
          <MenuItem
            icon="Delete"
            disabled={!$config.canDeleteRows}
            on:click={bulkDelete}
          >
            Delete {$selectedRowCount} rows
          </MenuItem>
        {:else if $menu.multiCellMode}
          <MenuItem
            icon="Copy"
            on:click={clipboard.actions.copy}
            on:click={menu.actions.close}
          >
            Copy
          </MenuItem>
          <MenuItem
            icon="Paste"
            disabled={$copiedCell == null || $focusedCellAPI?.isReadonly()}
            on:click={clipboard.actions.paste}
            on:click={menu.actions.close}
          >
            Paste
          </MenuItem>
          <MenuItem icon="Delete" disabled={isNewRow} on:click={() => {}}>
            Delete
          </MenuItem>
        {:else}
          <MenuItem
            icon="Copy"
            on:click={clipboard.actions.copy}
            on:click={menu.actions.close}
          >
            Copy
          </MenuItem>
          <MenuItem
            icon="Paste"
            disabled={$copiedCell == null || $focusedCellAPI?.isReadonly()}
            on:click={clipboard.actions.paste}
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
            on:click={duplicate}
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
