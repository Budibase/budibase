<script>
   import { Button, ModalContent, RadioGroup, Heading } from "@budibase/bbui"

  const STEPS = 3

  export let save

  let relationship = {}
  let step = 0

  function nextStep() {
    if (step + 1 === STEPS) return
    step = step + 1
  }

  function previousStep() {
    if (step === 0) return
    step = step - 1
  }

  function saveRelationship() {
    // save the relationship on to the datasource
    // save()
  }

  function getRelationshipOptions(field) {
    if (!field || !field.tableId) {
      return null
    }
    const linkTable = tableOptions.find(table => table._id === field.tableId)
    if (!linkTable) {
      return null
    }
    const thisName = truncate(table.name, { length: 14 }),
      linkName = truncate(linkTable.name, { length: 14 })
    return [
      {
        name: `Many ${thisName} rows → many ${linkName} rows`,
        alt: `Many ${table.name} rows → many ${linkTable.name} rows`,
        value: RelationshipTypes.MANY_TO_MANY,
      },
      {
        name: `One ${linkName} row → many ${thisName} rows`,
        alt: `One ${linkTable.name} rows → many ${table.name} rows`,
        value: RelationshipTypes.ONE_TO_MANY,
      },
      {
        name: `One ${thisName} row → many ${linkName} rows`,
        alt: `One ${table.name} rows → many ${linkTable.name} rows`,
        value: RelationshipTypes.MANY_TO_ONE,
      },
    ]
  }
</script>

<ModalContent
  size="XL"
  title="Edit Code"
  showConfirmButton={false}
  showCancelButton={false}
>
  {#if step === 0}
    <Heading>Select your table</Heading>
  {:else if step === 1}
      <!-- <RadioGroup
        disabled={linkEditDisabled}
        label="Define the relationship"
        bind:value={relationship}
        options={relationshipOptions}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value}
      /> -->
      Step 2
  {:else if step === 2}
    Step 3
  {/if}
  <Button on:click={previousStep}>Previous</Button>
  <Button on:click={nextStep}>Next</Button>
</ModalContent>