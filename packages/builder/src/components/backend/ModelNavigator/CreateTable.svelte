<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"

  export let table

  let anchor
  let dropdown
  let name

  async function saveTable() {
    const model = await backendUiStore.actions.models.save({
      name,
      schema: {},
    })
    notifier.success(`Table ${name} created successfully.`)
    $goto(`./model/${model._id}`)
    name = ""
    dropdown.hide()
  }

  const onClosed = () => {
    name = ""
    dropdown.hide()
  }
</script>

<div bind:this={anchor}>
  <Button primary wide on:click={dropdown.show}>Create New Table</Button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <div class="actions">
    <h5>Create Table</h5>
    <Input
      data-cy="table-name-input"
      thin
      label="Table Name"
      bind:value={name} />
    <footer>
      <Button secondary on:click={onClosed}>Cancel</Button>
      <Button primary on:click={saveTable}>Save</Button>
    </footer>
  </div>
</DropdownMenu>

<style>
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
