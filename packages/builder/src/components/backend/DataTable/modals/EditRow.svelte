<script>
  import { Modal, Button } from "@budibase/bbui"
  import CreateEditRow from "../modals/CreateEditRow.svelte"
  import { _ as t } from "svelte-i18n"

  export let row
  export let modalContentComponent = CreateEditRow

  let modal

  function showModal(e) {
    e.stopPropagation()
    modal.show()
  }
</script>

<Button data-cy="edit-row" secondary small on:click={showModal}
  >{$t("edit")}</Button
>
<Modal bind:this={modal}>
  <svelte:component this={modalContentComponent} {row} />
</Modal>
