<script>
  import { Body, Button, Drawer, DrawerContent, Table } from "@budibase/bbui"
  import UpsertRowActionDrawer from "./UpsertRowActionDrawer.svelte"

  export let tableId
  export let rowActions
  export let drawer

  let upsertDrawer
  let rowAction

  function addNewAction() {
    upsertDrawer.show()
  }

  function closeAllDrawers() {
    upsertDrawer.hide()
  }

  const actionSchema = {
    name: {
      type: "string",
      fieldName: "name",
    },
  }

  function editRowAction(action) {
    rowAction = action
    upsertDrawer.show()
  }

  function onRowActionDrawerHide() {
    rowAction = undefined
  }
</script>

<Drawer
  bind:this={drawer}
  title={"Row actions"}
  forceModal
  on:drawerHide={closeAllDrawers}
  on:drawerShow
  on:drawerHide
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
      <Table
        data={rowActions}
        schema={actionSchema}
        on:editrow={e => editRowAction(e.detail)}
        on:click={e => editRowAction(e.detail)}
      />
    {/if}
  </DrawerContent>
</Drawer>

<UpsertRowActionDrawer
  bind:drawer={upsertDrawer}
  {tableId}
  {rowAction}
  on:drawerHide={onRowActionDrawerHide}
/>
