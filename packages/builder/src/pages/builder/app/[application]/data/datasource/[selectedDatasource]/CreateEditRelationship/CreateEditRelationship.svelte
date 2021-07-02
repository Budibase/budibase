<script>
  import { RelationshipTypes } from "constants/backend"
  import { Button, Input, ModalContent, Select } from "@budibase/bbui"
  import { tables } from "stores/backend"
  import { uuid } from "builderStore/uuid"

  export let save
  export let datasource
  export let plusTables = []
  export let fromRelationship = {}
  export let toRelationship = {}
  export let close

  let originalFromName = fromRelationship.name, originalToName = toRelationship.name

  function isValid(relationship) {
    if (relationship.relationshipType === RelationshipTypes.MANY_TO_MANY && !relationship.through) {
      return false
    }
    return relationship.name && relationship.tableId && relationship.relationshipType
  }

  $: tableOptions = plusTables.map(table => ({ label: table.name, value: table._id }))
  $: fromTable = plusTables.find(table => table._id === toRelationship?.tableId)
  $: toTable = plusTables.find(table => table._id === fromRelationship?.tableId)
  $: through = plusTables.find(table => table._id === fromRelationship?.through)
  $: valid = toTable && fromTable && isValid(fromRelationship)
  $: linkTable = through || toTable
  $: relationshipTypes = [
      {
        label: "Many",
        value: RelationshipTypes.MANY_TO_MANY,
      },
      {
        label: "One",
        value: RelationshipTypes.MANY_TO_ONE,
      }
    ]
  $: updateRelationshipType(fromRelationship?.relationshipType)

  function updateRelationshipType(fromType) {
    if (fromType === RelationshipTypes.MANY_TO_MANY) {
      toRelationship.relationshipType = RelationshipTypes.MANY_TO_MANY
    } else {
      toRelationship.relationshipType = RelationshipTypes.MANY_TO_ONE
    }
  }

  function buildRelationships() {
    // if any to many only need to check from
    const manyToMany = fromRelationship.relationshipType === RelationshipTypes.MANY_TO_MANY
    // main is simply used to know this is the side the user configured it from
    const id = uuid()
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
      }
    } else {
      relateFrom = {
        ...relateFrom,
        foreignKey: relateFrom.fieldName,
        fieldName: fromTable.primary[0],
      }
      relateTo = {
        ...relateTo,
        relationshipType: RelationshipTypes.ONE_TO_MANY,
        foreignKey: relateFrom.fieldName,
        fieldName: fromTable.primary[0],
      }
    }

    fromRelationship = relateFrom
    toRelationship = relateTo
  }

  // save the relationship on to the datasource
  async function saveRelationship() {
    buildRelationships()
    // source of relationship
    datasource.entities[fromTable.name].schema[fromRelationship.name] = fromRelationship
    // save other side of relationship in the other schema
    datasource.entities[toTable.name].schema[toRelationship.name] = toRelationship

    // If relationship has been renamed
    if (originalFromName !== fromRelationship.name) {
      delete datasource.entities[fromTable.name].schema[originalFromName]
    }
    if (originalToName !== toRelationship.name) {
      delete datasource.entities[toTable.name].schema[originalToName]
    }

    await save()
    await tables.fetch()
  }

  async function deleteRelationship() {
    delete datasource.entities[fromTable.name].schema[fromRelationship.name]
    delete datasource.entities[toTable.name].schema[toRelationship.name]
    await save()
    await tables.fetch()
    close()
  }
</script>

<ModalContent
  size="XL"
  title="Create Relationship"
  confirmText="Save"
  onConfirm={saveRelationship}
  disabled={!valid}
>
  <div class="relationship-names">
    <div class="left-name">
      <Input label="From name" bind:value={fromRelationship.name} />
    </div>
    <div class="right-name">
      <Input label="To name" bind:value={toRelationship.name} />
    </div>
  </div>

  <div class="table-selector">
    <Select 
      label="Relationship"
      options={relationshipTypes}
      bind:value={fromRelationship.relationshipType}
    />

    <Select 
      label="From"
      options={tableOptions}
      bind:value={toRelationship.tableId}
    />

    <Select 
      label={"Has many"}
      options={tableOptions}
      bind:value={fromRelationship.tableId}
    />

    {#if fromRelationship?.relationshipType === RelationshipTypes.MANY_TO_MANY}
      <Select 
        label={"Through"}
        options={tableOptions}
        bind:value={fromRelationship.through}
      />
    {:else if toTable}
      <Select
          label={`Foreign Key (${toTable?.name})`}
          options={Object.keys(toTable?.schema)}
          bind:value={fromRelationship.fieldName}
      />
    {/if}
  </div>

  <div slot="footer">
    {#if originalFromName !== null}
      <Button warning text on:click={deleteRelationship}>Delete</Button>
    {/if}
  </div>
</ModalContent>

<style>
  .table-selector {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: var(--spacing-xl);
  }
  .relationship-names {
    display: grid;
    grid-gap: var(--spacing-xl);
  }
  .left-name {
    grid-column: 1;
  }
  .right-name {
    grid-column: 2;
  }
</style>