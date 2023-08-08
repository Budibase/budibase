<script>
  import {
    Input,
    Button,
    Label,
    Select,
    Toggle,
    RadioGroup,
    DatePicker,
    Modal,
    notifications,
    OptionSelectDnD,
    Layout,
  } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import { tables, datasources } from "stores/backend"
  import { TableNames, UNEDITABLE_USER_FIELDS } from "constants"
  import {
    FIELDS,
    RelationshipType,
    ALLOWABLE_STRING_OPTIONS,
    ALLOWABLE_NUMBER_OPTIONS,
    ALLOWABLE_STRING_TYPES,
    ALLOWABLE_NUMBER_TYPES,
    SWITCHABLE_TYPES,
  } from "constants/backend"
  import { getAutoColumnInformation, buildAutoColumn } from "builderStore/utils"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { truncate } from "lodash"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"
  import { getBindings } from "components/backend/DataTable/formula"
  import JSONSchemaModal from "./JSONSchemaModal.svelte"
  import { ValidColumnNameRegex } from "@budibase/shared-core"

  const AUTO_TYPE = "auto"
  const FORMULA_TYPE = FIELDS.FORMULA.type
  const LINK_TYPE = FIELDS.LINK.type
  const STRING_TYPE = FIELDS.STRING.type
  const NUMBER_TYPE = FIELDS.NUMBER.type
  const JSON_TYPE = FIELDS.JSON.type
  const DATE_TYPE = FIELDS.DATETIME.type

  const dispatch = createEventDispatcher()
  const PROHIBITED_COLUMN_NAMES = ["type", "_id", "_rev", "tableId"]
  const { dispatch: gridDispatch } = getContext("grid")

  export let field

  let fieldDefinitions = cloneDeep(FIELDS)
  let originalName
  let linkEditDisabled
  let primaryDisplay
  let indexes = [...($tables.selected.indexes || [])]
  let isCreating

  let table = $tables.selected
  let confirmDeleteDialog
  let savingColumn
  let deleteColName
  let jsonSchemaModal
  let allowedTypes = []
  let editableColumn = {
    type: "string",
    constraints: fieldDefinitions.STRING.constraints,
    // Initial value for column name in other table for linked records
    fieldName: $tables.selected.name,
  }

  $: if (primaryDisplay) {
    editableColumn.constraints.presence = { allowEmpty: false }
  }

  const initialiseField = (field, savingColumn) => {
    if (field && !savingColumn) {
      editableColumn = cloneDeep(field)
      originalName = editableColumn.name ? editableColumn.name + "" : null
      linkEditDisabled = originalName != null
      isCreating = originalName == null
      primaryDisplay =
        $tables.selected.primaryDisplay == null ||
        $tables.selected.primaryDisplay === editableColumn.name
    } else if (!savingColumn) {
      let highestNumber = 0
      Object.keys(table.schema).forEach(columnName => {
        const columnNumber = extractColumnNumber(columnName)
        if (columnNumber > highestNumber) {
          highestNumber = columnNumber
        }
        return highestNumber
      })

      if (highestNumber >= 1) {
        editableColumn.name = `Column 0${highestNumber + 1}`
      } else {
        editableColumn.name = "Column 01"
      }
    }
    allowedTypes = getAllowedTypes()
  }

  $: initialiseField(field, savingColumn)

  $: checkConstraints(editableColumn)
  $: required = !!editableColumn?.constraints?.presence || primaryDisplay
  $: uneditable =
    $tables.selected?._id === TableNames.USERS &&
    UNEDITABLE_USER_FIELDS.includes(editableColumn.name)
  $: invalid =
    !editableColumn?.name ||
    (editableColumn?.type === LINK_TYPE && !editableColumn?.tableId) ||
    Object.keys(errors).length !== 0
  $: errors = checkErrors(editableColumn)
  $: datasource = $datasources.list.find(
    source => source._id === table?.sourceId
  )

  const getTableAutoColumnTypes = table => {
    return Object.keys(table?.schema).reduce((acc, key) => {
      let fieldSchema = table?.schema[key]
      if (fieldSchema.autocolumn) {
        acc.push(fieldSchema.subtype)
      }
      return acc
    }, [])
  }

  let autoColumnInfo = getAutoColumnInformation()

  $: tableAutoColumnsTypes = getTableAutoColumnTypes($tables?.selected)
  $: availableAutoColumns = Object.keys(autoColumnInfo).reduce((acc, key) => {
    if (!tableAutoColumnsTypes.includes(key)) {
      acc[key] = autoColumnInfo[key]
    }
    return acc
  }, {})

  $: availableAutoColumnKeys = availableAutoColumns
    ? Object.keys(availableAutoColumns)
    : []

  $: autoColumnOptions = editableColumn.autocolumn
    ? autoColumnInfo
    : availableAutoColumns

  // used to select what different options can be displayed for column type
  $: canBeDisplay =
    editableColumn?.type !== LINK_TYPE &&
    editableColumn?.type !== AUTO_TYPE &&
    editableColumn?.type !== JSON_TYPE &&
    !editableColumn.autocolumn
  $: canBeRequired =
    editableColumn?.type !== LINK_TYPE &&
    !uneditable &&
    editableColumn?.type !== AUTO_TYPE &&
    !editableColumn.autocolumn
  $: relationshipOptions = getRelationshipOptions(editableColumn)
  $: external = table.type === "external"
  // in the case of internal tables the sourceId will just be undefined
  $: tableOptions = $tables.list.filter(
    opt =>
      opt._id !== $tables.selected._id &&
      opt.type === table.type &&
      table.sourceId === opt.sourceId
  )
  $: typeEnabled =
    !originalName ||
    (originalName &&
      SWITCHABLE_TYPES.indexOf(editableColumn.type) !== -1 &&
      !editableColumn?.autocolumn)

  async function saveColumn() {
    savingColumn = true
    if (errors?.length) {
      return
    }

    let saveColumn = cloneDeep(editableColumn)

    if (saveColumn.type === AUTO_TYPE) {
      saveColumn = buildAutoColumn(
        $tables.selected.name,
        saveColumn.name,
        saveColumn.subtype
      )
    }
    if (saveColumn.type !== LINK_TYPE) {
      delete saveColumn.fieldName
    }
    try {
      await tables.saveField({
        originalName,
        field: saveColumn,
        primaryDisplay,
        indexes,
      })
      dispatch("updatecolumns")
      gridDispatch("close-edit-column")

      if (
        saveColumn.type === LINK_TYPE &&
        saveColumn.relationshipType === RelationshipType.MANY_TO_MANY
      ) {
        // Fetching the new tables
        tables.fetch()
        // Fetching the new relationships
        datasources.fetch()
      }
      if (originalName) {
        notifications.success("Column updated successfully")
      } else {
        notifications.success("Column created successfully")
      }
    } catch (err) {
      notifications.error(`Error saving column: ${err.message}`)
    }
  }

  function cancelEdit() {
    editableColumn.name = originalName
    gridDispatch("close-edit-column")
  }

  async function deleteColumn() {
    try {
      editableColumn.name = deleteColName
      if (editableColumn.name === $tables.selected.primaryDisplay) {
        notifications.error("You cannot delete the display column")
      } else {
        await tables.deleteField(editableColumn)
        notifications.success(`Column ${editableColumn.name} deleted`)
        confirmDeleteDialog.hide()
        dispatch("updatecolumns")
        gridDispatch("close-edit-column")
      }
    } catch (error) {
      notifications.error(`Error deleting column: ${error.message}`)
    }
  }

  function handleTypeChange(event) {
    // remove any extra fields that may not be related to this type
    delete editableColumn.autocolumn
    delete editableColumn.subtype
    delete editableColumn.tableId
    delete editableColumn.relationshipType
    delete editableColumn.formulaType

    // Add in defaults and initial definition
    const definition = fieldDefinitions[event.detail?.toUpperCase()]
    if (definition?.constraints) {
      editableColumn.constraints = definition.constraints
    }

    // Default relationships many to many
    if (editableColumn.type === LINK_TYPE) {
      editableColumn.relationshipType = RelationshipType.MANY_TO_MANY
    }
    if (editableColumn.type === FORMULA_TYPE) {
      editableColumn.formulaType = "dynamic"
    }
  }

  function onChangeRequired(e) {
    const req = e.detail
    editableColumn.constraints.presence = req ? { allowEmpty: false } : false
    required = req
  }

  function openJsonSchemaEditor() {
    jsonSchemaModal.show()
  }

  function confirmDelete() {
    confirmDeleteDialog.show()
  }

  function hideDeleteDialog() {
    confirmDeleteDialog.hide()
    deleteColName = ""
  }

  function extractColumnNumber(columnName) {
    const match = columnName.match(/Column (\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  function getRelationshipOptions(field) {
    if (!field || !field.tableId) {
      return null
    }
    const linkTable = tableOptions?.find(table => table._id === field.tableId)
    if (!linkTable) {
      return null
    }
    const thisName = truncate(table.name, { length: 14 }),
      linkName = truncate(linkTable.name, { length: 14 })
    return [
      {
        name: `Many ${thisName} rows → many ${linkName} rows`,
        alt: `Many ${table.name} rows → many ${linkTable.name} rows`,
        value: RelationshipType.MANY_TO_MANY,
      },
      {
        name: `One ${linkName} row → many ${thisName} rows`,
        alt: `One ${linkTable.name} rows → many ${table.name} rows`,
        value: RelationshipType.ONE_TO_MANY,
      },
      {
        name: `One ${thisName} row → many ${linkName} rows`,
        alt: `One ${table.name} rows → many ${linkTable.name} rows`,
        value: RelationshipType.MANY_TO_ONE,
      },
    ]
  }

  function getAllowedTypes() {
    if (
      originalName &&
      ALLOWABLE_STRING_TYPES.indexOf(editableColumn.type) !== -1
    ) {
      return ALLOWABLE_STRING_OPTIONS
    } else if (
      originalName &&
      ALLOWABLE_NUMBER_TYPES.indexOf(editableColumn.type) !== -1
    ) {
      return ALLOWABLE_NUMBER_OPTIONS
    } else if (!external) {
      return [
        ...Object.values(fieldDefinitions),
        { name: "Auto Column", type: AUTO_TYPE },
      ]
    } else {
      let fields = [
        FIELDS.STRING,
        FIELDS.BARCODEQR,
        FIELDS.LONGFORM,
        FIELDS.OPTIONS,
        FIELDS.DATETIME,
        FIELDS.NUMBER,
        FIELDS.BOOLEAN,
        FIELDS.FORMULA,
        FIELDS.BIGINT,
      ]
      // no-sql or a spreadsheet
      if (!external || table.sql) {
        fields = [...fields, FIELDS.LINK, FIELDS.ARRAY]
      }
      return fields
    }
  }

  function checkConstraints(fieldToCheck) {
    if (!fieldToCheck) {
      return
    }
    // most types need this, just make sure its always present
    if (fieldToCheck && !fieldToCheck.constraints) {
      fieldToCheck.constraints = {}
    }
    // some string types may have been built by server, may not always have constraints
    if (fieldToCheck.type === STRING_TYPE && !fieldToCheck.constraints.length) {
      fieldToCheck.constraints.length = {}
    }
    // some number types made server-side will be missing constraints
    if (
      fieldToCheck.type === NUMBER_TYPE &&
      !fieldToCheck.constraints.numericality
    ) {
      fieldToCheck.constraints.numericality = {}
    }
    if (fieldToCheck.type === DATE_TYPE && !fieldToCheck.constraints.datetime) {
      fieldToCheck.constraints.datetime = {}
    }
  }

  function checkErrors(fieldInfo) {
    if (!editableColumn) {
      return {}
    }
    function inUse(tbl, column, ogName = null) {
      const parsedColumn = column ? column.toLowerCase().trim() : column

      return Object.keys(tbl?.schema || {}).some(key => {
        let lowerKey = key.toLowerCase()
        return lowerKey !== ogName?.toLowerCase() && lowerKey === parsedColumn
      })
    }
    const newError = {}
    if (!external && fieldInfo.name?.startsWith("_")) {
      newError.name = `Column name cannot start with an underscore.`
    } else if (fieldInfo.name && !fieldInfo.name.match(ValidColumnNameRegex)) {
      newError.name = `Illegal character; must be alpha-numeric.`
    } else if (PROHIBITED_COLUMN_NAMES.some(name => fieldInfo.name === name)) {
      newError.name = `${PROHIBITED_COLUMN_NAMES.join(
        ", "
      )} are not allowed as column names`
    } else if (inUse($tables.selected, fieldInfo.name, originalName)) {
      newError.name = `Column name already in use.`
    }

    if (fieldInfo.type == "auto" && !fieldInfo.subtype) {
      newError.subtype = `Auto Column requires a type`
    }

    if (fieldInfo.fieldName && fieldInfo.tableId) {
      const relatedTable = $tables.list.find(
        tbl => tbl._id === fieldInfo.tableId
      )
      if (inUse(relatedTable, fieldInfo.fieldName) && !originalName) {
        newError.relatedName = `Column name already in use in table ${relatedTable.name}`
      }
    }
    return newError
  }
</script>

<Layout noPadding gap="S">
  <Input
    bind:value={editableColumn.name}
    disabled={uneditable ||
      (linkEditDisabled && editableColumn.type === LINK_TYPE)}
    error={errors?.name}
  />

  <Select
    disabled={!typeEnabled}
    bind:value={editableColumn.type}
    on:change={handleTypeChange}
    options={allowedTypes}
    getOptionLabel={field => field.name}
    getOptionValue={field => field.type}
    getOptionIcon={field => field.icon}
    isOptionEnabled={option => {
      if (option.type == AUTO_TYPE) {
        return availableAutoColumnKeys?.length > 0
      }
      return true
    }}
  />

  {#if editableColumn.type === "string"}
    <Input
      type="number"
      label="Max Length"
      bind:value={editableColumn.constraints.length.maximum}
    />
  {:else if editableColumn.type === "options"}
    <OptionSelectDnD
      bind:constraints={editableColumn.constraints}
      bind:optionColors={editableColumn.optionColors}
    />
  {:else if editableColumn.type === "longform"}
    <div>
      <Label
        size="M"
        tooltip="Rich text includes support for images, links, tables, lists and more"
      >
        Formatting
      </Label>
      <Toggle
        bind:value={editableColumn.useRichText}
        text="Enable rich text support (markdown)"
      />
    </div>
  {:else if editableColumn.type === "array"}
    <OptionSelectDnD
      bind:constraints={editableColumn.constraints}
      bind:optionColors={editableColumn.optionColors}
    />
  {:else if editableColumn.type === "datetime" && !editableColumn.autocolumn}
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Earliest</Label>
      </div>
      <div class="input-length">
        <DatePicker bind:value={editableColumn.constraints.datetime.earliest} />
      </div>
    </div>

    <div class="split-label">
      <div class="label-length">
        <Label size="M">Latest</Label>
      </div>
      <div class="input-length">
        <DatePicker bind:value={editableColumn.constraints.datetime.latest} />
      </div>
    </div>
    {#if datasource?.source !== "ORACLE" && datasource?.source !== "SQL_SERVER"}
      <div>
        <Label
          tooltip={isCreating
            ? null
            : "We recommend not changing how timezones are handled for existing columns, as existing data will not be updated"}
        >
          Time zones
        </Label>
        <Toggle
          bind:value={editableColumn.ignoreTimezones}
          text="Ignore time zones"
        />
      </div>
    {/if}
  {:else if editableColumn.type === "number" && !editableColumn.autocolumn}
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Max Value</Label>
      </div>
      <div class="input-length">
        <Input
          type="number"
          bind:value={editableColumn.constraints.numericality
            .greaterThanOrEqualTo}
        />
      </div>
    </div>

    <div class="split-label">
      <div class="label-length">
        <Label size="M">Max Value</Label>
      </div>
      <div class="input-length">
        <Input
          type="number"
          bind:value={editableColumn.constraints.numericality.lessThanOrEqualTo}
        />
      </div>
    </div>
  {:else if editableColumn.type === "link"}
    <Select
      label="Table"
      disabled={linkEditDisabled}
      bind:value={editableColumn.tableId}
      options={tableOptions}
      getOptionLabel={table => table.name}
      getOptionValue={table => table._id}
    />
    {#if relationshipOptions && relationshipOptions.length > 0}
      <RadioGroup
        disabled={linkEditDisabled}
        label="Define the relationship"
        bind:value={editableColumn.relationshipType}
        options={relationshipOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value}
        getOptionTitle={option => option.alt}
      />
    {/if}
    <Input
      disabled={linkEditDisabled}
      label={`Column name in other table`}
      bind:value={editableColumn.fieldName}
      error={errors.relatedName}
    />
  {:else if editableColumn.type === FORMULA_TYPE}
    {#if !table.sql}
      <div class="split-label">
        <div class="label-length">
          <Label size="M">Formula Type</Label>
        </div>
        <div class="input-length">
          <Select
            bind:value={editableColumn.formulaType}
            options={[
              { label: "Dynamic", value: "dynamic" },
              { label: "Static", value: "static" },
            ]}
            getOptionLabel={option => option.label}
            getOptionValue={option => option.value}
            tooltip="Dynamic formula are calculated when retrieved, but cannot be filtered or sorted by,
         while static formula are calculated when the row is saved."
          />
        </div>
      </div>
    {/if}
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Formula</Label>
      </div>
      <div class="input-length">
        <ModalBindableInput
          title="Formula"
          value={editableColumn.formula}
          on:change={e => {
            editableColumn = {
              ...editableColumn,
              formula: e.detail,
            }
          }}
          bindings={getBindings({ table })}
          allowJS
        />
      </div>
    </div>
  {:else if editableColumn.type === JSON_TYPE}
    <Button primary text on:click={openJsonSchemaEditor}
      >Open schema editor</Button
    >
  {/if}
  {#if editableColumn.type === AUTO_TYPE || editableColumn.autocolumn}
    <Select
      label="Auto column type"
      value={editableColumn.subtype}
      on:change={e => (editableColumn.subtype = e.detail)}
      options={Object.entries(autoColumnOptions)}
      getOptionLabel={option => option[1].name}
      getOptionValue={option => option[0]}
      disabled={!availableAutoColumnKeys?.length || editableColumn.autocolumn}
      error={errors?.subtype}
    />
  {/if}

  {#if canBeRequired || canBeDisplay}
    <div>
      {#if canBeRequired}
        <Toggle
          value={required}
          on:change={onChangeRequired}
          disabled={primaryDisplay}
          thin
          text="Required"
        />
      {/if}
    </div>
  {/if}
</Layout>

<div class="action-buttons">
  {#if !uneditable && originalName != null}
    <Button quiet warning text on:click={confirmDelete}>Delete</Button>
  {/if}
  <Button secondary newStyles on:click={cancelEdit}>Cancel</Button>
  <Button disabled={invalid} newStyles cta on:click={saveColumn}>Save</Button>
</div>
<Modal bind:this={jsonSchemaModal}>
  <JSONSchemaModal
    schema={editableColumn.schema}
    json={editableColumn.json}
    on:save={({ detail }) => {
      editableColumn.schema = detail.schema
      editableColumn.json = detail.json
    }}
  />
</Modal>

<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Column"
  onOk={deleteColumn}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion"
  disabled={deleteColName !== originalName}
>
  <p>
    Are you sure you wish to delete the column <b>{originalName}?</b>
    Your data will be deleted and this action cannot be undone - enter the column
    name to confirm.
  </p>
  <Input bind:value={deleteColName} placeholder={originalName} />
</ConfirmDialog>

<style>
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--spacing-s);
    gap: var(--spacing-l);
  }
  .split-label {
    display: flex;
    align-items: center;
  }

  .label-length {
    flex-basis: 40%;
  }

  .input-length {
    flex-grow: 1;
  }
</style>
