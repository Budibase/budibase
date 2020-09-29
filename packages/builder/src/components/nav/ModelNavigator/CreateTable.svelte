<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import analytics from "analytics"

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
    analytics.captureEvent("Table Created", { name })
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
  h5 {
    margin-bottom: var(--spacing-l);
    font-weight: 500;
  }

  .container {
    padding: var(--spacing-l);
    margin: 0;
  }

  footer {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 20px;
    background: var(--grey-1);
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
