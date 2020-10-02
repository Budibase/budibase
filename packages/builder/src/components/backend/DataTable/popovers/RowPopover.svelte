<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Icon } from "@budibase/bbui"
  import CreateEditRecordModal from "../modals/CreateEditRecordModal.svelte"
  import * as api from "../api"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { Modal } from "components/common/Modal"

  export let row

  let anchor
  let dropdown
  let confirmDeleteDialog
  let modal

  function showModal() {
    dropdown.hide()
    modal.show()
  }

  function showDelete() {
    dropdown.hide()
    confirmDeleteDialog.show()
  }

  async function deleteRow() {
    await api.deleteRecord(row)
    notifier.success("Record deleted")
    backendUiStore.actions.records.delete(row)
  }
</script>

<div bind:this={anchor} on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <ul>
    <li data-cy="edit-row" on:click={showModal}>
      <Icon name="edit" />
      <span>Edit</span>
    </li>
    <li data-cy="delete-row" on:click={showDelete}>
      <Icon name="delete" />
      <span>Delete</span>
    </li>
  </ul>
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this row? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Row"
  onOk={deleteRow}
  title="Confirm Delete" />
<Modal bind:this={modal}>
  <CreateEditRecordModal record={row} />
</Modal>

<style>
  .ri-more-line:hover {
    cursor: pointer;
  }

  h5 {
    padding: var(--spacing-xl) 0 0 var(--spacing-xl);
    margin: 0;
    font-weight: 500;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    padding: var(--spacing-s) 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
    font-size: var(--font-size-xs);
  }

  li:hover {
    background-color: var(--grey-2);
  }

  li:active {
    color: var(--blue);
  }
</style>
