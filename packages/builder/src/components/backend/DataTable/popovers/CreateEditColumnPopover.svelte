<script>
  import {
    Input,
    Button,
    Select,
    Toggle,
  } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"
  import { backendUiStore } from "builderStore"
  import { FIELDS } from "constants/backend"
  import { notifier } from "builderStore/store/notifications"
  import ValuesList from "components/common/ValuesList.svelte"
  import DatePicker from "components/common/DatePicker.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  let fieldDefinitions = cloneDeep(FIELDS)

  export let onClosed
  export let field = {
    type: "string",
    constraints: fieldDefinitions.STRING.constraints,

    // Initial value for column name in other table for linked records
    fieldName: $backendUiStore.selectedTable.name,
  }

  let originalName = field.name
  let primaryDisplay =
    $backendUiStore.selectedTable.primaryDisplay == null ||
    $backendUiStore.selectedTable.primaryDisplay === field.name
  let confirmDeleteDialog

  $: tableOptions = $backendUiStore.tables.filter(
    table => table._id !== $backendUiStore.draftTable._id
  )
  $: required = !!field?.constraints?.presence || primaryDisplay

  async function saveColumn() {
    backendUiStore.update(state => {
      backendUiStore.actions.tables.saveField({
        originalName,
        field,
        primaryDisplay,
      })
      return state
    })
    onClosed()
  }

  function deleteColumn() {
    if (field.name === $backendUiStore.selectedTable.primaryDisplay) {
      notifier.danger("You cannot delete the display column")
    } else {
      backendUiStore.actions.tables.deleteField(field)
      notifier.success("Column deleted")
      hideDeleteDialog()
    }
  }

  function handleFieldConstraints(event) {
    const { type, constraints } = fieldDefinitions[
      event.target.value.toUpperCase()
    ]
    field.type = type
    field.constraints = constraints
  }

  function onChangeRequired(e) {
    const req = e.target.checked
    field.constraints.presence = req ? { allowEmpty: false } : false
    required = req
  }

  function onChangePrimaryDisplay(e) {
    const isPrimary = e.target.checked
    // primary display is always required
    if (isPrimary) {
      field.constraints.presence = { allowEmpty: false }
    }
  }

  function confirmDelete() {
    confirmDeleteDialog.show()
    onClosed()
  }

  function hideDeleteDialog() {
    confirmDeleteDialog.hide()
  }
</script>

<div class="actions">
  <Input label="Name" thin bind:value={field.name} />

  <Select
    disabled={originalName}
    secondary
    thin
    label="Type"
    on:change={handleFieldConstraints}
    bind:value={field.type}>
    {#each Object.values(fieldDefinitions) as field}
      <option value={field.type}>{field.name}</option>
    {/each}
  </Select>

  {#if field.type !== 'link'}
    <Toggle
      checked={required}
      on:change={onChangeRequired}
      disabled={primaryDisplay}
      thin
      text="Required" />
  {/if}

  {#if field.type !== 'link'}
    <Toggle
      bind:checked={primaryDisplay}
      on:change={onChangePrimaryDisplay}
      thin
      text="Use as table display column" />
  {/if}

  {#if field.type === 'string'}
    <Input
      thin
      type="number"
      label="Max Length"
      bind:value={field.constraints.length.maximum} />
  {:else if field.type === 'options'}
    <ValuesList
      label="Options (one per line)"
      bind:values={field.constraints.inclusion} />
  {:else if field.type === 'datetime'}
    <DatePicker
      label="Earliest"
      bind:value={field.constraints.datetime.earliest} />
    <DatePicker label="Latest" bind:value={field.constraints.datetime.latest} />
  {:else if field.type === 'number'}
    <Input
      thin
      type="number"
      label="Min Value"
      bind:value={field.constraints.numericality.greaterThanOrEqualTo} />
    <Input
      thin
      type="number"
      label="Max Value"
      bind:value={field.constraints.numericality.lessThanOrEqualTo} />
  {:else if field.type === 'link'}
    <Select label="Table" thin secondary bind:value={field.tableId}>
      <option value="">Choose an option</option>
      {#each tableOptions as table}
        <option value={table._id}>{table.name}</option>
      {/each}
    </Select>
    <Input
      label={`Column Name in Other Table`}
      thin
      bind:value={field.fieldName} />
  {/if}
  <footer>
    {#if originalName}
      <Button red on:click={confirmDelete}>Delete Column</Button>
    {/if}
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveColumn}>Save Column</Button>
  </footer>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this column? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Column"
  onOk={deleteColumn}
  onCancel={hideDeleteDialog}
  title="Confirm Delete" />

<style>
  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
    min-width: 400px;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
