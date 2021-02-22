<script>
  import { backendUiStore, store, allScreens } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Input } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let query

  let anchor
  let dropdown
  let confirmDeleteDialog
  let error = ""
  let willBeDeleted

  function hideEditor() {
    dropdown?.hide()
  }

  function showModal() {
    hideEditor()
    confirmDeleteDialog.show()
  }

  async function deleteQuery() {
    await backendUiStore.actions.queries.delete(query)
    notifier.success("Query deleted")
    hideEditor()
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
        on:click={showModal}
        data-cy="delete-datasource" />
    </DropdownContainer>
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Query"
  onOk={deleteQuery}
  title="Confirm Deletion">
  Are you sure you wish to delete this query? This action cannot be undone.
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

  .actions {
    padding: var(--spacing-xl);
    display: grid;
    grid-gap: var(--spacing-xl);
    min-width: 400px;
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
