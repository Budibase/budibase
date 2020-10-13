<script>
  import { backendUiStore, store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import screenTemplates from "builderStore/store/screenTemplates"
  import api from "builderStore/api"

  export let table

  let anchor
  let dropdown
  let editing
  let confirmDeleteDialog
  let templateScreens
  let willBeDeleted

  $: fields = Object.keys(table.schema)

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown?.hide()
    editing = false
  }

  function showModal() {
    const screens = $store.allScreens
    templateScreens = screens.filter(screen => screen.props.table === table._id)
    willBeDeleted = ["All table data"].concat(templateScreens.map(screen => `Screen ${screen.props._instanceName}`))
    hideEditor()
    confirmDeleteDialog.show()
  }

  function deleteTemplateScreens() {
    store.update(state => {
      for (let screen of templateScreens) {
        const mainPageName = state.pages.main.name
        state.screens = state.screens.filter(c => c.name !== screen.name)
        // Remove screen from current page as well
        state.pages[state.currentPageName]._screens = state.pages[mainPageName]._screens.filter(
          scr => scr.name !== screen.name
        )
        api.delete(`/_builder/api/pages/${mainPageName}/screens/${screen.name}`)
      }
      return state
    })
  }

  async function deleteTable() {
    await backendUiStore.actions.tables.delete(table)
    deleteTemplateScreens()
    notifier.success("Table deleted")
    hideEditor()
  }

  async function save() {
    await backendUiStore.actions.tables.save(table)
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
      <li data-cy="delete-table" on:click={showModal}>
        <Icon name="delete" />
        Delete
      </li>
    </ul>
  {/if}
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the table '${table.name}'?`}
  okText="Delete Table"
  onOk={deleteTable}
  title="Confirm Delete">
  The following will also be deleted:
  <b>
  <div class="delete-items">
    {#each willBeDeleted as item}
      <div>{item}</div>
    {/each}
  </div>
  </b>
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

  div.delete-items {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  div.delete-items div {
    margin-top: 4px;
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
