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

  function save() {}
</script>

<div bind:this={anchor} on:click={dropdown.show}>
  <i class="ri-more-line" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  {#if editing}
    <h4>Edit Row</h4>
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
  h4 {
    padding: var(--spacing-l);
    margin: 0;
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
