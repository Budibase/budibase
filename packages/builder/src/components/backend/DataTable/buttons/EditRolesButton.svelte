<script>
  import { Button, Modal } from "@budibase/bbui"
  import EditRolesModal from "../modals/EditRoles.svelte"

  let modal
</script>

<div>
  <Button icon="UsersLock" primary size="S" quiet on:click={modal.show}>
    Edit Roles
  </Button>
</div>
<Modal bind:this={modal}>
  <EditRolesModal />
</Modal>
