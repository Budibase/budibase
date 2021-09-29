<script>
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"
  import FilterDrawer from "components/design/PropertiesPanel/PropertyControls/FilterEditor/FilterDrawer.svelte"

  export let schema
  export let filters

  const dispatch = createEventDispatcher()
  let modal
  let tempValue = filters || []

  $: schemaFields = Object.values(schema || {})
</script>

<ActionButton
  icon="Filter"
  size="S"
  quiet
  on:click={modal.show}
  active={tempValue?.length > 0}
>
  Filter
</ActionButton>
<Modal bind:this={modal}>
  <ModalContent
    title="Filter"
    confirmText="Save"
    size="XL"
    onConfirm={() => dispatch("change", tempValue)}
  >
    <div class="wrapper">
      <FilterDrawer
        allowBindings={false}
        bind:filters={tempValue}
        {schemaFields}
      />
    </div>
  </ModalContent>
</Modal>

<style>
  .wrapper :global(.main) {
    padding: 0;
  }
</style>
