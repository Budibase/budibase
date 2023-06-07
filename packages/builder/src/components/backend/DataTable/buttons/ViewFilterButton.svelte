<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import FilterModal from "../modals/FilterModal.svelte"

  export let view = {}

  let modal
</script>

<ActionButton
  icon="Filter"
  quiet
  on:click={modal.show}
  active={view.filters?.length}
>
  Filter
</ActionButton>
<Modal bind:this={modal}>
  <FilterModal {view} />
</Modal>
