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

  let originalFromColumnName = fromRelationship.name,
    originalToColumnName = toRelationship.name
  let originalFromTable = plusTables.find(
    table => table._id === toRelationship?.tableId
  )
  let originalToTable = plusTables.find(
    table => table._id === fromRelationship?.tableId
  )

  let tableOptions
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
    if (!fromColumn) {
      fromColumn = toRelationship.name
      fromId = toRelationship.tableId
    }
    if (!toColumn) {
      toColumn = fromRelationship.name
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

  $: isManyToMany = relationshipType === RelationshipTypes.MANY_TO_MANY
  $: isManyToOne = relationshipType === RelationshipTypes.MANY_TO_ONE
  $: fromTable = plusTables.find(table => table._id === fromId)
  $: toTable = plusTables.find(table => table._id === toId)
  $: throughTable = plusTables.find(table => table._id === throughId)

  $: toRelationship.relationshipType = fromRelationship?.relationshipType

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
        originalFromColumnName
      ]
    }
    if (originalToTable && originalToColumnName) {
      delete datasource.entities[originalToTable.name].schema[
        originalToColumnName
      ]
    }
  }

  async function saveRelationship() {
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
  title="Define Relationship COPY"
  confirmText="Save"
  onConfirm={saveRelationship}
>
  <Select
    label="Relationship type"
    options={relationshipTypes}
    bind:value={relationshipType}
  />
  <div class="headings">
    <Detail>Tables</Detail>
  </div>
  <Select
    label="Select from table"
    options={tableOptions}
    bind:value={fromId}
    on:change={e => {
      fromColumn = tableOptions.find(opt => opt.value === e.detail).label
    }}
  />
  {#if isManyToOne && fromTable}
    <Select
      label={`Primary Key (${fromTable.name})`}
      options={Object.keys(fromTable.schema)}
      bind:value={fromPrimary}
    />
  {/if}
  <Select
    label={"Select to table"}
    options={tableOptions}
    bind:value={toId}
    on:change={e => {
      toColumn = tableOptions.find(opt => opt.value === e.detail).label
    }}
  />
  {#if isManyToMany}
    <Select label={"Through"} options={tableOptions} bind:value={throughId} />
    {#if fromTable && toTable && throughTable}
      <Select
        label={`Foreign Key (${fromTable?.name})`}
        options={Object.keys(throughTable?.schema)}
        bind:value={throughToKey}
      />
      <Select
        label={`Foreign Key (${toTable?.name})`}
        options={Object.keys(throughTable?.schema)}
        bind:value={throughFromKey}
      />
    {/if}
  {:else if isManyToOne && toTable}
    <Select
      label={`Foreign Key (${toTable?.name})`}
      options={Object.keys(toTable?.schema)}
      bind:value={fromForeign}
    />
  {/if}
  <div class="headings">
    <Detail>Column names</Detail>
  </div>
  <Body>
    Budibase manages SQL relationships as a new column in the table, please
    provide a name for these columns.
  </Body>
  <Input label="From table column" bind:value={fromColumn} />
  <Input label="To table column" bind:value={toColumn} />
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
