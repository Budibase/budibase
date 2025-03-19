<script lang="ts">
  import { Button, Modal } from "@budibase/bbui"
  import OAuth2ConfigModalContent from "./OAuth2ConfigModalContent.svelte"

  let modal: Modal

  function openModal() {
    modal.show()
  }
</script>

<Button cta size="M" on:click={openModal}>Add OAuth2</Button>
<Modal bind:this={modal}>
  <OAuth2ConfigModalContent />
</Modal>
