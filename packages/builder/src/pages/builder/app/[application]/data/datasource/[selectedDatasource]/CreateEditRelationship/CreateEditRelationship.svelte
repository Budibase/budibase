<script>
  import { RelationshipTypes } from "constants/backend"
  import { Menu, MenuItem, MenuSection, Button, Input, Icon, ModalContent, RadioGroup, Heading, Select } from "@budibase/bbui"
  import { tables } from "stores/backend"

  export let save
  export let datasource
  export let from
  export let plusTables
  export let relationship = {}

  let originalName = relationship.name

  $: console.log(relationship)
  $: tableOptions = plusTables.map(table => ({ label: table.name, value: table._id }))
  $: valid = relationship.name && relationship.tableId && relationship.relationshipType
  $: from = plusTables.find(table => table._id === relationship.source)
  $: to = plusTables.find(table => table._id === relationship.tableId)
  $: through = plusTables.find(table => table._id === relationship.through)
  $: linkTable = through || to

  $: relationshipOptions = from && to ?  [
      {
        name: `Many ${from.name} rows → many ${to.name} rows`,
        alt: `Many ${from.name} rows → many ${to.name} rows`,
        value: RelationshipTypes.MANY_TO_MANY,
      },
      {
        name: `One ${from.name} row → many ${to.name} rows`,
        alt: `One ${from.name} rows → many ${to.name} rows`,
        value: RelationshipTypes.ONE_TO_MANY,
      }
    ] : []

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
    // source of relationship
    datasource.entities[from.name].schema[relationship.name] = {
      type: "link",
      ...relationship
    }
    // if (originalName !== from.name) {
    //   delete datasource.entities[from.name].schema[originalName]
    // }

    // save other side of relationship in the other schema
    datasource.entities[to.name].schema[relationship.name] = {
      type: "link",
      relationshipType: relationship.relationshipType === RelationshipTypes.MANY_TO_MANY ? RelationshipTypes.MANY_TO_MANY : RelationshipTypes.MANY_TO_ONE,
      tableId: to._id
    }

    await save()
    await tables.fetch()
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
    {/if}

    {#if relationship?.relationshipType === RelationshipTypes.ONE_TO_MANY}
      <Select 
        label={"Foreign Key"}
        options={Object.keys(linkTable.schema)}
        bind:value={relationship.foreignKey}
      />
    {/if}

    <!-- <Menu>
      <MenuSection heading="From">
        {#each plusTables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.source = table._id)}>
            {table.name}
             {#if relationship.source === table._id}
              <Icon size="S" name="Checkmark" />
             {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu> -->
    <!-- <Menu>
      <MenuSection heading="To">
        {#each plusTables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.tableId = table._id)}>
            {table.name}
             {#if relationship.tableId === table._id}
              <Icon size="S" name="Checkmark" />
             {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu> -->
  {#if from && to}
    <!-- <div class="cardinality">
      <RadioGroup
        label="Define the relationship"
        bind:value={relationship.relationshipType}
        on:change={onChangeRelationshipType}
        options={relationshipOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value}
      />
    </div> -->

    <!-- <Select 
      label={`${linkTable.name} Column`}
      options={Object.keys(linkTable.schema)}
      bind:value={relationship.fieldName}
    /> -->

    <!-- <div class="table-selector">
      <Menu>
        <MenuSection heading={`${linkTable.name} Column`}>
          {#each Object.keys(linkTable.schema) as column}
            <MenuItem noClose icon="Table" on:click={() => (relationship.fieldName = column)}>
              {column}
                {#if relationship.fieldName === column}
                  <Icon size="S" name="Checkmark" />
                {/if}
            </MenuItem>
          {/each}
        </MenuSection>
      </Menu>
    </div> -->
  {/if}
  </div>


</ModalContent>

<style>
  .table-selector {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: var(--spacing-xl);
  }

  .cardinality {
    padding: 10px;
  }
</style>