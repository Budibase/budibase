<script>
  import { clickOutside, Menu, MenuItem, notifications } from "@budibase/bbui"
  import { getContext } from "svelte"

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
  } = getContext("grid")

  $: style = makeStyle($menu)

  const makeStyle = menu => {
    return `left:${menu.left}px; top:${menu.top}px;`
  }

  const deleteRow = () => {
    rows.actions.deleteRows([$focusedRow])
    menu.actions.close()
    notifications.success("Deleted 1 row")
  }

  const duplicate = async () => {
    menu.actions.close()
    const newRow = await rows.actions.duplicateRow($focusedRow)
    if (newRow) {
      const column = $stickyColumn?.name || $columns[0].name
      $focusedCellId = `${newRow._id}-${column}`
    }
  }
</script>

{#if $menu.visible}
  <div class="menu" {style} use:clickOutside={() => menu.actions.close()}>
    <Menu>
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
        disabled={!$config.allowEditRows}
        on:click={() => dispatch("edit-row", $focusedRow)}
        on:click={menu.actions.close}
      >
        Edit row in modal
      </MenuItem>
      <MenuItem
        icon="Duplicate"
        disabled={!$config.allowAddRows}
        on:click={duplicate}
      >
        Duplicate row
      </MenuItem>
      <MenuItem
        icon="Delete"
        disabled={!$config.allowDeleteRows}
        on:click={deleteRow}
      >
        Delete row
      </MenuItem>
    </Menu>
  </div>
{/if}

<style>
  .menu {
    position: absolute;
    background: var(--cell-background);
    border: 1px solid var(--spectrum-global-color-gray-300);
    width: 180px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.15);
  }
</style>
