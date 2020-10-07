<script>
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import Spinner from "components/common/Spinner.svelte"
  import {
    DropdownMenu,
    Button,
    Label,
    Heading,
    Icon,
    Input,
    Select,
    Dropzone,
    Spacer,
  } from "@budibase/bbui"
  import TableDataImport from "./TableDataImport.svelte"
  import api from "builderStore/api"
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
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <div class="container">
    <h5>Create Table</h5>
    <Label grey extraSmall>Name</Label>
    <Input
      data-cy="table-name-input"
      placeholder="Table Name"
      thin
      bind:value={name} />
    <Spacer medium />
    <Label grey extraSmall>Create Table from CSV (Optional)</Label>
    <TableDataImport bind:dataImport />
  </div>
  <footer>
    <div class="button-margin-3">
      <Button secondary on:click={onClosed}>Cancel</Button>
    </div>
    <div class="button-margin-4">
      <Button
        disabled={!name || (dataImport && !dataImport.valid)}
        primary
        on:click={saveTable}>
        <span style={`margin-right: ${loading ? '10px' : 0};`}>Save</span>
        {#if loading}
          <Spinner size="10" />
        {/if}
      </Button>
    </div>
  </footer>
</DropdownMenu>

<style>
  h5 {
    margin-bottom: var(--spacing-m);
    margin-top: 0;
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
