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
  import { writable } from "svelte/store"

  export let save
  export let datasource
  export let plusTables = []
  export let fromRelationship = {}
  export let toRelationship = {}
  export let close
  export let selectedFromTable

  let originalFromName = fromRelationship.name,
    originalToName = toRelationship.name
  let fromTable, toTable, through, linkTable, tableOptions
  let isManyToMany, isManyToOne, relationshipTypes
  let errors, valid
  let currentTables = {}

  if (fromRelationship && !fromRelationship.relationshipType) {
    fromRelationship.relationshipType = RelationshipTypes.MANY_TO_ONE
  }

  if (toRelationship && selectedFromTable) {
    toRelationship.tableId = selectedFromTable._id
  }

  function inSchema(table, prop, ogName) {
    if (!table || !prop || prop === ogName) {
      return false
    }
    const keys = Object.keys(table.schema).map(key => key.toLowerCase())
    return keys.indexOf(prop.toLowerCase()) !== -1
  }

  const touched = writable({})

  function invalidThroughTable({ through, throughTo, throughFrom }) {
    // need to know the foreign key columns to check error
    if (!through || !throughTo || !throughFrom) {
      return false
    }
    const throughTable = plusTables.find(tbl => tbl._id === through)
    const otherColumns = Object.values(throughTable.schema).filter(
      col => col.name !== throughFrom && col.name !== throughTo
    )
    for (let col of otherColumns) {
      if (col.constraints?.presence && !col.autocolumn) {
        return true
      }
    }
    return false
  }

  function checkForErrors(fromRelate, toRelate) {
    const isMany =
      fromRelate.relationshipType === RelationshipTypes.MANY_TO_MANY
    const tableNotSet = "Please specify a table"
    const errObj = {}
    if ($touched.from && !fromTable) {
      errObj.from = tableNotSet
    }
    if ($touched.to && !toTable) {
      errObj.to = tableNotSet
    }
    if ($touched.through && isMany && !fromRelate.through) {
      errObj.through = tableNotSet
    }
    if ($touched.through && invalidThroughTable(fromRelate)) {
      errObj.through =
        "Ensure all columns in table are nullable or auto generated"
    }
    if ($touched.foreign && !isMany && !fromRelate.fieldName) {
      errObj.foreign = "Please pick the foreign key"
    }
    const colNotSet = "Please specify a column name"
    if ($touched.fromCol && !fromRelate.name) {
      errObj.fromCol = colNotSet
    }
    if ($touched.toCol && !toRelate.name) {
      errObj.toCol = colNotSet
    }
    if ($touched.primary && !fromPrimary) {
      errObj.primary = "Please pick the primary key"
    }
    // currently don't support relationships back onto the table itself, needs to relate out
    const tableError = "From/to/through tables must be different"
    if (fromTable && (fromTable === toTable || fromTable === through)) {
      errObj.from = tableError
    }
    if (toTable && (toTable === fromTable || toTable === through)) {
      errObj.to = tableError
    }
    if (through && (through === fromTable || through === toTable)) {
      errObj.through = tableError
    }
    const colError = "Column name cannot be an existing column"
    if (inSchema(fromTable, fromRelate.name, originalFromName)) {
      errObj.fromCol = colError
    }
    if (inSchema(toTable, toRelate.name, originalToName)) {
      errObj.toCol = colError
    }

    let fromType, toType
    if (fromPrimary && fromRelate.fieldName) {
      fromType = fromTable?.schema[fromPrimary]?.type
      toType = toTable?.schema[fromRelate.fieldName]?.type
    }
    if (fromType && toType && fromType !== toType) {
      errObj.foreign =
        "Column type of the foreign key must match the primary key"
    }
    errors = errObj
  }

  let fromPrimary
  $: {
    if (!fromPrimary && fromTable) {
      fromPrimary = fromTable.primary[0]
    }
  }
  $: isManyToMany =
    fromRelationship?.relationshipType === RelationshipTypes.MANY_TO_MANY
  $: isManyToOne =
    fromRelationship?.relationshipType === RelationshipTypes.MANY_TO_ONE
  $: tableOptions = plusTables.map(table => ({
    label: table.name,
    value: table._id,
  }))
  $: fromTable = plusTables.find(table => table._id === toRelationship?.tableId)
  $: toTable = plusTables.find(table => table._id === fromRelationship?.tableId)
  $: through = plusTables.find(table => table._id === fromRelationship?.through)
  $: checkForErrors(fromRelationship, toRelationship)
  $: valid =
    Object.keys(errors).length === 0 && Object.keys($touched).length !== 0
  $: linkTable = through || toTable
  $: relationshipTypes = [
    {
      label: "Many",
      value: RelationshipTypes.MANY_TO_MANY,
    },
    {
      label: "One",
      value: RelationshipTypes.MANY_TO_ONE,
    },
  ]
  $: updateRelationshipType(fromRelationship?.relationshipType)
  $: tableChanged(fromTable, toTable)

  function updateRelationshipType(fromType) {
    if (fromType === RelationshipTypes.MANY_TO_MANY) {
      toRelationship.relationshipType = RelationshipTypes.MANY_TO_MANY
    } else {
      toRelationship.relationshipType = RelationshipTypes.MANY_TO_ONE
    }
  }

  function buildRelationships() {
    // if any to many only need to check from
    const manyToMany =
      fromRelationship.relationshipType === RelationshipTypes.MANY_TO_MANY
    // main is simply used to know this is the side the user configured it from
    const id = Helpers.uuid()
    if (!manyToMany) {
      delete fromRelationship.through
      delete toRelationship.through
    }
    let relateFrom = {
      ...fromRelationship,
      type: "link",
      main: true,
      _id: id,
    }
    let relateTo = {
      ...toRelationship,
      type: "link",
      _id: id,
    }

    // [0] is because we don't support composite keys for relationships right now
    if (manyToMany) {
      relateFrom = {
        ...relateFrom,
        through: through._id,
        fieldName: toTable.primary[0],
      }
      relateTo = {
        ...relateTo,
        through: through._id,
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

  // save the relationship on to the datasource
  async function saveRelationship() {
    buildRelationships()
    // source of relationship
    datasource.entities[fromTable.name].schema[fromRelationship.name] =
      fromRelationship
    // save other side of relationship in the other schema
    datasource.entities[toTable.name].schema[toRelationship.name] =
      toRelationship

    // If relationship has been renamed
    if (originalFromName !== fromRelationship.name) {
      delete datasource.entities[fromTable.name].schema[originalFromName]
    }
    if (originalToName !== toRelationship.name) {
      delete datasource.entities[toTable.name].schema[originalToName]
    }

    // store the original names so it won't cause an error
    originalToName = toRelationship.name
    originalFromName = fromRelationship.name
    await save()
  }

  async function deleteRelationship() {
    delete datasource.entities[fromTable.name].schema[fromRelationship.name]
    delete datasource.entities[toTable.name].schema[toRelationship.name]
    await save()
    await tables.fetch()
    close()
  }

  function tableChanged(fromTbl, toTbl) {
    if (
      (currentTables?.from?._id === fromTbl?._id &&
        currentTables?.to?._id === toTbl?._id) ||
      originalFromName ||
      originalToName
    ) {
      return
    }
    fromRelationship.name = toTbl?.name || ""
    errors.fromCol = ""
    toRelationship.name = fromTbl?.name || ""
    errors.toCol = ""
    currentTables = { from: fromTbl, to: toTbl }
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
    bind:value={fromRelationship.relationshipType}
  />
  <div class="headings">
    <Detail>Tables</Detail>
  </div>
  <Select
    label="Select from table"
    options={tableOptions}
    disabled={!!selectedFromTable}
    on:change={() => ($touched.from = true)}
    bind:error={errors.from}
    bind:value={toRelationship.tableId}
  />
  {#if isManyToOne && fromTable}
    <Select
      label={`Primary Key (${fromTable?.name})`}
      options={Object.keys(fromTable?.schema)}
      on:change={() => ($touched.primary = true)}
      bind:error={errors.primary}
      bind:value={fromPrimary}
    />
  {/if}
  <Select
    label={"Select to table"}
    options={tableOptions}
    on:change={() => ($touched.to = true)}
    bind:error={errors.to}
    bind:value={fromRelationship.tableId}
  />
  {#if isManyToMany}
    <Select
      label={"Through"}
      options={tableOptions}
      on:change={() => ($touched.through = true)}
      bind:error={errors.through}
      bind:value={fromRelationship.through}
    />
    {#if fromTable && toTable && through}
      <Select
        label={`Foreign Key (${fromTable?.name})`}
        options={Object.keys(through?.schema)}
        on:change={() => ($touched.fromForeign = true)}
        bind:error={errors.fromForeign}
        bind:value={fromRelationship.throughTo}
      />
      <Select
        label={`Foreign Key (${toTable?.name})`}
        options={Object.keys(through?.schema)}
        on:change={() => ($touched.toForeign = true)}
        bind:error={errors.toForeign}
        bind:value={fromRelationship.throughFrom}
      />
    {/if}
  {:else if isManyToOne && toTable}
    <Select
      label={`Foreign Key (${toTable?.name})`}
      options={Object.keys(toTable?.schema).filter(
        field => toTable?.primary.indexOf(field) === -1
      )}
      on:change={() => ($touched.foreign = true)}
      bind:error={errors.foreign}
      bind:value={fromRelationship.fieldName}
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
    on:blur={() => ($touched.fromCol = true)}
    bind:error={errors.fromCol}
    label="From table column"
    bind:value={fromRelationship.name}
  />
  <Input
    on:blur={() => ($touched.toCol = true)}
    bind:error={errors.toCol}
    label="To table column"
    bind:value={toRelationship.name}
  />
  <div slot="footer">
    {#if originalFromName != null}
      <Button warning text on:click={deleteRelationship}>Delete</Button>
    {/if}
  </div>
</ModalContent>

<style>
  .headings {
    margin-top: var(--spacing-s);
  }
</style>
