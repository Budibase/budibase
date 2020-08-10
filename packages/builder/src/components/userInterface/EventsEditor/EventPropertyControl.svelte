<script>
  import { Button } from "@budibase/bbui"
  import EventEditorModal from "./EventEditorModal.svelte"
  import { createEventDispatcher, getContext } from "svelte"

  export let value
  export let name

  const dispatch = createEventDispatcher()

  // Handle create app modal
  const { open, close } = getContext("simple-modal")

  const openModal = () => {
    open(
      EventEditorModal,
      {
        event: value,
        eventType: name,
        onChange: val => dispatch("change", val),
        onClose: () => {
          close()
        },
      },
      {
        closeButton: false,
        closeOnEsc: false,
        styleContent: { padding: 0 },
        closeOnOuterClick: true,
      }
    )
  }
</script>

<Button secondary small on:click={openModal}>Define Actions</Button>

<style>

</style>
