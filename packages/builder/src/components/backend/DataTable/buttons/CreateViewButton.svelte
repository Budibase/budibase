<script>
  import { Modal, ActionButton } from "@budibase/bbui"
  import CreateViewModal from "../modals/CreateViewModal.svelte"
  import { _ as t } from "svelte-i18n"

  let modal
</script>

<ActionButton icon="CollectionAdd" size="S" quiet on:click={modal.show}>
  { $t('create-view-1') }
</ActionButton>
<Modal bind:this={modal}>
  <CreateViewModal />
</Modal>
