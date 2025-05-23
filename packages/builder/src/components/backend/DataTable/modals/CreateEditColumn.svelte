<script lang="ts">
  import {
    AbsTooltip,
    Button,
    DatePicker,
    Icon,
    Input,
    Label,
    Layout,
    Modal,
    Multiselect,
    notifications,
    ProgressCircle,
    Select,
    Toggle,
    TooltipPosition,
    TooltipType,
  } from "@budibase/bbui"
  import {
    canHaveDefaultColumn,
    helpers,
    PROTECTED_EXTERNAL_COLUMNS,
    PROTECTED_INTERNAL_COLUMNS,
    SWITCHABLE_TYPES,
    ValidColumnNameRegex,
  } from "@budibase/shared-core"
  import { makePropSafe } from "@budibase/string-templates"
  import { createEventDispatcher, getContext, onMount } from "svelte"
  import { cloneDeep } from "lodash/fp"
  import { datasources, tables } from "@/stores/builder"
  import { TableNames, UNEDITABLE_USER_FIELDS } from "@/constants"
  import {
    DB_TYPE_EXTERNAL,
    FIELDS,
    PrettyRelationshipDefinitions,
    RelationshipType,
  } from "@/constants/backend"
  import { buildAutoColumn, getAutoColumnInformation } from "@/helpers/utils"
  import ConfirmDialog from "@/components/common/ConfirmDialog.svelte"
  import AIFieldConfiguration from "@/components/common/AIFieldConfiguration.svelte"
  import ModalBindableInput from "@/components/common/bindings/ModalBindableInput.svelte"
  import { getBindings } from "@/components/backend/DataTable/formula"
  import JSONSchemaModal from "./JSONSchemaModal.svelte"
  import {
    BBReferenceFieldSubType,
    FieldType,
    FormulaType,
    SourceName,
  } from "@budibase/types"
  import RelationshipSelector from "@/components/common/RelationshipSelector.svelte"
  import { canBeDisplayColumn, RowUtils } from "@budibase/frontend-core"
  import ServerBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import OptionsEditor from "./OptionsEditor.svelte"
  import { getUserBindings } from "@/dataBinding"
  import type {
    Table,
    Datasource,
    FieldSchema,
    UIField,
    AutoFieldSubType,
    FormulaResponseType,
    FieldSchemaConfig,
  } from "@budibase/types"

  export let field: FieldSchema

  const dispatch = createEventDispatcher()
  const { dispatch: gridDispatch, rows } = getContext("grid") as any
  const SafeID = `${makePropSafe("user")}.${makePropSafe("_id")}`
  const SingleUserDefault = `{{ ${SafeID} }}`
  const MultiUserDefault = `{{ js "${btoa(`return [$("${SafeID}")]`)}" }}`

  let mounted = false
  let originalName: string | undefined
  let linkEditDisabled: boolean = false
  let hasPrimaryDisplay: boolean
  let isCreating: boolean | undefined
  let relationshipPart1 = PrettyRelationshipDefinitions.MANY
  let relationshipPart2 = PrettyRelationshipDefinitions.ONE
  let relationshipTableIdPrimary: string | undefined
  let relationshipTableIdSecondary: string | undefined
  let table: Table | undefined = $tables.selected
  let confirmDeleteDialog: any
  let savingColumn: boolean
  let deleteColName: string | undefined
  let jsonSchemaModal: any
  let editableColumn: FieldSchemaConfig = {
    type: FieldType.STRING,
    constraints: FIELDS.STRING.constraints as any,
    name: "",
    // Initial value for column name in other table for linked records
    fieldName: $tables.selected?.name || "",
  }
  let relationshipOpts1 = Object.values(PrettyRelationshipDefinitions)
  let relationshipOpts2 = Object.values(PrettyRelationshipDefinitions)
  const relationshipMap = {
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
  const autoColumnInfo = getAutoColumnInformation()
  let optionsValid = true

  // a fixed order for the types to stop them moving around
  // we've never really guaranteed an order to these, which means that
  // they can move around very easily
  const fixedTypeOrder = [
    FIELDS.STRING,
    FIELDS.NUMBER,
    FIELDS.OPTIONS,
    FIELDS.ARRAY,
    FIELDS.BOOLEAN,
    FIELDS.DATETIME,
    FIELDS.LINK,
    FIELDS.AI,
    FIELDS.LONGFORM,
    FIELDS.USER,
    FIELDS.USERS,
    FIELDS.ATTACHMENT_SINGLE,
    FIELDS.ATTACHMENTS,
    FIELDS.FORMULA,
    FIELDS.JSON,
    FIELDS.BARCODEQR,
    FIELDS.SIGNATURE_SINGLE,
    FIELDS.BIGINT,
    FIELDS.AUTO,
  ]

  $: rowGoldenSample = RowUtils.generateGoldenSample($rows)
  $: if (hasPrimaryDisplay && editableColumn.constraints) {
    editableColumn.constraints.presence = { allowEmpty: false }
  }
  $: {
    // this parses any changes the user has made when creating a new internal relationship
    // into what we expect the schema to look like
    if (editableColumn.type === FieldType.LINK) {
      relationshipTableIdPrimary = table?._id
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
      )?.[0] as RelationshipType
      if (relationshipTableIdSecondary) {
        // Set the tableId based on the selected table
        editableColumn.tableId = relationshipTableIdSecondary
      }
    }
  }
  $: initialiseField(field, savingColumn)
  $: checkConstraints(editableColumn)
  $: required =
    hasPrimaryDisplay ||
    editableColumn?.constraints?.presence === true ||
    (editableColumn?.constraints?.presence as any)?.allowEmpty === false
  $: uneditable =
    $tables.selected?._id === TableNames.USERS &&
    UNEDITABLE_USER_FIELDS.includes(editableColumn.name || "")
  $: invalid =
    !editableColumn?.name ||
    (editableColumn?.type === FieldType.LINK && !editableColumn?.tableId) ||
    Object.keys(errors || {}).length !== 0 ||
    !optionsValid
  $: errors = checkErrors(editableColumn)
  $: datasource = $datasources.list.find(
    source => source._id === table?.sourceId
  ) as Datasource | undefined
  $: tableAutoColumnsTypes = getTableAutoColumnTypes($tables?.selected)
  $: availableAutoColumns = Object.keys(autoColumnInfo).reduce(
    (acc: Record<string, { enabled: boolean; name: string }>, key: string) => {
      if (!tableAutoColumnsTypes.includes(key)) {
        const subtypeKey = key as AutoFieldSubType
        if (autoColumnInfo[subtypeKey]) {
          acc[key] = autoColumnInfo[subtypeKey]
        }
      }
      return acc
    },
    {}
  )
  $: availableAutoColumnKeys = availableAutoColumns
    ? Object.keys(availableAutoColumns)
    : []
  $: autoColumnOptions = editableColumn.autocolumn
    ? autoColumnInfo
    : availableAutoColumns
  // used to select what different options can be displayed for column type
  $: canBeDisplay =
    canBeDisplayColumn(editableColumn) && !editableColumn.autocolumn
  $: canHaveDefault = !required && canHaveDefaultColumn(editableColumn.type)
  $: canBeRequired =
    editableColumn?.type !== FieldType.LINK &&
    !uneditable &&
    editableColumn?.type !== FieldType.AUTO &&
    !editableColumn.autocolumn
  $: hasDefault =
    editableColumn?.default != null && editableColumn?.default !== ""
  $: isExternalTable = table?.sourceType === DB_TYPE_EXTERNAL
  // in the case of internal tables the sourceId will just be undefined
  $: tableOptions = $tables.list.filter(
    opt =>
      opt.sourceType === table?.sourceType && table.sourceId === opt.sourceId
  )
  $: typeEnabled =
    !originalName ||
    (originalName &&
      SWITCHABLE_TYPES[field.type] &&
      !editableColumn?.autocolumn)
  $: allowedTypes = getAllowedTypes(datasource, table)
  $: orderedAllowedTypes = fixedTypeOrder
    .filter(ordered =>
      allowedTypes.find(allowed => allowed.type === ordered.type)
    )
    .map(t => ({
      fieldId: makeFieldId(t.type, t.subtype),
      ...t,
    }))
  $: defaultValueBindings = [
    {
      type: "context",
      runtimeBinding: `${makePropSafe("now")}`,
      readableBinding: `Date`,
      category: "Date",
      icon: "Date",
      display: {
        name: "Server date",
      },
    },
    ...getUserBindings(),
  ]
  $: sanitiseDefaultValue(
    editableColumn.type,
    editableColumn.constraints?.inclusion || [],
    editableColumn.default
  )

  const allTableFields = [
    FIELDS.STRING,
    FIELDS.NUMBER,
    FIELDS.OPTIONS,
    FIELDS.ARRAY,
    FIELDS.BOOLEAN,
    FIELDS.DATETIME,
    FIELDS.LINK,
    FIELDS.LONGFORM,
    FIELDS.FORMULA,
    FIELDS.BARCODEQR,
    FIELDS.BIGINT,
  ]

  const fieldDefinitions: Record<string, UIField> = Object.values(
    FIELDS
  ).reduce(
    // Storing the fields by complex field id
    (acc, field) => ({
      ...acc,
      [makeFieldId(field.type, field.subtype)]: field,
    }),
    {}
  )

  function makeFieldId(type: string, subtype?: string, autocolumn?: boolean) {
    // don't make field IDs for auto types
    if (type === FieldType.AUTO || autocolumn) {
      return type.toUpperCase()
    } else if (
      type === FieldType.BB_REFERENCE ||
      type === FieldType.BB_REFERENCE_SINGLE
    ) {
      return `${type}${subtype || ""}`.toUpperCase()
    } else {
      return type.toUpperCase()
    }
  }

  const initialiseField = (
    field: FieldSchema | undefined,
    savingColumn: boolean
  ) => {
    isCreating = !field
    if (field && !savingColumn) {
      editableColumn = cloneDeep(field) as FieldSchemaConfig
      originalName = editableColumn.name ? editableColumn.name + "" : undefined
      linkEditDisabled = originalName != null
      hasPrimaryDisplay =
        $tables.selected?.primaryDisplay == null ||
        $tables.selected?.primaryDisplay === editableColumn.name

      // Here we are setting the relationship values based on the editableColumn
      // This part of the code is used when viewing an existing field hence the check
      // for the tableId
      if (editableColumn.type === FieldType.LINK && editableColumn.tableId) {
        relationshipTableIdPrimary = table?._id
        relationshipTableIdSecondary = editableColumn.tableId
        if (
          editableColumn.relationshipType &&
          editableColumn.relationshipType in relationshipMap
        ) {
          const { part1, part2 } =
            relationshipMap[editableColumn.relationshipType]
          relationshipPart1 = part1
          relationshipPart2 = part2
        }
      }
    }

    if (!savingColumn) {
      editableColumn.fieldId = makeFieldId(
        editableColumn.type,
        editableColumn.subtype,
        editableColumn.autocolumn
      )
    }
  }

  const getTableAutoColumnTypes = (table: Table | undefined) => {
    return Object.keys(table?.schema || {}).reduce(
      (acc: string[], key: string) => {
        let fieldSchema = table?.schema[key]
        if (fieldSchema?.autocolumn && fieldSchema?.subtype) {
          acc.push(fieldSchema.subtype)
        }
        return acc
      },
      []
    )
  }

  async function saveColumn() {
    if (Object.keys(errors || {}).length) {
      return
    }

    savingColumn = true
    let saveColumn = cloneDeep(editableColumn)

    delete saveColumn.fieldId

    if (
      $tables.selected &&
      saveColumn.name &&
      saveColumn.type === FieldType.AUTO
    ) {
      saveColumn = buildAutoColumn(
        $tables.selected.name,
        saveColumn.name,
        saveColumn.subtype as AutoFieldSubType
      ) as FieldSchemaConfig
    }
    if ("fieldName" in saveColumn && saveColumn.type !== FieldType.LINK) {
      delete saveColumn.fieldName
    }

    // Ensure we don't have a default value if we can't have one
    if (!canHaveDefault) {
      delete saveColumn.default
    }

    // Ensure primary display columns are always required and don't have default values
    if (hasPrimaryDisplay) {
      saveColumn.constraints!.presence = { allowEmpty: false }
      delete saveColumn.default
    }

    // Ensure the field is not required if we have a default value
    if (saveColumn.default) {
      saveColumn.constraints!.presence = false
    }

    try {
      await tables.saveField({
        originalName,
        field: saveColumn as FieldSchema,
        hasPrimaryDisplay,
      })
      dispatch("updatecolumns")
      gridDispatch("close-edit-column")

      if (originalName) {
        notifications.success("Column updated successfully")
      } else {
        notifications.success("Column created successfully")
      }
    } catch (err: any) {
      notifications.error(`Error saving column: ${err.message}`)
    } finally {
      savingColumn = false
    }
  }

  function cancelEdit() {
    if (originalName) {
      editableColumn.name = originalName
    }
    gridDispatch("close-edit-column")
  }

  async function deleteColumn() {
    try {
      if (deleteColName) {
        editableColumn.name = deleteColName
      }
      if (editableColumn.name === $tables.selected?.primaryDisplay) {
        notifications.error("You cannot delete the display column")
      } else {
        await tables.deleteField({ name: editableColumn.name! })
        notifications.success(`Column ${editableColumn.name} deleted`)
        confirmDeleteDialog.hide()
        dispatch("updatecolumns")
        gridDispatch("close-edit-column")
      }
    } catch (error: any) {
      notifications.error(`Error deleting column: ${error.message}`)
    }
  }

  function onHandleTypeChange(event: any) {
    handleTypeChange(event.detail)
  }

  function handleTypeChange(type?: string) {
    // remove any extra fields that may not be related to this type
    const columnsToClear = [
      "autocolumn",
      "subtype",
      "tableId",
      "relationshipType",
      "formulaType",
      "responseType",
    ]
    for (let column of columnsToClear) {
      if (column in editableColumn) {
        delete editableColumn[column as keyof FieldSchema]
      }
    }
    editableColumn.constraints = {}

    // Add in defaults and initial definition
    const definition = fieldDefinitions[type?.toUpperCase() || ""]
    if (definition?.constraints) {
      editableColumn.constraints = cloneDeep(definition.constraints)
    }

    editableColumn.type = definition.type
    if (definition.subtype) {
      // @ts-expect-error the setting of sub-type here doesn't fit our definition with
      // FieldSchema, there is no type checking, it simply sets it if it is provided
      editableColumn.subtype = definition.subtype
    }

    // Default relationships many to many
    if (editableColumn.type === FieldType.LINK) {
      editableColumn.relationshipType = RelationshipType.MANY_TO_MANY
    } else if (editableColumn.type === FieldType.FORMULA) {
      editableColumn.formulaType = FormulaType.DYNAMIC
      editableColumn.responseType =
        field && "responseType" in field
          ? field.responseType
          : (FIELDS.STRING.type as FormulaResponseType)
    }
  }

  function setRequired(req: boolean) {
    editableColumn.constraints!.presence = req ? { allowEmpty: false } : false
    required = req
  }

  function onChangeRequired(e: any) {
    setRequired(e.detail)
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

  function getAllowedTypes(
    datasource: Datasource | undefined,
    table: Table | undefined
  ): UIField[] {
    const isSqlTable = table?.sql
    const isGoogleSheet =
      table?.sourceType === DB_TYPE_EXTERNAL &&
      datasource?.source === SourceName.GOOGLE_SHEETS
    if (originalName) {
      let possibleTypes = SWITCHABLE_TYPES[field.type] || [editableColumn.type]
      if (
        helpers.schema.isDeprecatedSingleUserColumn(
          editableColumn as FieldSchema
        )
      ) {
        // This will handle old single users columns
        return [
          {
            ...FIELDS.USER,
            type: FieldType.BB_REFERENCE,
            subtype: BBReferenceFieldSubType.USER,
          },
        ]
      } else if (
        editableColumn.type === FieldType.BB_REFERENCE &&
        editableColumn.subtype === BBReferenceFieldSubType.USERS
      ) {
        // This will handle old multi users columns
        return [
          {
            ...FIELDS.USERS,
            subtype: BBReferenceFieldSubType.USERS,
          },
        ]
      }

      return Object.entries(FIELDS)
        .filter(([_, field]) => possibleTypes.includes(field.type))
        .map(([_, fieldDefinition]) => fieldDefinition)
    }

    if (!isExternalTable) {
      const fields = [
        ...allTableFields,
        FIELDS.USER,
        FIELDS.USERS,
        FIELDS.ATTACHMENT_SINGLE,
        FIELDS.ATTACHMENTS,
        FIELDS.SIGNATURE_SINGLE,
        FIELDS.JSON,
        FIELDS.AUTO,
        FIELDS.AI,
      ]
      return fields
    }
    if (isExternalTable && isSqlTable) {
      return [
        ...allTableFields,
        FIELDS.USER,
        FIELDS.USERS,
        FIELDS.ATTACHMENT_SINGLE,
        FIELDS.ATTACHMENTS,
        FIELDS.SIGNATURE_SINGLE,
      ]
    } else if (isExternalTable && isGoogleSheet) {
      // google-sheets supports minimum set (no attachments or user references)
      return allTableFields
    } else if (isExternalTable && !isSqlTable) {
      // filter out SQL-specific types for non-SQL datasources
      return allTableFields.filter(x => x !== FIELDS.LINK && x !== FIELDS.ARRAY)
    }

    throw new Error("No valid allowed types found")
  }

  function checkConstraints(fieldToCheck: FieldSchema) {
    if (!fieldToCheck) {
      return
    }

    // most types need this, just make sure its always present
    if (!fieldToCheck.constraints) {
      fieldToCheck.constraints = {}
    }
    // some string types may have been built by server, may not always have constraints
    if (
      fieldToCheck.type === FieldType.STRING &&
      !fieldToCheck.constraints.length
    ) {
      fieldToCheck.constraints.length = {}
    }
    // some number types made server-side will be missing constraints
    if (
      fieldToCheck.type === FieldType.NUMBER &&
      !fieldToCheck.constraints.numericality
    ) {
      fieldToCheck.constraints.numericality = {}
    }
    if (
      fieldToCheck.type === FieldType.DATETIME &&
      !fieldToCheck.constraints.datetime
    ) {
      fieldToCheck.constraints.datetime = {}
    }
  }

  function checkErrors(fieldInfo: FieldSchema) {
    if (!editableColumn) {
      return
    }
    function inUse(tbl?: Table, column?: string, ogName?: string) {
      const parsedColumn = column ? column.toLowerCase().trim() : column

      return Object.keys(tbl?.schema || {}).some(key => {
        let lowerKey = key.toLowerCase()
        return lowerKey !== ogName?.toLowerCase() && lowerKey === parsedColumn
      })
    }
    const newError: { name?: string; subtype?: string; relatedName?: string } =
      {}
    const prohibited = isExternalTable
      ? PROTECTED_EXTERNAL_COLUMNS
      : PROTECTED_INTERNAL_COLUMNS
    if (!isExternalTable && fieldInfo.name?.startsWith("_")) {
      newError.name = `Column name cannot start with an underscore.`
    } else if (fieldInfo.name && !fieldInfo.name.match(ValidColumnNameRegex)) {
      newError.name = `Illegal character; must be alpha-numeric.`
    } else if (prohibited.some(name => fieldInfo?.name === name)) {
      newError.name = `${prohibited.join(
        ", "
      )} are not allowed as column names - case insensitive.`
    } else if (inUse($tables.selected, fieldInfo.name, originalName)) {
      newError.name = `Column name already in use.`
    }

    if (fieldInfo.type === FieldType.AUTO && !fieldInfo.subtype) {
      newError.subtype = `Auto Column requires a type.`
    }

    if (
      fieldInfo.type === FieldType.LINK &&
      fieldInfo.fieldName &&
      fieldInfo.tableId
    ) {
      const relatedTable = $tables.list.find(
        tbl => tbl._id === fieldInfo.tableId
      )
      if (inUse(relatedTable, fieldInfo.fieldName) && !originalName) {
        newError.relatedName = `Column name already in use in table ${relatedTable?.name}`
      }
    }
    return newError
  }

  const sanitiseDefaultValue = (
    type: FieldType,
    options: string[],
    defaultValue?: string[] | string
  ) => {
    if (!defaultValue?.length) {
      return
    }
    // Delete default value for options fields if the option is no longer available
    if (
      type === FieldType.OPTIONS &&
      typeof defaultValue === "string" &&
      !options.includes(defaultValue)
    ) {
      delete editableColumn.default
    }
    // Filter array default values to only valid options
    if (type === FieldType.ARRAY && Array.isArray(defaultValue)) {
      editableColumn.default = defaultValue.filter(x => options.includes(x))
    }
  }

  function handleNameInput(evt: any) {
    if (
      !uneditable &&
      !(linkEditDisabled && editableColumn.type === FieldType.LINK)
    ) {
      editableColumn.name = evt.target.value
    }
  }

  onMount(() => {
    mounted = true
  })
</script>

<Layout noPadding gap="S">
  {#if mounted}
    <Input
      value={editableColumn.name}
      autofocus
      on:input={handleNameInput}
      disabled={uneditable ||
        (linkEditDisabled && editableColumn.type === FieldType.LINK)}
      error={errors?.name}
    />
  {/if}
  <Select
    placeholder={undefined}
    disabled={!typeEnabled}
    bind:value={editableColumn.fieldId}
    on:change={onHandleTypeChange}
    options={orderedAllowedTypes}
    getOptionLabel={field => field.name}
    getOptionValue={field => field.fieldId}
    getOptionIcon={field => field.icon}
    isOptionEnabled={option => {
      if (option.type === FieldType.AUTO) {
        return availableAutoColumnKeys?.length > 0
      }
      return true
    }}
  />

  {#if editableColumn.type === FieldType.STRING && editableColumn.constraints.length}
    <Input
      type="number"
      label="Max Length"
      bind:value={editableColumn.constraints.length.maximum}
    />
  {:else if editableColumn.type === FieldType.OPTIONS}
    <OptionsEditor
      bind:constraints={editableColumn.constraints}
      bind:optionColors={editableColumn.optionColors}
      bind:valid={optionsValid}
    />
  {:else if editableColumn.type === FieldType.LONGFORM}
    <div>
      <div class="tooltip-alignment">
        <Label size="M">Formatting</Label>
        <AbsTooltip
          position={TooltipPosition.Top}
          type={TooltipType.Info}
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
  {:else if editableColumn.type === FieldType.ARRAY}
    <OptionsEditor
      bind:constraints={editableColumn.constraints}
      bind:optionColors={editableColumn.optionColors}
      bind:valid={optionsValid}
    />
  {:else if editableColumn.type === FieldType.DATETIME && !editableColumn.autocolumn}
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Earliest</Label>
      </div>
      {#if editableColumn.constraints.datetime}
        <div class="input-length">
          <DatePicker
            bind:value={editableColumn.constraints.datetime.earliest}
            enableTime={!editableColumn.dateOnly}
            timeOnly={editableColumn.timeOnly}
          />
        </div>
      {/if}
    </div>

    <div class="split-label">
      <div class="label-length">
        <Label size="M">Latest</Label>
      </div>
      {#if editableColumn.constraints.datetime}
        <div class="input-length">
          <DatePicker
            bind:value={editableColumn.constraints.datetime.latest}
            enableTime={!editableColumn.dateOnly}
            timeOnly={editableColumn.timeOnly}
          />
        </div>
      {/if}
    </div>
    {#if !editableColumn.timeOnly}
      {#if datasource?.source !== SourceName.ORACLE && datasource?.source !== SourceName.SQL_SERVER && !editableColumn.dateOnly}
        <div>
          <div class="row">
            <Label>Time zones</Label>
            <AbsTooltip
              position={TooltipPosition.Top}
              type={TooltipType.Info}
              text={isCreating
                ? undefined
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
    {/if}
  {:else if editableColumn.type === FieldType.NUMBER && !editableColumn.autocolumn}
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Min Value</Label>
      </div>
      {#if editableColumn.constraints.numericality}
        <div class="input-length">
          <Input
            type="number"
            bind:value={
              editableColumn.constraints.numericality.greaterThanOrEqualTo
            }
          />
        </div>
      {/if}
    </div>

    <div class="split-label">
      <div class="label-length">
        <Label size="M">Max Value</Label>
      </div>
      {#if editableColumn.constraints.numericality}
        <div class="input-length">
          <Input
            type="number"
            bind:value={
              editableColumn.constraints.numericality.lessThanOrEqualTo
            }
          />
        </div>
      {/if}
    </div>
  {:else if editableColumn.type === FieldType.LINK && !editableColumn.autocolumn}
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
  {:else if editableColumn.type === FieldType.FORMULA}
    {#if !isExternalTable}
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
        <Label size="M">Response Type</Label>
      </div>
      <div class="input-length">
        <Select
          bind:value={editableColumn.responseType}
          options={[
            FIELDS.STRING,
            FIELDS.NUMBER,
            FIELDS.BOOLEAN,
            FIELDS.DATETIME,
          ]}
          getOptionLabel={option => option.name}
          getOptionValue={option => option.type}
          tooltip="Formulas by default will return a string - however if you need another type the response can be coerced."
        />
      </div>
    </div>
    <div class="split-label">
      <div class="label-length">
        <Label size="M">Formula</Label>
      </div>
      <div class="input-length">
        <ModalBindableInput
          panel={ServerBindingPanel}
          title="Formula"
          value={editableColumn.formula}
          on:change={e => {
            if (editableColumn.type === FieldType.FORMULA) {
              editableColumn = {
                ...editableColumn,
                formula: e.detail,
              }
            }
          }}
          bindings={getBindings({ table })}
          allowJS
          context={rowGoldenSample}
        />
      </div>
    </div>
  {:else if editableColumn.type === FieldType.AI && table}
    <AIFieldConfiguration
      aiField={editableColumn}
      context={rowGoldenSample}
      bindings={getBindings({ table })}
      schema={table.schema}
    />
  {:else if editableColumn.type === FieldType.JSON}
    <Button primary on:click={openJsonSchemaEditor}>Open schema editor</Button>
  {/if}
  {#if editableColumn.type === FieldType.AUTO || editableColumn.autocolumn}
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
          disabled={hasPrimaryDisplay || hasDefault}
          text="Required"
        />
      {/if}
    </div>
  {/if}

  {#if editableColumn.type === FieldType.OPTIONS}
    <Select
      disabled={!canHaveDefault}
      options={editableColumn.constraints?.inclusion || []}
      label="Default value"
      value={editableColumn.default}
      on:change={e => (editableColumn.default = e.detail)}
      placeholder="None"
    />
  {:else if editableColumn.type === FieldType.ARRAY}
    <Multiselect
      disabled={!canHaveDefault}
      options={editableColumn.constraints?.inclusion || []}
      label="Default value"
      value={editableColumn.default}
      on:change={e =>
        (editableColumn.default = e.detail?.length ? e.detail : undefined)}
      placeholder="None"
    />
  {:else if editableColumn.subtype === BBReferenceFieldSubType.USER}
    {@const defaultValue =
      editableColumn.type === FieldType.BB_REFERENCE_SINGLE
        ? SingleUserDefault
        : MultiUserDefault}
    <Toggle
      disabled={!canHaveDefault}
      text="Default to current user"
      value={editableColumn.default === defaultValue}
      on:change={e =>
        (editableColumn.default = e.detail ? defaultValue : undefined)}
    />
  {:else}
    <ModalBindableInput
      disabled={!canHaveDefault}
      panel={ServerBindingPanel}
      title="Default value"
      label="Default value"
      placeholder="None"
      value={editableColumn.default}
      on:change={e => (editableColumn.default = e.detail)}
      bindings={defaultValueBindings}
      allowJS
    />
  {/if}
</Layout>

<div class="action-buttons">
  {#if !uneditable && originalName != null}
    <Button quiet warning on:click={confirmDelete}>Delete</Button>
  {/if}
  <Button secondary newStyles on:click={cancelEdit}>Cancel</Button>
  <Button
    disabled={invalid || savingColumn}
    newStyles
    cta
    on:click={saveColumn}
  >
    {#if savingColumn}
      <div class="save-loading">
        <ProgressCircle overBackground={true} size="S" />
      </div>
    {:else}
      Save
    {/if}
  </Button>
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Column"
  onOk={deleteColumn}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion"
  disabled={deleteColName !== originalName}
>
  <p>
    Are you sure you wish to delete the column
    <b on:click={() => (deleteColName = originalName)}>{originalName}?</b>
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
  b {
    transition: color 130ms ease-out;
  }
  b:hover {
    cursor: pointer;
    color: var(--spectrum-global-color-gray-900);
  }

  .save-loading {
    display: flex;
    justify-content: center;
  }
</style>
