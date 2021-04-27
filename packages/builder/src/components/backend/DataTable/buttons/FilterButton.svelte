<script>
  import { Button, Modal } from "@budibase/bbui"
  import FilterModal from "../modals/FilterModal.svelte"

  export let view = {}

  let modal
</script>

<Button
  icon="Filter"
  primary
  size="S"
  quiet
  on:click={modal.show}
  active={view.filters?.length}>
  Filter
</Button>
<Modal bind:this={modal}>
  <FilterModal {view} />
</Modal>
