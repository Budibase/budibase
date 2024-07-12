<script>
  import {
    ActionButton,
    Body,
    Button,
    Drawer,
    DrawerContent,
    Table,
  } from "@budibase/bbui"

  export let tableId
  let drawer
  let upsertDrawer

  let rowActions = []

  $: fetchRowActions(tableId)

  async function fetchRowActions(tableId) {
    rowActions = await API.fetchRowActions(tableId)
  }

  async function openDrawer() {
    drawer.show()
  }

  function addNewAction() {
    upsertDrawer.show()
  }

  $: hasRowActions = rowActions > 0
  $: title = "Row actions" + (hasRowActions ? ` (${rowActions.length})` : "")
</script>

<ActionButton icon="JourneyAction" quiet on:click={openDrawer}>
  {title}
</ActionButton>
<Drawer bind:this={drawer} title={"Row actions"}>
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

<Drawer bind:this={upsertDrawer} title={"Add new row action"} />
