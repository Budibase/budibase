<script>
  import { getContext } from "svelte"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let table

  let anchor
  let dropdown
  let editing
  let confirmDeleteDialog

  $: fields = Object.keys(table.schema)

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
  }

  async function deleteTable() {
    await backendUiStore.actions.models.delete(table)
    notifier.success("Table deleted")
  }

  async function save() {
    await backendUiStore.actions.models.save(table)
    notifier.success("Table renamed successfully")
    hideEditor()
  }
</script>

<div bind:this={anchor} class="icon" on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu align="left" {anchor} bind:this={dropdown}>
  {#if editing}
    <div class="actions">
      <h5>Edit Table</h5>
      <Input label="Table Name" thin bind:value={table.name} />
      <Select
        label="Primary Display Column"
        thin
        secondary
        bind:value={table.primaryDisplay}>
        <option value="">Choose an option</option>
        {#each fields as field}
          <option value={field}>{field}</option>
        {/each}
      </Select>
      <footer>
        <Button secondary on:click={hideEditor}>Cancel</Button>
        <Button primary on:click={save}>Save</Button>
      </footer>
    </div>
  {:else}
    <ul>
      <li on:click={showEditor}>
        <Icon name="edit" />
        Edit
      </li>
      <li data-cy="delete-table" on:click={() => confirmDeleteDialog.show()}>
        <Icon name="delete" />
        Delete
      </li>
    </ul>
  {/if}
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the table '${table.name}'? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Table"
  onOk={deleteTable}
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
</style>
