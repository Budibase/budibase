<script>
  import { ActionButton, Modal, ModalContent } from "@budibase/bbui"
  import { getContext, createEventDispatcher } from "svelte"

  const { datasource } = getContext("grid")
  const dispatch = createEventDispatcher()

  let modal
</script>

<ActionButton icon="WebPage" quiet on:click={modal?.show}>
  Configure calculations
</ActionButton>

<Modal bind:this={modal}>
  <ModalContent title="Calculations" confirmText="Save" size="L">
    Show calculations which are based on
  </ModalContent>
</Modal>
