<script>
  import { backendUiStore } from "builderStore"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import { ModelSetupNav } from "components/nav/ModelSetupNav"
  import ModelFieldEditor from "components/nav/ModelSetupNav/ModelFieldEditor.svelte"
  import CreateEditTable from "../modals/CreateEditTable.svelte"

  export let field

  let anchor
  let dropdown

  let editing

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
  }

  function deleteField() {
    alert("Delete Field Not Implemented")
  }

  function save() {}
</script>

<div bind:this={anchor} on:click={dropdown.show}>
  {field.name}
  <Icon name="arrowdown" />
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  {#if editing}
    <h5>Edit Column</h5>
    <CreateEditTable
      onClosed={dropdown.hide}
      field={field.field}
      columnName={field.name} />
  {:else}
    <ul>
      <li on:click={showEditor}>
        <Icon name="edit" />
        Edit
      </li>
      <li on:click={deleteField}>
        <Icon name="delete" />
        Delete
      </li>
      <li>
        <Icon name="sortascending" />
        Sort A - Z
      </li>
      <li>
        <Icon name="sortdescending" />
        Sort Z - A
      </li>
    </ul>
  {/if}
</DropdownMenu>

<style>
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

  .editor {
    padding: var(--spacing-xl);
  }

  footer {
    padding: var(--spacing-xl);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    border-bottom-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
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
