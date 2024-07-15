<script>
  import { Button, Drawer, Input, Layout } from "@budibase/bbui"
  import { rowActions } from "stores/builder"

  export let tableId
  export let drawer
  export let rowAction

  $: addingNewAction = !rowAction
  $: editableAction = rowAction || {}

  async function saveAction() {
    if (addingNewAction) {
      await rowActions.save(tableId, editableAction)
    } else {
      await rowActions.update(tableId, editableAction)
    }
    drawer.hide()
  }
</script>

<Drawer bind:this={drawer} title={"Add new row action"}>
  <div slot="buttons">
    <Button cta on:click={saveAction}>Save</Button>
  </div>
  <div slot="body">
    <Layout>
      <Input label="Name" bind:value={editableAction.name} />
    </Layout>
  </div>
</Drawer>
