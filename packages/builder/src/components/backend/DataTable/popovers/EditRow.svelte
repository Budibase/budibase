<script>
  import { getContext } from "svelte"
  import { backendUiStore } from "builderStore"
  import {
    DropdownMenu,
    Button,
    Icon,
    Input,
    Select,
    Heading,
  } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import CreateEditRecordModal from "./CreateEditRecord.svelte"
  import * as api from "../api"
  import { notifier } from "builderStore/store/notifications"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let row

  let anchor
  let dropdown
  let editing
  let confirmDeleteDialog

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
  }

  async function deleteRow() {
    await api.deleteRecord(row)
    notifier.success("Record deleted")
    backendUiStore.actions.records.delete(row)
    hideEditor()
  }
</script>

<div bind:this={anchor} on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  {#if editing}
    <h5>Edit Row</h5>
    <CreateEditRecordModal onClosed={hideEditor} record={row} />
  {:else}
    <ul>
      <li data-cy="edit-row" on:click={showEditor}>
        <Icon name="edit" />
        <span>Edit</span>
      </li>
      <li data-cy="delete-row" on:click={() => confirmDeleteDialog.show()}>
        <Icon name="delete" />
        <span>Delete</span>
      </li>
    </ul>
  {/if}
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this row? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Row"
  onOk={deleteRow}
  title="Confirm Delete" />

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
