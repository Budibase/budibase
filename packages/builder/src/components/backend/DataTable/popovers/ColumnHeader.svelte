<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { CreateEditColumnModal } from "../modals"

  export let field

  let anchor
  let dropdown

  let editing

  $: sortColumn = $backendUiStore.sort && $backendUiStore.sort.column
  $: sortDirection = $backendUiStore.sort && $backendUiStore.sort.direction

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
  }

  function deleteField() {
    backendUiStore.actions.models.deleteField(field)
    hideEditor()
  }

  function sort(direction, column) {
    backendUiStore.update(state => {
      state.sort = { direction, column }
      return state
    })
    hideEditor()
  }
</script>

<div class="container" bind:this={anchor} on:click={dropdown.show}>
  {field.name}
  <Icon name="arrowdown" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  {#if editing}
    <h5>Edit Column</h5>
    <CreateEditColumnModal onClosed={hideEditor} {field} />
  {:else}
    <ul>
      <li data-cy="edit-column-header" on:click={showEditor}>
        <Icon name="edit" />
        Edit
      </li>
      <li data-cy="delete-column-header" on:click={deleteField}>
        <Icon name="delete" />
        Delete
      </li>
      {#if sortDirection === 'desc' || sortColumn !== field.name}
        <li on:click={() => sort('asc', field.name)}>
          <Icon name="sortascending" />
          Sort A - Z
        </li>
      {/if}
      {#if sortDirection === 'asc' || sortColumn !== field.name}
        <li on:click={() => sort('desc', field.name)}>
          <Icon name="sortdescending" />
          Sort Z - A
        </li>
      {/if}
    </ul>
  {/if}
</DropdownMenu>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-xs);
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
