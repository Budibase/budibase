<script>
  import { TextButton as Button, Modal } from "@budibase/bbui"
  import EditRolesModal from "../modals/EditRoles.svelte"

  let modal
</script>

<div>
  <Button text small on:click={modal.show}>
    <i class="ri-lock-line" />
    Edit Roles
  </Button>
</div>
<Modal bind:this={modal}>
  <EditRolesModal />
</Modal>

<style>
  i {
    margin-right: var(--spacing-xs);
    font-size: var(--font-size-s);
  }
</style>
