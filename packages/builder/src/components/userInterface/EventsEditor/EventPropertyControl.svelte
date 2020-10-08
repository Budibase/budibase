<script>
  import { Button, Modal } from "@budibase/bbui"
  import EventEditorModal from "./EventEditorModal.svelte"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let value
  export let name

  let modal
</script>

<Button secondary small on:click={modal.show}>Define Actions</Button>

<Modal bind:this={modal} width="600px">
  <EventEditorModal event={value} eventType={name} on:change />
</Modal>
