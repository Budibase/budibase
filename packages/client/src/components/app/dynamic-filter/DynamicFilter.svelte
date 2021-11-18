<script>
  import { Button, ModalContent, Modal } from "@budibase/bbui"
  import { getContext } from "svelte"
  import FilterModal from "./FilterModal.svelte"

  export let dataProvider
  export let allowedFields
  export let buttonText

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  let modal
  let tmpFilters = []
  let filters = []

  $: schema = dataProvider?.schema
  $: schemaFields = getSchemaFields(schema, allowedFields)
  $: text = buttonText || "Edit filters"

  const getSchemaFields = (schema, allowedFields) => {
    let clonedSchema = {}
    if (!allowedFields?.length) {
      clonedSchema = schema
    } else {
      allowedFields?.forEach(field => {
        clonedSchema[field] = schema[field]
      })
    }
    return Object.values(clonedSchema || {})
  }

  const openEditor = () => {
    tmpFilters = [...filters]
    modal.show()
  }

  const updateQuery = () => {
    filters = [...tmpFilters]
  }
</script>

<div use:styleable={$component.styles}>
  <Button on:click={openEditor} secondary>
    {text}
  </Button>
  <Modal bind:this={modal}>
    <ModalContent title={text} size="XL" onConfirm={updateQuery}>
      <FilterModal bind:filters={tmpFilters} {schemaFields} />
    </ModalContent>
  </Modal>
</div>
