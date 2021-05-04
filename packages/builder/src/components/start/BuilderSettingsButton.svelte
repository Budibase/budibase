<script>
  import { Button, Modal } from "@budibase/bbui"
  import BuilderSettingsModal from "./BuilderSettingsModal.svelte"

  let modal
</script>

<div>
  <Button primary quiet icon="Settings" text on:click={modal.show}>
    Settings
  </Button>
</div>
<Modal bind:this={modal} width="30%">
  <BuilderSettingsModal />
</Modal>
