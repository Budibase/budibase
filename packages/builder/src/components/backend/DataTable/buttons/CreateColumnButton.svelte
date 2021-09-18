<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import CreateEditColumn from "../modals/CreateEditColumn.svelte"
  import { _ as t } from "svelte-i18n"

  let modal
</script>

<ActionButton icon="TableColumnAddRight" quiet size="S" on:click={modal.show}>
  {$t("create-column")}
</ActionButton>
<Modal bind:this={modal}>
  <CreateEditColumn />
</Modal>
