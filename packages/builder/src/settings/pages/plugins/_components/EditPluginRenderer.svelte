<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import EditPluginModal from "./EditPluginModal.svelte"

  export let row

  let editPluginModal
</script>

<ActionButton size="S" on:click={editPluginModal.show}>Edit</ActionButton>

<Modal bind:this={editPluginModal}>
  <EditPluginModal plugin={row} />
</Modal>
