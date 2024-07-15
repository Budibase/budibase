<script>
  import { Button, Drawer, Input, Layout } from "@budibase/bbui"
  import { rowActions } from "stores/builder"

  export let tableId
  export let drawer

  let name

  async function saveAction() {
    await rowActions.save(tableId, { name })
    drawer.hide()
  }
</script>

<Drawer bind:this={drawer} title={"Add new row action"}>
  <div slot="buttons">
    <Button cta on:click={saveAction}>Save</Button>
  </div>
  <div slot="body">
    <Layout>
      <Input label="Name" bind:value={name} />
    </Layout>
  </div>
</Drawer>
