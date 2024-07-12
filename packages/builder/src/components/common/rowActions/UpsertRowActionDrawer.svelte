<script>
  import { Button, Drawer, Input, Layout } from "@budibase/bbui"

  export let drawer
  export let saveDelegate

  async function saveAction() {
    await saveDelegate()
  }
</script>

<Drawer bind:this={drawer} title={"Add new row action"}>
  <div slot="buttons">
    <Button cta on:click={saveAction}>Save</Button>
  </div>
  <div slot="body">
    <Layout>
      <Input label="Title" />
    </Layout>
  </div>
</Drawer>
