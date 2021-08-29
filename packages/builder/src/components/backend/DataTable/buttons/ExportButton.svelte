<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import ExportModal from "../modals/ExportModal.svelte"
  import { _ as t } from "svelte-i18n"

  export let view

  let modal
</script>

<ActionButton icon="Download" size="S" quiet on:click={modal.show}>
  { $t('export') }
</ActionButton>
<Modal bind:this={modal}>
  <ExportModal {view} />
</Modal>
