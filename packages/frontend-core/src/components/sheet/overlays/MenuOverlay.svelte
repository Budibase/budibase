<script>
  import { clickOutside, Menu, MenuItem, notifications } from "@budibase/bbui"
  import { getContext } from "svelte"

  const {
    selectedCellRow,
    menu,
    rows,
    columns,
    selectedCellId,
    stickyColumn,
    config,
  } = getContext("sheet")

  $: style = makeStyle($menu)

  const makeStyle = menu => {
    return `left:${menu.left}px; top:${menu.top}px;`
  }

  const deleteRow = () => {
    rows.actions.deleteRows([$selectedCellRow])
    menu.actions.close()
    notifications.success("Deleted 1 row")
  }

  const duplicate = async () => {
    let clone = { ...$selectedCellRow }
    delete clone._id
    delete clone._rev
    delete clone.__idx
    const newRow = await rows.actions.addRow(clone, $selectedCellRow.__idx + 1)
    if (newRow) {
      const column = $stickyColumn?.name || $columns[0].name
      $selectedCellId = `${newRow._id}-${column}`
      menu.actions.close()
    }
  }
</script>

{#if $menu.visible}
  <div class="menu" {style} use:clickOutside={() => menu.actions.close()}>
    <Menu>
      <MenuItem
        icon="Delete"
        disabled={!$config.allowEditRows}
        on:click={deleteRow}>Delete row</MenuItem
      >
      <MenuItem
        icon="Duplicate"
        disabled={!$config.allowAddRows}
        on:click={duplicate}>Duplicate row</MenuItem
      >
    </Menu>
  </div>
{/if}

<style>
  .menu {
    z-index: 1;
    position: absolute;
    background: var(--cell-background);
    border: var(--cell-border);
    width: 180px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
</style>
