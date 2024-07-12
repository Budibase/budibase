<script>
  import { Body, Button, Drawer, DrawerContent, Table } from "@budibase/bbui"
  import UpsertRowActionDrawer from "./UpsertRowActionDrawer.svelte"

  export let rowActions
  export let drawer
  let upsertDrawer

  function addNewAction() {
    upsertDrawer.show()
  }

  function closeAllDrawers() {
    upsertDrawer.hide()
  }

  async function saveAction() {
    alert("TODO")
  }
</script>

<Drawer
  bind:this={drawer}
  title={"Row actions"}
  forceModal
  on:drawerHide={closeAllDrawers}
>
  <div slot="buttons">
    <Button cta on:click={addNewAction}>Add new</Button>
  </div>
  <DrawerContent
    slot="body"
    title="Row actions"
    showConfirmButton={false}
    showCancelButton={false}
  >
    {#if !rowActions.length}
      <Body size="S">No row actions are created for this table.</Body>
    {:else}
      <Table />
    {/if}
  </DrawerContent>
</Drawer>

<UpsertRowActionDrawer bind:drawer={upsertDrawer} saveDelegate={saveAction} />
