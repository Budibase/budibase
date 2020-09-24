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
  <div class="container">
    <h5>Create Table</h5>
    <Input
      data-cy="table-name-input"
      placeholder="Table Name"
      thin
      bind:value={name} />
  </div>
  <footer>
    <div class="button-margin-3">
      <Button secondary on:click={onClosed}>Cancel</Button>
    </div>
    <div class="button-margin-4">
      <Button primary on:click={saveTable}>Save</Button>
    </div>
  </footer>
</DropdownMenu>

<style>
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

  .button-margin-3 {
    grid-column-start: 3;
    display: grid;
  }

  .button-margin-4 {
    grid-column-start: 4;
    display: grid;
  }
</style>
