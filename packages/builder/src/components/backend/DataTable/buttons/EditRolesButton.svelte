<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import EditRolesModal from "../modals/EditRoles.svelte"

  let modal
</script>

<ActionButton icon="UsersLock" quiet on:click={modal.show}>
  Edit roles
</ActionButton>
<Modal bind:this={modal}>
  <EditRolesModal />
</Modal>
