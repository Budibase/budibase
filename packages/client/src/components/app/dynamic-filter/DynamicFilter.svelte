<script>
  import { Button, ModalContent, Modal } from "@budibase/bbui"
  import { getContext } from "svelte"
  import FilterModal from "./FilterModal.svelte"

  export let dataProvider

  const component = getContext("component")
  const { styleable } = getContext("sdk")

  $: schema = dataProvider?.schema
  $: schemaFields = Object.values(schema || {})

  let modal
  let tmpFilters = []
  let filters = []

  const openEditor = () => {
    tmpFilters = [...filters]
    modal.show()
  }

  const updateQuery = () => {
    filters = [...tmpFilters]
  }
</script>

<div use:styleable={$component.styles}>
  <Button on:click={openEditor} secondary icon="FilterEdit">
    Edit filters
  </Button>
  <Modal bind:this={modal}>
    <ModalContent title="Edit filters" size="XL" onConfirm={updateQuery}>
      <FilterModal bind:filters={tmpFilters} {schemaFields} />
    </ModalContent>
  </Modal>
</div>
