<script>
  import { getContext } from "svelte"
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import CreateEditRecord from "../modals/CreateEditRecord.svelte"
  import DeleteRecordModal from "../modals/DeleteRecord.svelte"

  const { open, close } = getContext("simple-modal")

  export let row

  let anchor
  let dropdown

  let editing

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
    close()
  }

  const deleteRow = () => {
    open(
      DeleteRecordModal,
      {
        onClosed: hideEditor,
        record: row,
      },
      { styleContent: { padding: "0" } }
    )
  }
</script>

<div bind:this={anchor} on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  {#if editing}
    <h5>Edit Row</h5>
    <CreateEditRecord onClosed={hideEditor} record={row} />
  {:else}
    <ul>
      <li data-cy="edit-row" on:click={showEditor}>
        <Icon name="edit" />
        Edit
      </li>
      <li data-cy="delete-row" on:click={deleteRow}>
        <Icon name="delete" />
        Delete
      </li>
    </ul>
  {/if}
</DropdownMenu>

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
