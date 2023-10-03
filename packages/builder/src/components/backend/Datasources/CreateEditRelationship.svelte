<script>
  import { RelationshipType } from "constants/backend"
  import {
    keepOpen,
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
  import RelationshipSelector from "components/common/RelationshipSelector.svelte"
  import { PrettyRelationshipDefinitions } from "constants/backend"

  export let save
  export let datasource
  export let plusTables = []
  export let fromRelationship = {}
  export let toRelationship = {}
  export let selectedFromTable
  export let close

  let relationshipMap = {
    [RelationshipType.MANY_TO_MANY]: {
      part1: PrettyRelationshipDefinitions.MANY,
      part2: PrettyRelationshipDefinitions.MANY,
    },
    [RelationshipType.MANY_TO_ONE]: {
      part1: PrettyRelationshipDefinitions.ONE,
      part2: PrettyRelationshipDefinitions.MANY,
    },
  }
  let relationshipOpts1 = Object.values(PrettyRelationshipDefinitions)
  let relationshipOpts2 = Object.values(PrettyRelationshipDefinitions)

  let relationshipPart1 = PrettyRelationshipDefinitions.MANY
  let relationshipPart2 = PrettyRelationshipDefinitions.ONE

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
  let fromPrimary, fromForeign, fromColumn, toColumn

  let throughId, throughToKey, throughFromKey
  let isManyToMany, isManyToOne, relationshipType
  let hasValidated = false

  $: fromId = null
  $: toId = null

  $: tableOptions = plusTables.map(table => ({
    label: table.name,
    value: table._id,
    name: table.name,
    _id: table._id,
  }))

  $: {
    // Determine the relationship type based on the selected values of both parts
    relationshipType = Object.entries(relationshipMap).find(
      ([_, parts]) =>
        parts.part1 === relationshipPart1 && parts.part2 === relationshipPart2
    )?.[0]

    changed(() => {
      hasValidated = false
    })
  }
  $: valid =
    getErrorCount(errors) === 0 && allRequiredAttributesSet(relationshipType)
  $: isManyToMany = relationshipType === RelationshipType.MANY_TO_MANY
  $: isManyToOne = relationshipType === RelationshipType.MANY_TO_ONE

  function getTable(id) {
    return plusTables.find(table => table._id === id)
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
  function relationshipExists() {
    if (
      originalFromTable &&
      originalToTable &&
      originalFromTable === getTable(fromId) &&
      originalToTable === getTable(toId)
    ) {
      return false
    }
    let fromThroughLinks = Object.values(
      datasource.entities[getTable(fromId).name].schema
    ).filter(value => value.through)
    let toThroughLinks = Object.values(
      datasource.entities[getTable(toId).name].schema
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

  function getErrorCount(errors) {
    return Object.entries(errors).filter(entry => !!entry[1]).length
  }

  function allRequiredAttributesSet(relationshipType) {
    const base = getTable(fromId) && getTable(toId) && fromColumn && toColumn
    if (relationshipType === RelationshipType.MANY_TO_ONE) {
      return base && fromPrimary && fromForeign
    } else {
      return base && getTable(throughId) && throughFromKey && throughToKey
    }
  }

  function validate() {
    if (!allRequiredAttributesSet(relationshipType) && !hasValidated) {
      return
    }

    hasValidated = true
    errorChecker.setType(relationshipType)
    const fromTable = getTable(fromId),
      toTable = getTable(toId),
      throughTable = getTable(throughId)
    errors = {
      relationshipType: errorChecker.relationshipTypeSet(relationshipType),
      fromTable:
        errorChecker.tableSet(fromTable) ||
        errorChecker.doesRelationshipExists() ||
        errorChecker.differentTables(fromId, toId, throughId),
      toTable:
        errorChecker.tableSet(toTable) ||
        errorChecker.doesRelationshipExists() ||
        errorChecker.differentTables(toId, fromId, throughId),
      throughTable:
        errorChecker.throughTableSet(throughTable) ||
        errorChecker.throughIsNullable() ||
        errorChecker.differentTables(throughId, fromId, toId),
      throughFromKey:
        errorChecker.manyForeignKeySet(throughFromKey) ||
        errorChecker.manyTypeMismatch(
          fromTable,
          throughTable,
          fromTable.primary[0],
          throughToKey
        ),
      throughToKey:
        errorChecker.manyForeignKeySet(throughToKey) ||
        errorChecker.manyTypeMismatch(
          toTable,
          throughTable,
          toTable.primary[0],
          throughFromKey
        ),
      fromForeign:
        errorChecker.foreignKeySet(fromForeign) ||
        errorChecker.typeMismatch(fromTable, toTable, fromPrimary, fromForeign),
      fromPrimary: errorChecker.primaryKeySet(fromPrimary),
      fromColumn: errorChecker.columnBeingUsed(
        toTable,
        fromColumn,
        originalFromColumnName
      ),
      toColumn: errorChecker.columnBeingUsed(
        fromTable,
        toColumn,
        originalToColumnName
      ),
    }
    return getErrorCount(errors) === 0
  }

  function otherRelationshipType(type) {
    if (type === RelationshipType.MANY_TO_ONE) {
      return RelationshipType.ONE_TO_MANY
    } else if (type === RelationshipType.ONE_TO_MANY) {
      return RelationshipType.MANY_TO_ONE
    } else if (type === RelationshipType.MANY_TO_MANY) {
      return RelationshipType.MANY_TO_MANY
    }
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
      relationshipType: otherRelationshipType(relationshipType),
      through: throughId,
      type: "link",
      _id: id,
    })

    // if any to many only need to check from
    const manyToMany =
      relateFrom.relationshipType === RelationshipType.MANY_TO_MANY

    if (!manyToMany) {
      delete relateFrom.through
      delete relateTo.through
    }

    // [0] is because we don't support composite keys for relationships right now
    if (manyToMany) {
      relateFrom = {
        ...relateFrom,
        through: getTable(throughId)._id,
        fieldName: getTable(toId).primary[0],
      }
      relateTo = {
        ...relateTo,
        through: getTable(throughId)._id,
        fieldName: getTable(fromId).primary[0],
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
        relationshipType: RelationshipType.ONE_TO_MANY,
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
    if (!validate()) {
      return keepOpen
    }
    buildRelationships()
    removeExistingRelationship()

    // source of relationship
    datasource.entities[getTable(fromId).name].schema[fromRelationship.name] =
      fromRelationship
    // save other side of relationship in the other schema
    datasource.entities[getTable(toId).name].schema[toRelationship.name] =
      toRelationship

    await save({ action: "saved" })
  }
  async function deleteRelationship() {
    removeExistingRelationship()
    await save({ action: "deleted" })
    await tables.fetch()
    close()
  }

  function changed(fn) {
    if (typeof fn === "function") {
      fn()
    }
    validate()
  }

  onMount(() => {
    if (fromRelationship) {
      fromPrimary = fromRelationship.foreignKey
      toId = fromRelationship.tableId
      throughId = fromRelationship.through
      throughFromKey = fromRelationship.throughFrom
      throughToKey = fromRelationship.throughTo
      toColumn = fromRelationship.name
    }
    if (toRelationship) {
      fromForeign = toRelationship.foreignKey
      fromId = toRelationship.tableId
      fromColumn = toRelationship.name
    }
    relationshipType =
      fromRelationship.relationshipType || RelationshipType.MANY_TO_ONE
    if (selectedFromTable) {
      fromId = selectedFromTable._id
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
  <div class="headings">
    <Detail>Tables</Detail>
  </div>

  <RelationshipSelector
    bind:relationshipPart1
    bind:relationshipPart2
    bind:relationshipTableIdPrimary={fromId}
    bind:relationshipTableIdSecondary={toId}
    {relationshipOpts1}
    {relationshipOpts2}
    {tableOptions}
    {errors}
    primaryDisabled={selectedFromTable}
    primaryTableChanged={e =>
      changed(() => {
        const table = plusTables.find(tbl => tbl._id === e.detail)
        fromColumn = table?.name || ""
        fromPrimary = table?.primary?.[0]
      })}
    secondaryTableChanged={e =>
      changed(() => {
        const table = plusTables.find(tbl => tbl._id === e.detail)
        toColumn = table.name || ""
        fromForeign = null
      })}
  />

  {#if isManyToOne && fromId}
    <Select
      label={`Primary Key (${getTable(fromId).name})`}
      options={Object.keys(getTable(fromId).schema)}
      bind:value={fromPrimary}
      bind:error={errors.fromPrimary}
      on:change={changed}
    />
  {/if}
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
    {#if fromId && toId && throughId}
      <Select
        label={`Foreign Key (${getTable(fromId)?.name})`}
        options={Object.keys(getTable(throughId)?.schema)}
        bind:value={throughToKey}
        bind:error={errors.throughToKey}
        on:change={changed}
      />
      <Select
        label={`Foreign Key (${getTable(toId)?.name})`}
        options={Object.keys(getTable(throughId)?.schema)}
        bind:value={throughFromKey}
        bind:error={errors.throughFromKey}
        on:change={changed}
      />
    {/if}
  {:else if isManyToOne && toId}
    <Select
      label={`Foreign Key (${getTable(toId)?.name})`}
      options={Object.keys(getTable(toId)?.schema)}
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
