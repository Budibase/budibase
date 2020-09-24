<script>
  import { goto } from "@sveltech/routify"
  import { getContext } from "svelte"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let view

  let anchor
  let dropdown
  let editing
  let originalName = view.name
  let confirmDeleteDialog

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
    close()
  }

  async function save() {
    await backendUiStore.actions.views.save({
      originalName,
      ...view,
    })
    notifier.success("View renamed successfully")
    hideEditor()
  }

  async function deleteView() {
    const name = view.name
    const id = view.modelId
    await backendUiStore.actions.views.delete(name)
    notifier.success("View deleted")
    $goto(`./model/${id}`)
  }
</script>

<div bind:this={anchor} class="icon" on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu align="left" {anchor} bind:this={dropdown}>
  {#if editing}
    <div class="container">
      <h5>Edit View</h5>
      <Input placeholder="View Name" thin bind:value={view.name} />
    </div>
    <footer>
      <div class="button-margin-3">
        <Button secondary on:click={hideEditor}>Cancel</Button>
      </div>
      <div class="button-margin-4">
        <Button primary on:click={save}>Save</Button>
      </div>
    </footer>
  {:else}
    <ul>
      <li on:click={showEditor}>
        <Icon name="edit" />
        Edit
      </li>
      <li data-cy="delete-view" on:click={() => confirmDeleteDialog.show()}>
        <Icon name="delete" />
        Delete
      </li>
    </ul>
  {/if}
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the view '${view.name}'? Your data will be deleted and this action cannot be undone.`}
  okText="Delete View"
  onOk={deleteView}
  title="Confirm Delete" />

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

  .container {
    padding: var(--spacing-xl);
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  footer {
    padding: var(--spacing-xl);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: var(--spacing-m);
    background: var(--grey-1);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: var(--spacing-s) 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }

  li:hover {
    background-color: var(--grey-2);
  }

  li:active {
    color: var(--blue);
  }

  .button-margin-1 {
    grid-column-start: 1;
    display: grid;
  }

  .button-margin-3 {
    grid-column-start: 3;
    display: grid;
  }

  .button-margin-4 {
    grid-column-start: 4;
    display: grid;
  }
</style>
