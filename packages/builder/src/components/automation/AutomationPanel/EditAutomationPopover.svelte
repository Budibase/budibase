<script>    
  import { goto } from "@sveltech/routify"
  import { automationStore, backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu } from "@budibase/bbui"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let automation

  let anchor
  let dropdown
  let confirmDeleteDialog
  $: instanceId = $backendUiStore.selectedDatabase._id

  function showModal() {
    dropdown.hide()
    confirmDeleteDialog.show()
  }

  async function deleteAutomation() {
    await automationStore.actions.delete({
      instanceId,
      automation,
    })
    notifier.success("Automation deleted.")
    $goto('../automate')
  }
</script>

<div on:click|stopPropagation>
  <div bind:this={anchor} class="icon" on:click={dropdown.show}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu align="left" {anchor} bind:this={dropdown}>
    <DropdownContainer>
      <DropdownItem
        icon="ri-delete-bin-line"
        title="Delete"
        on:click={showModal} />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Automation"
  onOk={deleteAutomation}
  title="Confirm Deletion">
  Are you sure you wish to delete the automation
  <i>{automation.name}?</i>
  This action cannot be undone.
</ConfirmDialog>

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  div.icon i {
    font-size: 16px;
  }
</style>
