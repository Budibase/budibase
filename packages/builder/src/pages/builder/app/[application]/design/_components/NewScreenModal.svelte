<script lang="ts">
  import { Modal, ModalContent } from "@budibase/bbui"
  import NewScreen from "../_components/NewScreen/index.svelte"
  import { screenStore } from "@/stores/builder"

  let modal: Modal
  export const show = () => modal.show()

  $: hasScreens = $screenStore.screens?.length
  $: title = hasScreens ? "Create new screen" : "Create your first screen"
</script>

<Modal bind:this={modal}>
  <ModalContent
    {title}
    size="XL"
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="subHeading">
      Start from scratch or create screens from your data
    </div>
    <NewScreen />
  </ModalContent>
</Modal>
