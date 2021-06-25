<script>
  import { RelationshipTypes } from "constants/backend"
  import { Menu, MenuItem, MenuSection, Button, Input, Icon, ModalContent, RadioGroup, Heading } from "@budibase/bbui"

  //  "tasks_something": {
  //          "name": "tasks_something",
  //          "type": "link",
  //          "tableId": "whatever/othertable",
  //          "relationshipType": "one-to-many",
  //       },

  export let save
  export let datasource
  export let from
  export let tables
  export let relationship = {}

  $: console.log(relationship)
  $: valid = relationship.name && relationship.tableId && relationship.relationshipType
  $: from = tables.find(table => table._id === relationship.source)
  $: to = tables.find(table => table._id === relationship.tableId)
  $: through = tables.find(table => table._id === relationship.through)
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
  
  function onChangeRelationshipType(evt) {
    if (evt.detail === RelationshipTypes.ONE_TO_MANY) {
      relationship.through = null
    }
  }

  // save the relationship on to the datasource
  function saveRelationship() {
    let key

    // find the entity on the datasource

    for (let entity in datasource.entities) {
      // TODO: update with _id instead of name
      if (relationship.from.name === entity) {
        key = entity
      }
    }

    datasource.entities[key].schema[relationship.name] = {
      name: relationship.name,
      type: "link",
      relationshipType: relationship.relationshipType,
      tableId: relationship.to._id,
      through: relationship.through
    }
    save()
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
    <Menu>
      <MenuSection heading="From">
        {#each tables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.source = table._id)}>
            {table.name}
             {#if relationship.source === table._id}
              <Icon size="S" name="Checkmark" />
             {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu>
    <Menu>
      <MenuSection heading="To">
        {#each tables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.tableId = table._id)}>
            {table.name}
             {#if relationship.tableId === table._id}
              <Icon size="S" name="Checkmark" />
             {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu>
  </div>

  {#if from && to}
    <div class="cardinality">
      <RadioGroup
        label="Define the relationship"
        bind:value={relationship.relationshipType}
        on:change={onChangeRelationshipType}
        options={relationshipOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value}
      />
    </div>

  {#if relationship?.relationshipType === RelationshipTypes.MANY_TO_MANY}
    <Menu>
      <MenuSection heading="Join Table">
        {#each tables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.through = table._id)}>
            {table.name}
              {#if relationship.through === table._id}
              <Icon size="S" name="Checkmark" />
              {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu>
  {/if}


    <div class="table-selector">
      <Menu>
        <MenuSection heading={`${linkTable.name} Column`}>
          {#each Object.keys(linkTable.schema) as column}
            <MenuItem noClose icon="Table" on:click={() => (relationship.foreignKey = column)}>
              {column}
                {#if relationship.foreignKey === column}
                  <Icon size="S" name="Checkmark" />
                {/if}
            </MenuItem>
          {/each}
        </MenuSection>
      </Menu>
    </div>
  {/if}

</ModalContent>

<style>
  .table-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-xl);
  }
</style>