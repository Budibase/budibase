<script>
  import { getContext } from "svelte"
  import { Modal, ActionButton } from "@budibase/bbui"
  import GridCreateViewModal from "../../modals/grid/GridCreateViewModal.svelte"

  const { rows, columns } = getContext("grid")

  let modal

  $: disabled = !$columns.length || !$rows.length
</script>

<ActionButton {disabled} icon="CollectionAdd" quiet on:click={modal.show}>
  Add view
</ActionButton>
<Modal bind:this={modal}>
  <GridCreateViewModal />
</Modal>
