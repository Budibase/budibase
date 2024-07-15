<script>
  import { Body, Button, Drawer, DrawerContent, Table } from "@budibase/bbui"
  import { rowActions as rowActionsStore } from "stores/builder"
  import UpsertRowActionDrawer from "./UpsertRowActionDrawer.svelte"
  import ConfirmDialog from "../ConfirmDialog.svelte"

  export let tableId
  export let rowActions
  export let drawer

  let upsertDrawer
  let modal
  let rowAction

  let selectedRowActions

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

  async function deleteRowActions() {
    await rowActionsStore.delete(
      tableId,
      selectedRowActions?.map(a => a.id)
    )
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
      <div class="delete-button">
        <div>
          <Button
            icon="Delete"
            warning
            quiet
            on:click={modal.show}
            disabled={!selectedRowActions?.length}
          >
            Delete
            {selectedRowActions?.length}
            row actions
          </Button>
        </div>
      </div>
      <ConfirmDialog
        bind:this={modal}
        okText="Delete"
        onOk={deleteRowActions}
        title="Confirm Deletion"
      >
        Are you sure you want to delete
        {selectedRowActions?.length}
        row actions?
      </ConfirmDialog>
      <Table
        data={rowActions}
        schema={actionSchema}
        allowEditColumns={false}
        allowEditRows={false}
        allowSelectRows
        rowIdProp="id"
        bind:selectedRows={selectedRowActions}
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

<style>
  .delete-button {
    display: flex;
  }
  .delete-button > * {
    margin-left: auto;
  }
</style>
