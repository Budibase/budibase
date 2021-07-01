<script>
  import { RelationshipTypes } from "constants/backend"
  import { Menu, MenuItem, MenuSection, Button, Input, Icon, ModalContent, RadioGroup, Heading, Select } from "@budibase/bbui"
  import { tables } from "stores/backend"

  export let save
  export let datasource
  export let from
  export let plusTables
  export let relationship = {}
  export let close

  let originalName = relationship.name

  $: tableOptions = plusTables.map(table => ({ label: table.name, value: table._id }))
  $: valid = relationship.name && relationship.tableId && relationship.relationshipType
  $: from = plusTables.find(table => table._id === relationship.source)
  $: to = plusTables.find(table => table._id === relationship.tableId)
  $: through = plusTables.find(table => table._id === relationship.through)
  $: linkTable = through || to


  $: relationshipTypes = [
      {
        label: "Many",
        value: RelationshipTypes.MANY_TO_MANY,
      },
      {
        label: "One",
        value: RelationshipTypes.ONE_TO_MANY,
      }
    ]
  
  function onChangeRelationshipType(evt) {
    if (evt.detail === RelationshipTypes.ONE_TO_MANY) {
      relationship.through = null
    }
  }

  // save the relationship on to the datasource
  async function saveRelationship() {
    const manyToMany = relationship.relationshipType === RelationshipTypes.MANY_TO_MANY
    // source of relationship
    datasource.entities[from.name].schema[relationship.name] = {
      type: "link",
      foreignKey: relationship.fieldName,
      ...relationship
    }
    // save other side of relationship in the other schema
    datasource.entities[to.name].schema[relationship.name] = {
      name: relationship.name,
      type: "link",
      relationshipType: manyToMany ? RelationshipTypes.MANY_TO_MANY : RelationshipTypes.MANY_TO_ONE,
      tableId: from._id,
      fieldName: relationship.fieldName,
      foreignKey: relationship.fieldName
    }

    // If relationship has been renamed
    if (originalName !== relationship.name) {
      delete datasource.entities[from.name].schema[originalName]
      delete datasource.entities[to.name].schema[originalName]
    }

    console.log({
      from: datasource.entities[from.name].schema[relationship.name],
      to: datasource.entities[to.name].schema[relationship.name],
    })

    await save()
    await tables.fetch()
  }

  async function deleteRelationship() {
    delete datasource.entities[from.name].schema[relationship.name]
    delete datasource.entities[to.name].schema[relationship.name]
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
  <Input label="Relationship Name" bind:value={relationship.name} />

  <div class="table-selector">
    <Select 
      label="Relationship"
      options={relationshipTypes}
      bind:value={relationship.relationshipType}
    />

    <Select 
      label="From"
      options={tableOptions}
      bind:value={relationship.source}
    />

    <Select 
      label={"Has many"}
      options={tableOptions}
      bind:value={relationship.tableId}
    />

    {#if relationship?.relationshipType === RelationshipTypes.MANY_TO_MANY}
      <Select 
        label={"Through"}
        options={tableOptions}
        bind:value={relationship.through}
      />

      <Select 
        label={"Key"}
        options={Object.keys(through.schema || {})}
        bind:value={relationship.fieldName}
      />
    {/if}

    {#if relationship?.relationshipType === RelationshipTypes.ONE_TO_MANY && to}
      <Select 
        label={`Foreign Key (${to.name})`}
        options={Object.keys(to.schema)}
        bind:value={relationship.fieldName}
      />
    {/if}
  </div>

  <div slot="footer">
    {#if originalName !== null}
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
</style>