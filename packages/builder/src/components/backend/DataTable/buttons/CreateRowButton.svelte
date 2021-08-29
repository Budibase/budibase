<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import CreateEditRow from "../modals/CreateEditRow.svelte"
  import { _ as t } from "svelte-i18n"

  export let modalContentComponent = CreateEditRow
  export let title = $t('create-row')

  let modal
</script>

<ActionButton icon="TableRowAddBottom" size="S" quiet on:click={modal.show}>
  {title}
</ActionButton>
<Modal bind:this={modal}>
  <svelte:component this={modalContentComponent} />
</Modal>
