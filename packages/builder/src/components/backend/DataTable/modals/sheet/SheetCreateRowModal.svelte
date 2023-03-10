<script>
  import CreateEditRow from "../../modals/CreateEditRow.svelte"
  import { getContext, onMount } from "svelte"
  import { Modal } from "@budibase/bbui"

  const { subscribe } = getContext("sheet")

  let modal
  onMount(() => subscribe("add-row", modal.show))
</script>

<Modal bind:this={modal}>
  <CreateEditRow />
</Modal>
