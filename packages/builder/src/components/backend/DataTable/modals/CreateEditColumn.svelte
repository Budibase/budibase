<script>
  import {
    Input,
    Button,
    Label,
    Select,
    Toggle,
    RadioGroup,
  } from "@budibase/bbui"
  import { cloneDeep } from "lodash/fp"
  import { tables } from "stores/backend"

  import { TableNames, UNEDITABLE_USER_FIELDS } from "constants"
  import {
    FIELDS,
    AUTO_COLUMN_SUB_TYPES,
    RelationshipTypes,
  } from "constants/backend"
  import { getAutoColumnInformation, buildAutoColumn } from "builderStore/utils"
  import { notifications } from "@budibase/bbui"
  import ValuesList from "components/common/ValuesList.svelte"
  import DatePicker from "components/common/DatePicker.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { truncate } from "lodash"

  const AUTO_COL = "auto"
  const LINK_TYPE = FIELDS.LINK.type
  let fieldDefinitions = cloneDeep(FIELDS)

  export let onClosed
  export let field = {
    type: "string",
    constraints: fieldDefinitions.STRING.constraints,

    // Initial value for column name in other table for linked records
    fieldName: $tables.selected.name,
  }

  let originalName = field.name
  let primaryDisplay =
    $tables.selected.primaryDisplay == null ||
    $tables.selected.primaryDisplay === field.name

  let table = $tables.selected
  let indexes = [...($tables.selected.indexes || [])]
  let confirmDeleteDialog
  let deletion

  $: tableOptions = $tables.list.filter(
    table => table._id !== $tables.draft._id
  )
  $: required = !!field?.constraints?.presence || primaryDisplay
  $: uneditable =
    $tables.selected?._id === TableNames.USERS &&
    UNEDITABLE_USER_FIELDS.includes(field.name)
  $: invalid =
    !field.name ||
    (field.type === LINK_TYPE && !field.tableId) ||
    Object.keys($tables.draft?.schema ?? {}).some(key => key === field.name)

  // used to select what different options can be displayed for column type
  $: canBeSearched =
    field.type !== LINK_TYPE &&
    field.subtype !== AUTO_COLUMN_SUB_TYPES.CREATED_BY &&
    field.subtype !== AUTO_COLUMN_SUB_TYPES.UPDATED_BY
  $: canBeDisplay = field.type !== LINK_TYPE && field.type !== AUTO_COL
  $: canBeRequired =
    field.type !== LINK_TYPE && !uneditable && field.type !== AUTO_COL
  $: relationshipOptions = getRelationshipOptions(field)

  async function saveColumn() {
    if (field.type === AUTO_COL) {
      field = buildAutoColumn($tables.draft.name, field.name, field.subtype)
    }
    tables.saveField({
      originalName,
      field,
      primaryDisplay,
      indexes,
    })
    onClosed()
  }

  function deleteColumn() {
    if (field.name === $tables.selected.primaryDisplay) {
      notifications.error("You cannot delete the display column")
    } else {
      tables.deleteField(field)
      notifications.success(`Column ${field.name} deleted.`)
      onClosed()
    }
  }

  function handleTypeChange(event) {
    // remove any extra fields that may not be related to this type
    delete field.autocolumn
    delete field.subtype
    delete field.tableId
    delete field.relationshipType

    // Add in defaults and initial definition
    const definition = fieldDefinitions[event.detail?.toUpperCase()]
    if (definition?.constraints) {
      field.constraints = definition.constraints
    }

    // Default relationships many to many
    if (field.type === LINK_TYPE) {
      field.relationshipType = RelationshipTypes.MANY_TO_MANY
    }
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

  function onChangePrimaryIndex(e) {
    indexes = e.target.checked ? [field.name] : []
  }

  function onChangeSecondaryIndex(e) {
    if (e.target.checked) {
      indexes[1] = field.name
    } else {
      indexes = indexes.slice(0, 1)
    }
  }

  function confirmDelete() {
    confirmDeleteDialog.show()
    deletion = true
  }

  function hideDeleteDialog() {
    confirmDeleteDialog.hide()
    deletion = false
  }

  function getRelationshipOptions(field) {
    if (!field || !field.tableId) {
      return null
    }
    const linkTable = tableOptions.find(table => table._id === field.tableId)
    if (!linkTable) {
      return null
    }
    const thisName = truncate(table.name, { length: 15 }),
      linkName = truncate(linkTable.name, { length: 15 })
    return [
      {
        name: `Many ${thisName} rows → many ${linkName} rows`,
        value: RelationshipTypes.MANY_TO_MANY,
      },
      {
        name: `One ${linkName} row → many ${thisName} rows`,
        value: RelationshipTypes.ONE_TO_MANY,
      },
      {
        name: `One ${thisName} row → many ${linkName} rows`,
        value: RelationshipTypes.MANY_TO_ONE,
      },
    ]
  }
</script>

<div class="actions" class:hidden={deletion}>
  <Input label="Name" bind:value={field.name} disabled={uneditable} />

  <Select
    disabled={originalName}
    label="Type"
    bind:value={field.type}
    on:change={handleTypeChange}
    options={[...Object.values(fieldDefinitions), { name: 'Auto Column', type: AUTO_COL }]}
    getOptionLabel={field => field.name}
    getOptionValue={field => field.type} />

  {#if canBeRequired}
    <Toggle
      checked={required}
      on:change={onChangeRequired}
      disabled={primaryDisplay}
      thin
      text="Required" />
  {/if}

  {#if canBeDisplay}
    <Toggle
      bind:checked={primaryDisplay}
      on:change={onChangePrimaryDisplay}
      thin
      text="Use as table display column" />

    <Label grey small>Search Indexes</Label>
  {/if}
  {#if canBeSearched}
    <Toggle
      checked={indexes[0] === field.name}
      disabled={indexes[1] === field.name}
      on:change={onChangePrimaryIndex}
      thin
      text="Primary" />
    <Toggle
      checked={indexes[1] === field.name}
      disabled={!indexes[0] || indexes[0] === field.name}
      on:change={onChangeSecondaryIndex}
      thin
      text="Secondary" />
  {/if}

  {#if field.type === 'string'}
    <Input
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
      type="number"
      label="Min Value"
      bind:value={field.constraints.numericality.greaterThanOrEqualTo} />
    <Input
      type="number"
      label="Max Value"
      bind:value={field.constraints.numericality.lessThanOrEqualTo} />
  {:else if field.type === 'link'}
    <Select
      label="Table"
      bind:value={field.tableId}
      options={tableOptions}
      getOptionLabel={table => table.name}
      getOptionValue={table => table._id} />
    {#if relationshipOptions && relationshipOptions.length > 0}
      <RadioGroup
        disabled={originalName}
        label="Define the relationship"
        bind:value={field.relationshipType}
        options={relationshipOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value} />
    {/if}
    <Input label={`Column name in other table`} bind:value={field.fieldName} />
  {:else if field.type === AUTO_COL}
    <Select
      label="Auto Column Type"
      value={field.subtype}
      on:change={e => (field.subtype = e.detail)}
      options={Object.entries(getAutoColumnInformation())}
      getOptionLabel={option => option[1].name}
      getOptionValue={option => option[0]} />
  {/if}
  <footer>
    {#if !uneditable && originalName != null}
      <Button warning size="S" text on:click={confirmDelete}>
        Delete Column
      </Button>
    {/if}
    <div class="spacer" />
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button cta on:click={saveColumn} bind:disabled={invalid}>
      Save Column
    </Button>
  </footer>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete this column? Your data will be deleted and this action cannot be undone.`}
  okText="Delete Column"
  onOk={deleteColumn}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion" />

<style>
  .radio-buttons {
    gap: var(--spacing-m);
    font-size: var(--font-size-xs);
  }

  .radio-buttons :global(> *) {
    margin-top: var(--spacing-s);
    width: 100%;
  }

  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
  .spacer {
    flex: 1 1 auto;
  }

  .rel-type-center {
    font-weight: 500;
    color: var(--grey-6);
    margin-right: 4px;
    margin-left: 4px;
    padding: 1px 3px 1px 3px;
    background: var(--grey-3);
    border-radius: 2px;
  }

  .radio-button-labels {
    margin-top: 2px;
  }
</style>
