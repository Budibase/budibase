<script>
  import { Button, Modal } from "@budibase/bbui"
  import EditRolesModal from "../modals/EditRoles.svelte"
  import { _ as t } from "svelte-i18n"

  let modal
</script>

<div>
  <Button icon="UsersLock" primary size="S" quiet on:click={modal.show}>
    { $t('edit-roles-0') }
  </Button>
</div>
<Modal bind:this={modal}>
  <EditRolesModal />
</Modal>
