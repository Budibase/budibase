<script>
  import { Button, Heading, Body, Layout, Modal } from "@budibase/bbui"
  import CreateTableModal from "components/backend/TableNavigator/modals/CreateTableModal.svelte"

  let modal
</script>

<Modal bind:this={modal}>
  <CreateTableModal />
</Modal>

<Layout>
  <Heading>Budibase Internal DB</Heading>

  <div>
    <Button cta on:click={modal.show}>Create new table</Button>
  </div>
</Layout>
