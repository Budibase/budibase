<script>
  import { Button, Modal } from "@budibase/bbui"
  import EventEditorModal from "./EventEditorModal.svelte"

  export let value
  export let name

  let eventsModal
</script>

<Button secondary small on:click={eventsModal.show}>Define Actions</Button>

<Modal bind:this={eventsModal} maxWidth="100vw" hideCloseButton>
  <EventEditorModal
    event={value}
    eventType={name}
    on:change
    on:close={eventsModal.hide} />
</Modal>

<style>

</style>
