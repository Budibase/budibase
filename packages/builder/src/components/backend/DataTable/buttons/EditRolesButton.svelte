<script>
  import { Button, Modal } from "@budibase/bbui"
  import EditRolesModal from "../modals/EditRoles.svelte"

  let modal
</script>

<div>
  <Button secondary icon="UsersLock" on:click on:click={modal.show}>
    Edit roles
  </Button>
</div>
<Modal bind:this={modal} on:show on:hide>
  <EditRolesModal />
</Modal>
