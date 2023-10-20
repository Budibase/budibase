<script>
  import {
    Input,
    Button,
    Label,
    Select,
    Toggle,
    Icon,
    DatePicker,
    Modal,
    notifications,
    OptionSelectDnD,
    Layout,
    AbsTooltip,
  } from "@budibase/bbui"
  import { createEventDispatcher, getContext, onMount } from "svelte"
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
    PrettyRelationshipDefinitions,
  } from "constants/backend"
  import { getAutoColumnInformation, buildAutoColumn } from "builderStore/utils"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"
  import { getBindings } from "components/backend/DataTable/formula"
  import JSONSchemaModal from "./JSONSchemaModal.svelte"
  import { ValidColumnNameRegex } from "@budibase/shared-core"
  import { FieldType, FieldSubtype, SourceName } from "@budibase/types"
  import RelationshipSelector from "components/common/RelationshipSelector.svelte"

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

  let mounted = false
  const fieldDefinitions = Object.values(FIELDS).reduce(
    // Storing the fields by complex field id
    (acc, field) => ({
      ...acc,
      [makeFieldId(field.type, field.subtype)]: field,
    }),
    {}
  )

  function makeFieldId(type, subtype) {
    return `${type}${subtype || ""}`.toUpperCase()
  }

  let originalName
  let linkEditDisabled
  let primaryDisplay
  let indexes = [...($tables.selected.indexes || [])]
  let isCreating = undefined

  let relationshipPart1 = PrettyRelationshipDefinitions.Many
  let relationshipPart2 = PrettyRelationshipDefinitions.One

  let relationshipTableIdPrimary = null
  let relationshipTableIdSecondary = null

  let table = $tables.selected
  let confirmDeleteDialog
  let savingColumn
  let deleteColName
  let jsonSchemaModal
  let allowedTypes = []
  let editableColumn = {
    type: FIELDS.STRING.type,
    constraints: FIELDS.STRING.constraints,
    // Initial value for column name in other table for linked records
    fieldName: $tables.selected.name,
  }
  let relationshipOpts1 = Object.values(PrettyRelationshipDefinitions)
  let relationshipOpts2 = Object.values(PrettyRelationshipDefinitions)

  $: if (primaryDisplay) {
    editableColumn.constraints.presence = { allowEmpty: false }
  }

  let relationshipMap = {
    [RelationshipType.ONE_TO_MANY]: {
      part1: PrettyRelationshipDefinitions.MANY,
      part2: PrettyRelationshipDefinitions.ONE,
    },
    [RelationshipType.MANY_TO_MANY]: {
      part1: PrettyRelationshipDefinitions.MANY,
      part2: PrettyRelationshipDefinitions.MANY,
    },
    [RelationshipType.MANY_TO_ONE]: {
      part1: PrettyRelationshipDefinitions.ONE,
      part2: PrettyRelationshipDefinitions.MANY,
    },
  }

  $: {
    // this parses any changes the user has made when creating a new internal relationship
    // into what we expect the schema to look like
    if (editableColumn.type === LINK_TYPE) {
      relationshipTableIdPrimary = table._id
      if (relationshipPart1 === PrettyRelationshipDefinitions.ONE) {
        relationshipOpts2 = relationshipOpts2.filter(
          opt => opt !== PrettyRelationshipDefinitions.ONE
        )
      } else {
        relationshipOpts2 = Object.values(PrettyRelationshipDefinitions)
      }

      if (relationshipPart2 === PrettyRelationshipDefinitions.ONE) {
        relationshipOpts1 = relationshipOpts1.filter(
          opt => opt !== PrettyRelationshipDefinitions.ONE
        )
      } else {
        relationshipOpts1 = Object.values(PrettyRelationshipDefinitions)
      }
      // Determine the relationship type based on the selected values of both parts
      editableColumn.relationshipType = Object.entries(relationshipMap).find(
        ([_, parts]) =>
          parts.part1 === relationshipPart1 && parts.part2 === relationshipPart2
      )?.[0]
      // Set the tableId based on the selected table
      editableColumn.tableId = relationshipTableIdSecondary
    }
  }
  const initialiseField = (field, savingColumn) => {
    isCreating = !field

    if (field && !savingColumn) {
      editableColumn = cloneDeep(field)
      originalName = editableColumn.name ? editableColumn.name + "" : null
      linkEditDisabled = originalName != null
      primaryDisplay =
        $tables.selected.primaryDisplay == null ||
        $tables.selected.primaryDisplay === editableColumn.name

      // Here we are setting the relationship values based on the editableColumn
      // This part of the code is used when viewing an existing field hence the check
      // for the tableId
      if (editableColumn.type === LINK_TYPE && editableColumn.tableId) {
        relationshipTableIdPrimary = table._id
        relationshipTableIdSecondary = editableColumn.tableId
        if (editableColumn.relationshipType in relationshipMap) {
          const { part1, part2 } =
            relationshipMap[editableColumn.relationshipType]
          relationshipPart1 = part1
          relationshipPart2 = part2
        }
      }
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

    if (!savingColumn) {
      editableColumn.fieldId = makeFieldId(
        editableColumn.type,
        editableColumn.subtype
      )

      allowedTypes = getAllowedTypes().map(t => ({
        fieldId: makeFieldId(t.type, t.subtype),
        ...t,
      }))
    }
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
  $: external = table.type === "external"
  // in the case of internal tables the sourceId will just be undefined
  $: tableOptions = $tables.list.filter(
    opt => opt.type === table.type && table.sourceId === opt.sourceId
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

    delete saveColumn.fieldId

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

      if (saveColumn.type === LINK_TYPE) {
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

        if (editableColumn.type === LINK_TYPE) {
          // Updating the relationships
          datasources.fetch()
        }
      }
    } catch (error) {
      notifications.error(`Error deleting column: ${error.message}`)
    }
  }

  function onHandleTypeChange(event) {
    handleTypeChange(event.detail)
  }

  function handleTypeChange(type) {
    // remove any extra fields that may not be related to this type
    delete editableColumn.autocolumn
    delete editableColumn.subtype
    delete editableColumn.tableId
    delete editableColumn.relationshipType
    delete editableColumn.formulaType
    delete editableColumn.constraints

    // Add in defaults and initial definition
    const definition = fieldDefinitions[type?.toUpperCase()]
    if (definition?.constraints) {
      editableColumn.constraints = definition.constraints
    }

    editableColumn.type = definition.type
    editableColumn.subtype = definition.subtype

    // Default relationships many to many
    if (editableColumn.type === LINK_TYPE) {
      editableColumn.relationshipType = RelationshipType.MANY_TO_MANY
    } else if (editableColumn.type === FORMULA_TYPE) {
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
    }

    const isUsers =
      editableColumn.type === FieldType.BB_REFERENCE &&
      editableColumn.subtype === FieldSubtype.USERS

    if (!external) {
      return [
        FIELDS.STRING,
        FIELDS.BARCODEQR,
        FIELDS.LONGFORM,
        FIELDS.OPTIONS,
        FIELDS.ARRAY,
        FIELDS.NUMBER,
        FIELDS.BIGINT,
        FIELDS.BOOLEAN,
        FIELDS.DATETIME,
        FIELDS.ATTACHMENT,
        FIELDS.LINK,
        FIELDS.FORMULA,
        FIELDS.JSON,
        isUsers ? FIELDS.USERS : FIELDS.USER,
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
        isUsers ? FIELDS.USERS : FIELDS.USER,
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
    if (!fieldToCheck.constraints) {
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

  function isUsersColumn(column) {
    return (
      column.type === FieldType.BB_REFERENCE &&
      [FieldSubtype.USER, FieldSubtype.USERS].includes(column.subtype)
    )
  }

  onMount(() => {
    mounted = true
  })
</script>

<Layout noPadding gap="S">
  {#if mounted}
    <Input
      autofocus
      bind:value={editableColumn.name}
      disabled={uneditable ||
        (linkEditDisabled && editableColumn.type === LINK_TYPE)}
      error={errors?.name}
    />
  {/if}
  <Select
    disabled={!typeEnabled}
    bind:value={editableColumn.fieldId}
    on:change={onHandleTypeChange}
    options={allowedTypes}
    getOptionLabel={field => field.name}
    getOptionValue={field => field.fieldId}
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
      <div class="tooltip-alignment">
        <Label size="M">Formatting</Label>
        <AbsTooltip
          position="top"
          type="info"
          text={"Rich text includes support for images, link"}
        >
          <Icon size="XS" name="InfoOutline" />
        </AbsTooltip>
      </div>

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
    {#if datasource?.source !== SourceName.ORACLE && datasource?.source !== SourceName.SQL_SERVER && !editableColumn.dateOnly}
      <div>
        <div class="row">
          <Label>Time zones</Label>
          <AbsTooltip
            position="top"
            type="info"
            text={isCreating
              ? null
              : "We recommend not changing how timezones are handled for existing columns, as existing data will not be updated"}
          >
            <Icon size="XS" name="InfoOutline" />
          </AbsTooltip>
        </div>
        <Toggle
          bind:value={editableColumn.ignoreTimezones}
          text="Ignore time zones"
        />
      </div>
    {/if}
    <Toggle bind:value={editableColumn.dateOnly} text="Date only" />
  {:else if editableColumn.type === "number" && !editableColumn.autocolumn}
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Min Value</Label>
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
    <RelationshipSelector
      bind:relationshipPart1
      bind:relationshipPart2
      bind:relationshipTableIdPrimary
      bind:relationshipTableIdSecondary
      bind:editableColumn
      {relationshipOpts1}
      {relationshipOpts2}
      {linkEditDisabled}
      {tableOptions}
      {errors}
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
            disabled={!isCreating}
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
  {:else if isUsersColumn(editableColumn) && datasource?.source !== SourceName.GOOGLE_SHEETS}
    <Toggle
      value={editableColumn.subtype === FieldSubtype.USERS}
      on:change={e =>
        handleTypeChange(
          makeFieldId(
            FieldType.BB_REFERENCE,
            e.detail ? FieldSubtype.USERS : FieldSubtype.USER
          )
        )}
      disabled={!isCreating}
      thin
      text="Allow multiple users"
    />
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
  .tooltip-alignment {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  .label-length {
    flex-basis: 40%;
  }
  .input-length {
    flex-grow: 1;
  }
  .row {
    gap: 8px;
    display: flex;
  }
</style>
