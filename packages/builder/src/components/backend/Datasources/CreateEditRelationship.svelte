<script>
  import { RelationshipTypes } from "constants/backend"
  import {
    Button,
    Input,
    ModalContent,
    Select,
    Detail,
    Body,
  } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import { Helpers } from "@budibase/bbui"

  export let save
  export let datasource
  export let plusTables = []
  export let fromRelationship = {}
  export let toRelationship = {}
  export let close

  const colNotSet = "Please specify a column name"
  const relationshipTypes = [
    {
      label: "One to Many",
      value: RelationshipTypes.MANY_TO_ONE,
    },
    {
      label: "Many to Many",
      value: RelationshipTypes.MANY_TO_MANY,
    },
  ]

  let originalFromColumnName = toRelationship.name,
    originalToColumnName = fromRelationship.name
  let originalFromTable = plusTables.find(
    table => table._id === toRelationship?.tableId
  )
  let originalToTable = plusTables.find(
    table => table._id === fromRelationship?.tableId
  )

  let tableOptions
  let errors = {}
  let hasClickedSave = !!fromRelationship.relationshipType
  let fromPrimary,
    fromForeign,
    fromTable,
    toTable,
    throughTable,
    fromColumn,
    toColumn
  let fromId, toId, throughId, throughToKey, throughFromKey
  let isManyToMany, isManyToOne, relationshipType

  $: {
    if (!fromPrimary) {
      fromPrimary = fromRelationship.foreignKey
      fromForeign = toRelationship.foreignKey
    }
    if (!fromColumn && !errors.fromColumn) {
      fromColumn = toRelationship.name
    }
    if (!toColumn && !errors.toColumn) {
      toColumn = fromRelationship.name
    }
    if (!fromId) {
      fromId = toRelationship.tableId
    }
    if (!toId) {
      toId = fromRelationship.tableId
    }
    if (!throughId) {
      throughId = fromRelationship.through
      throughFromKey = fromRelationship.throughFrom
      throughToKey = fromRelationship.throughTo
    }
    if (!relationshipType) {
      relationshipType = fromRelationship.relationshipType
    }
  }

  $: tableOptions = plusTables.map(table => ({
    label: table.name,
    value: table._id,
  }))
  $: valid = getErrorCount(errors) === 0 || !hasClickedSave

  $: isManyToMany = relationshipType === RelationshipTypes.MANY_TO_MANY
  $: isManyToOne = relationshipType === RelationshipTypes.MANY_TO_ONE
  $: fromTable = plusTables.find(table => table._id === fromId)
  $: toTable = plusTables.find(table => table._id === toId)
  $: throughTable = plusTables.find(table => table._id === throughId)

  $: toRelationship.relationshipType = fromRelationship?.relationshipType

  const getErrorCount = errors =>
    Object.entries(errors)
      .filter(entry => !!entry[1])
      .map(entry => entry[0]).length

  function invalidThroughTable() {
    // need to know the foreign key columns to check error
    if (!throughId || !throughToKey || !throughFromKey) {
      return false
    }
    const throughTbl = plusTables.find(tbl => tbl._id === throughId)
    const otherColumns = Object.values(throughTbl.schema).filter(
      col => col.name !== throughFromKey && col.name !== throughToKey
    )
    for (let col of otherColumns) {
      if (col.constraints?.presence && !col.autocolumn) {
        return true
      }
    }
    return false
  }

  function validate() {
    const isMany = relationshipType === RelationshipTypes.MANY_TO_MANY
    const tableNotSet = "Please specify a table"
    const foreignKeyNotSet = "Please pick a foreign key"
    const errObj = {}
    if (!relationshipType) {
      errObj.relationshipType = "Please specify a relationship type"
    }
    if (!fromTable) {
      errObj.fromTable = tableNotSet
    }
    if (!toTable) {
      errObj.toTable = tableNotSet
    }
    if (isMany && !throughTable) {
      errObj.throughTable = tableNotSet
    }
    if (isMany && !throughFromKey) {
      errObj.throughFromKey = foreignKeyNotSet
    }
    if (isMany && !throughToKey) {
      errObj.throughToKey = foreignKeyNotSet
    }
    if (invalidThroughTable()) {
      errObj.throughTable =
        "Ensure non-key columns are nullable or auto-generated"
    }
    if (!isMany && !fromForeign) {
      errObj.fromForeign = foreignKeyNotSet
    }
    if (!fromColumn) {
      errObj.fromColumn = colNotSet
    }
    if (!toColumn) {
      errObj.toColumn = colNotSet
    }
    if (!isMany && !fromPrimary) {
      errObj.fromPrimary = "Please pick the primary key"
    }

    // currently don't support relationships back onto the table itself, needs to relate out
    const tableError = "From/to/through tables must be different"
    if (fromTable && (fromTable === toTable || fromTable === throughTable)) {
      errObj.fromTable = tableError
    }
    if (toTable && (toTable === fromTable || toTable === throughTable)) {
      errObj.toTable = tableError
    }
    if (
      throughTable &&
      (throughTable === fromTable || throughTable === toTable)
    ) {
      errObj.throughTable = tableError
    }
    const colError = "Column name cannot be an existing column"
    if (isColumnNameBeingUsed(toTable, fromColumn, originalFromColumnName)) {
      errObj.fromColumn = colError
    }
    if (isColumnNameBeingUsed(fromTable, toColumn, originalToColumnName)) {
      errObj.toColumn = colError
    }

    let fromType, toType
    if (fromPrimary && fromForeign) {
      fromType = fromTable?.schema[fromPrimary]?.type
      toType = toTable?.schema[fromForeign]?.type
    }
    if (fromType && toType && fromType !== toType) {
      errObj.fromForeign =
        "Column type of the foreign key must match the primary key"
    }

    errors = errObj
    return getErrorCount(errors) === 0
  }

  function isColumnNameBeingUsed(table, columnName, originalName) {
    if (!table || !columnName || columnName === originalName) {
      return false
    }
    const keys = Object.keys(table.schema).map(key => key.toLowerCase())
    return keys.indexOf(columnName.toLowerCase()) !== -1
  }

  function buildRelationships() {
    const id = Helpers.uuid()
    //Map temporary variables
    let relateFrom = {
      ...fromRelationship,
      tableId: toId,
      name: toColumn,
      relationshipType,
      fieldName: fromForeign,
      through: throughId,
      throughFrom: throughFromKey,
      throughTo: throughToKey,
      type: "link",
      main: true,
      _id: id,
    }
    let relateTo = (toRelationship = {
      ...toRelationship,
      tableId: fromId,
      name: fromColumn,
      through: throughId,
      type: "link",
      _id: id,
    })

    // if any to many only need to check from
    const manyToMany =
      relateFrom.relationshipType === RelationshipTypes.MANY_TO_MANY

    if (!manyToMany) {
      delete relateFrom.through
      delete relateTo.through
    }

    // [0] is because we don't support composite keys for relationships right now
    if (manyToMany) {
      relateFrom = {
        ...relateFrom,
        through: throughTable._id,
        fieldName: toTable.primary[0],
      }
      relateTo = {
        ...relateTo,
        through: throughTable._id,
        fieldName: fromTable.primary[0],
        throughFrom: relateFrom.throughTo,
        throughTo: relateFrom.throughFrom,
      }
    } else {
      // the relateFrom.fieldName should remain the same, as it is the foreignKey in the other
      // table, this is due to the way that budibase represents relationships, the fieldName in a
      // link column schema is the column linked to (FK in this case). The foreignKey column is
      // essentially what is linked to in the from table, this is unique to SQL as this isn't a feature
      // of Budibase internal tables.
      // Essentially this means the fieldName is what we are linking to in the other table, and the
      // foreignKey is what is linking out of the current table.
      relateFrom = {
        ...relateFrom,
        foreignKey: fromPrimary,
      }
      relateTo = {
        ...relateTo,
        relationshipType: RelationshipTypes.ONE_TO_MANY,
        foreignKey: relateFrom.fieldName,
        fieldName: fromPrimary,
      }
    }

    fromRelationship = relateFrom
    toRelationship = relateTo
  }

  function removeExistingRelationship() {
    if (originalFromTable && originalFromColumnName) {
      delete datasource.entities[originalFromTable.name].schema[
        originalToColumnName
      ]
    }
    if (originalToTable && originalToColumnName) {
      delete datasource.entities[originalToTable.name].schema[
        originalFromColumnName
      ]
    }
  }

  async function saveRelationship() {
    hasClickedSave = true
    if (!validate()) {
      return false
    }
    buildRelationships()
    removeExistingRelationship()

    // source of relationship
    datasource.entities[fromTable.name].schema[fromRelationship.name] =
      fromRelationship
    // save other side of relationship in the other schema
    datasource.entities[toTable.name].schema[toRelationship.name] =
      toRelationship

    await save()
  }
  async function deleteRelationship() {
    removeExistingRelationship()
    await save()
    await tables.fetch()
    close()
  }
