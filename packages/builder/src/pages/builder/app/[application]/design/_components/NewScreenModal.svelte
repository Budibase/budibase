<script lang="ts">
  import { Modal, ModalContent } from "@budibase/bbui"
  import NewScreen from "../_components/NewScreen/index.svelte"

  let modal: Modal
  export const show = () => modal.show()
</script>

<Modal bind:this={modal}>
  <ModalContent title="Create new screen" size="XL">
    <NewScreen />
  </ModalContent>
</Modal>
