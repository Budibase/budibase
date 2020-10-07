<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { Popover, Button, Icon, Input, Select, Label } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import TableDataImport from "../TableDataImport.svelte"
  import analytics from "analytics"

  let anchor
  let dropdown
  let name
  let dataImport
  let loading

  async function saveTable() {
    loading = true
    const model = await backendUiStore.actions.models.save({
      name,
      schema: dataImport.schema || {},
      dataImport,
    })
    notifier.success(`Table ${name} created successfully.`)
    $goto(`./model/${model._id}`)
    analytics.captureEvent("Table Created", { name })
    name = ""
    dropdown.hide()
    loading = false
  }

  const onClosed = () => {
    name = ""
    dropdown.hide()
  }
</script>

<div bind:this={anchor}>
  <Button primary wide on:click={dropdown.show}>Create New Table</Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <div class="actions">
    <h5>Create Table</h5>
    <Input
      data-cy="table-name-input"
      thin
      label="Table Name"
      bind:value={name} />
    <div>
      <Label grey extraSmall>Create Table from CSV (Optional)</Label>
      <TableDataImport bind:dataImport />
    </div>
    <footer>
      <Button secondary on:click={onClosed}>Cancel</Button>
      <Button
        disabled={!name || (dataImport && !dataImport.valid)}
        primary
        on:click={saveTable}>
        <span style={`margin-right: ${loading ? '10px' : 0};`}>Save</span>
        {#if loading}
          <Spinner size="10" />
        {/if}
      </Button>
    </footer>
  </div>
</Popover>

<style>
  .actions {
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
