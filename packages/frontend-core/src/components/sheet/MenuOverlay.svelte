<script>
  import {
    clickOutside,
    Menu,
    MenuItem,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import { getContext } from "svelte"

  const { selectedCellRow, menu, rows, columns, selectedCellId } =
    getContext("sheet")

  let modal

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
      $selectedCellId = `${newRow._id}-${$columns[0].name}`
      menu.actions.close()
    }
  }
</script>

{#if $menu.visible}
  <div class="menu" {style} use:clickOutside={() => menu.actions.close()}>
    <Menu>
      <MenuItem icon="Delete" on:click={modal.show}>Delete row</MenuItem>
      <MenuItem icon="Duplicate" on:click={duplicate}>Duplicate row</MenuItem>
    </Menu>
  </div>
{/if}

<Modal bind:this={modal}>
  <ModalContent
    title="Delete row"
    confirmText="Continue"
    cancelText="Cancel"
    onConfirm={deleteRow}
    size="M"
  >
    Are you sure you want to delete this row?
  </ModalContent>
</Modal>

<style>
  .menu {
    position: absolute;
    background: var(--cell-background);
    border: var(--cell-border);
    width: 160px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
</style>