</script>

<ModalContent
  title="Define Relationship"
  confirmText="Save"
  onConfirm={saveRelationship}
  disabled={!valid}
>
  <Select
    label="Relationship type"
    options={relationshipTypes}
    bind:value={relationshipType}
    bind:error={errors.relationshipType}
    on:change={() => (errors.relationshipType = null)}
  />
  <div class="headings">
    <Detail>Tables</Detail>
  </div>
  <Select
    label="Select from table"
    options={tableOptions}
    bind:value={fromId}
    bind:error={errors.fromTable}
    on:change={e => {
      fromColumn = tableOptions.find(opt => opt.value === e.detail)?.label || ""
      errors.fromTable = null
      errors.fromColumn = null
    }}
  />
  {#if isManyToOne && fromTable}
    <Select
      label={`Primary Key (${fromTable.name})`}
      options={Object.keys(fromTable.schema)}
      bind:value={fromPrimary}
      bind:error={errors.fromPrimary}
      on:change={() => (errors.fromPrimary = null)}
    />
  {/if}
  <Select
    label={"Select to table"}
    options={tableOptions}
    bind:value={toId}
    bind:error={errors.toTable}
    on:change={e => {
      toColumn = tableOptions.find(opt => opt.value === e.detail)?.label || ""
      errors.toTable = null
      errors.toColumn = null
    }}
  />
  {#if isManyToMany}
    <Select
      label={"Through"}
      options={tableOptions}
      bind:value={throughId}
      bind:error={errors.throughTable}
    />
    {#if fromTable && toTable && throughTable}
      <Select
        label={`Foreign Key (${fromTable?.name})`}
        options={Object.keys(throughTable?.schema)}
        bind:value={throughToKey}
        bind:error={errors.throughToKey}
        on:change={e => {
          if (throughFromKey === e.detail) {
            throughFromKey = null
          }
          errors.throughToKey = null
        }}
      />
      <Select
        label={`Foreign Key (${toTable?.name})`}
        options={Object.keys(throughTable?.schema)}
        bind:value={throughFromKey}
        bind:error={errors.throughFromKey}
        on:change={e => {
          if (throughToKey === e.detail) {
            throughToKey = null
          }
          errors.throughFromKey = null
        }}
      />
    {/if}
  {:else if isManyToOne && toTable}
    <Select
      label={`Foreign Key (${toTable?.name})`}
      options={Object.keys(toTable?.schema)}
      bind:value={fromForeign}
      bind:error={errors.fromForeign}
      on:change={() => (errors.fromForeign = null)}
    />
  {/if}
  <div class="headings">
    <Detail>Column names</Detail>
  </div>
  <Body>
    Budibase manages SQL relationships as a new column in the table, please
    provide a name for these columns.
  </Body>
  <Input
    label="From table column"
    bind:value={fromColumn}
    bind:error={errors.fromColumn}
    on:change={e => {
      errors.fromColumn = e.detail?.length > 0 ? null : colNotSet
    }}
  />
  <Input
    label="To table column"
    bind:value={toColumn}
    bind:error={errors.toColumn}
    on:change={e => (errors.toColumn = e.detail?.length > 0 ? null : colNotSet)}
  />
  <div slot="footer">
    {#if originalFromColumnName != null}
      <Button warning text on:click={deleteRelationship}>Delete</Button>
    {/if}
  </div>
</ModalContent>

<style>
  .headings {
    margin-top: var(--spacing-s);
  }
</style>
