<script>
  import { ActionButton } from "@budibase/bbui"
  import DeleteMediaModal from "./DeleteMediaModal.svelte"
  import { createEventDispatcher } from "svelte"

  export let row

  const dispatch = createEventDispatcher()

  let deleteModal
</script>

<ActionButton size="S" on:click={deleteModal.show}>Delete</ActionButton>

<DeleteMediaModal
  media={row}
  bind:this={deleteModal}
  onDeleteSuccess={async () => {
    dispatch("buttonclick")
  }}
/>
