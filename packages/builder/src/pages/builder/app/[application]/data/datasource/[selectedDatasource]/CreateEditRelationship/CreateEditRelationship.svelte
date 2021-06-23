<script>
  import { RelationshipTypes } from "constants/backend"
  import { Menu, MenuItem, MenuSection, Button, Input, Icon, ModalContent, RadioGroup, Heading } from "@budibase/bbui"

  export let save
  export let datasource
  export let tables

  let relationship = {}

  $: console.log(relationship)
  $: console.log("ds", datasource)
  $: valid = relationship.name && relationship.from && relationship.to && relationship.relationshipType

  $: relationshipOptions = relationship.from && relationship.to ?  [
      {
        name: `Many ${relationship.from.name} rows → many ${relationship.to.name} rows`,
        alt: `Many ${relationship.from.name} rows → many ${relationship.to.name} rows`,
        value: RelationshipTypes.MANY_TO_MANY,
      },
      {
        name: `One ${relationship.from.name} row → many ${relationship.to.name} rows`,
        alt: `One ${relationship.from.name} rows → many ${relationship.to.name} rows`,
        value: RelationshipTypes.ONE_TO_MANY,
      },
      {
        name: `One ${relationship.from.name} row → many ${relationship.to.name} rows`,
        alt: `One ${relationship.from.name} row → many ${relationship.to.name} rows`,
        value: RelationshipTypes.MANY_TO_ONE,
      },
    ] : []

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
          <MenuItem noClose icon="Table" on:click={() => (relationship.from = table)}>
            {table.name}
             {#if relationship.from?._id === table._id}
              <Icon size="S" name="Checkmark" />
             {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu>
    <Menu>
      <MenuSection heading="To">
        {#each tables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.to = table)}>
            {table.name}
             {#if relationship.to?._id === table._id}
              <Icon size="S" name="Checkmark" />
             {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu>
  </div>

  {#if relationship.from && relationship.to}
    <div class="cardinality">
      <RadioGroup
        label="Define the relationship"
        bind:value={relationship.relationshipType}
        options={relationshipOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value}
      />
    </div>
  {/if}

  {#if relationship?.relationshipType === RelationshipTypes.MANY_TO_MANY}
    <Menu>
      <MenuSection heading="Join Table">
        {#each tables as table}
          <MenuItem noClose icon="Table" on:click={() => (relationship.through = table)}>
            {table.name}
              {#if relationship.through?._id === table._id}
              <Icon size="S" name="Checkmark" />
              {/if}
          </MenuItem>
        {/each}
      </MenuSection>
    </Menu>

    {#if relationship.through}
      <div class="table-selector">
        <Menu>
          <MenuSection heading={`${relationship.from.name} Column`}>
            {#each Object.keys(relationship.through) as column}
              <MenuItem noClose icon="Table" on:click={() => (relationship.through.from = column)}>
                {column}
                  {#if relationship.through.from?._id === column._id}
                  <Icon size="S" name="Checkmark" />
                  {/if}
              </MenuItem>
            {/each}
          </MenuSection>
        </Menu>
        <Menu>
          <MenuSection heading={`${relationship.to.name} Column`}>
            {#each Object.keys(relationship.through) as column}
              <MenuItem noClose icon="Table" on:click={() => (relationship.through.to = column)}>
                {column}
                  {#if relationship.through.to?._id === column._id}
                  <Icon size="S" name="Checkmark" />
                  {/if}
              </MenuItem>
            {/each}
          </MenuSection>
        </Menu>
      </div>
    {/if}
  {/if}
</ModalContent>

<style>
  .table-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--spacing-xl);
  }
</style>