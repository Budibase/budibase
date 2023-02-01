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
  import { RelationshipErrorChecker } from "./relationshipErrors"
  import { onMount } from "svelte"

  export let save
  export let datasource
  export let plusTables = []
  export let fromRelationship = {}
  export let toRelationship = {}
  export let selectedFromTable
  export let close

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
  let errorChecker = new RelationshipErrorChecker(
    invalidThroughTable,
    relationshipExists
  )
  let errors = {}
  let fromPrimary,
    fromForeign,
    fromTable,
    toTable,
    throughTable,
    fromColumn,
    toColumn
  let fromId = selectedFromTable?._id,
    toId,
    throughId,
    throughToKey,
    throughFromKey
  let isManyToMany, isManyToOne, relationshipType
  let hasValidated = false

  $: {
    if (!fromPrimary) {
      fromPrimary = fromRelationship.foreignKey
    }
    if (!fromForeign) {
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
      relationshipType =
        fromRelationship.relationshipType || RelationshipTypes.MANY_TO_ONE
    }
  }

  $: tableOptions = plusTables.map(table => ({
    label: table.name,
    value: table._id,
  }))
  $: valid = getErrorCount(errors) === 0 && allRequiredAttributesSet()

  $: isManyToMany = relationshipType === RelationshipTypes.MANY_TO_MANY
  $: isManyToOne = relationshipType === RelationshipTypes.MANY_TO_ONE
  $: fromTable = plusTables.find(table => table._id === fromId)
  $: toTable = plusTables.find(table => table._id === toId)
  $: throughTable = plusTables.find(table => table._id === throughId)

  $: toRelationship.relationshipType = fromRelationship?.relationshipType

  function getErrorCount(errors) {
    return Object.entries(errors)
      .filter(entry => !!entry[1])
      .map(entry => entry[0]).length
  }

  function allRequiredAttributesSet() {
    const base = fromTable && toTable && fromColumn && toColumn
    if (isManyToOne) {
      return base && fromPrimary && fromForeign
    } else {
      return base && throughTable && throughFromKey && throughToKey
    }
  }

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
    if (!allRequiredAttributesSet() && !hasValidated) {
      return
    }
    hasValidated = true
    errorChecker.setType(relationshipType)
    const errObj = {}
    errObj.relationshipType = errorChecker.relationshipTypeSet(relationshipType)
    errObj.fromTable = errorChecker.tableSet(fromTable)
    errObj.toTable = errorChecker.tableSet(toTable)
    errObj.throughTable = errorChecker.throughTableSet(throughTable)
    errObj.throughFromKey = errorChecker.manyForeignKeySet(throughFromKey)
    errObj.throughToKey = errorChecker.manyForeignKeySet(throughToKey)
    errObj.throughTable = errorChecker.throughIsNullable()
    errObj.fromForeign = errorChecker.foreignKeySet(fromForeign)
    errObj.fromPrimary = errorChecker.foreignKeySet(fromPrimary)
    errObj.fromTable = errorChecker.doesRelationshipExists()
    errObj.toTable = errorChecker.doesRelationshipExists()
    // currently don't support relationships back onto the table itself, needs to relate out
    errObj.fromTable = errorChecker.differentTables(fromId, toId, throughId)
    errObj.toTable = errorChecker.differentTables(toId, fromId, throughId)
    errObj.throughTable = errorChecker.differentTables(throughId, fromId, toId)
    errObj.fromColumn = errorChecker.columnBeingUsed(
      toTable,
      fromColumn,
      originalFromColumnName
    )
    errObj.toColumn = errorChecker.columnBeingUsed(
      fromTable,
      toColumn,
      originalToColumnName
    )
    errObj.fromForeign = errorChecker.typeMismatch(
      fromTable,
      toTable,
      fromPrimary,
      fromForeign
    )
    errors = errObj
    return getErrorCount(errors) === 0
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

  function relationshipExists() {
    if (
      originalFromTable &&
      originalToTable &&
      originalFromTable === fromTable &&
      originalToTable === toTable
    ) {
      return false
    }
    let fromThroughLinks = Object.values(
      datasource.entities[fromTable.name].schema
    ).filter(value => value.through)
    let toThroughLinks = Object.values(
      datasource.entities[toTable.name].schema
    ).filter(value => value.through)

    const matchAgainstUserInput = (fromTableId, toTableId) =>
      (fromTableId === fromId && toTableId === toId) ||
      (fromTableId === toId && toTableId === fromId)

    return !!fromThroughLinks.find(from =>
      toThroughLinks.find(
        to =>
          from.through === to.through &&
          matchAgainstUserInput(from.tableId, to.tableId)
      )
    )
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

  function changed(fn) {
    if (fn && typeof fn === "function") {
      fn()
    }
    validate()
  }

  onMount(() => {
    if (selectedFromTable) {
      fromColumn = selectedFromTable.name
      fromPrimary = selectedFromTable?.primary[0] || null
    }
  })
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
    on:change={changed}
  />
  <div class="headings">
    <Detail>Tables</Detail>
  </div>
  {#if !selectedFromTable}
    <Select
      label="Select from table"
      options={tableOptions}
      bind:value={fromId}
      bind:error={errors.fromTable}
      on:change={e =>
        changed(() => {
          const table = plusTables.find(tbl => tbl._id === e.detail)
          fromColumn = table?.name || ""
          fromPrimary = table?.primary?.[0]
        })}
    />
  {/if}
  {#if isManyToOne && fromTable}
    <Select
      label={`Primary Key (${fromTable.name})`}
      options={Object.keys(fromTable.schema)}
      bind:value={fromPrimary}
      bind:error={errors.fromPrimary}
      on:change={changed}
    />
  {/if}
  <Select
    label={"Select to table"}
    options={tableOptions}
    bind:value={toId}
    bind:error={errors.toTable}
    on:change={e =>
      changed(() => {
        const table = plusTables.find(tbl => tbl._id === e.detail)
        toColumn = table.name || ""
        fromForeign = null
      })}
  />
  {#if isManyToMany}
    <Select
      label={"Through"}
      options={tableOptions}
      bind:value={throughId}
      bind:error={errors.throughTable}
      on:change={() =>
        changed(() => {
          throughToKey = null
          throughFromKey = null
        })}
    />
    {#if fromTable && toTable && throughTable}
      <Select
        label={`Foreign Key (${fromTable?.name})`}
        options={Object.keys(throughTable?.schema)}
        bind:value={throughToKey}
        bind:error={errors.throughToKey}
        on:change={e =>
          changed(() => {
            if (throughFromKey === e.detail) {
              throughFromKey = null
            }
          })}
      />
      <Select
        label={`Foreign Key (${toTable?.name})`}
        options={Object.keys(throughTable?.schema)}
        bind:value={throughFromKey}
        bind:error={errors.throughFromKey}
        on:change={e =>
          changed(() => {
            if (throughToKey === e.detail) {
              throughToKey = null
            }
          })}
      />
    {/if}
  {:else if isManyToOne && toTable}
    <Select
      label={`Foreign Key (${toTable?.name})`}
      options={Object.keys(toTable?.schema)}
      bind:value={fromForeign}
      bind:error={errors.fromForeign}
      on:change={changed}
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
    on:change={changed}
  />
  <Input
    label="To table column"
    bind:value={toColumn}
    bind:error={errors.toColumn}
    on:change={changed}
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
