<script>
  import { createEventDispatcher } from "svelte"
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"
  import FilterDrawer from "components/design/settings/controls/FilterEditor/FilterDrawer.svelte"

  export let schema
  export let filters
  export let disabled = false
  export let tableId

  const dispatch = createEventDispatcher()

  let modal

  $: tempValue = filters || []
  $: schemaFields = Object.values(schema || {})
  $: text = getText(filters)

  const getText = filters => {
    const count = filters?.filter(filter => filter.field)?.length
    return count ? `Filter (${count})` : "Filter"
  }
</script>

<ActionButton
  icon="Filter"
  quiet
  {disabled}
  on:click={modal.show}
  selected={tempValue?.length > 0}
>
  {text}
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
        {filters}
        {schemaFields}
        datasource={{ type: "table", tableId }}
        on:change={e => (tempValue = e.detail)}
      />
    </div>
  </ModalContent>
</Modal>

<style>
  .wrapper :global(.main) {
    padding: 0;
  }
</style>
