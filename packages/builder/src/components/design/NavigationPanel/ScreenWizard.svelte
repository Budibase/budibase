<script>
  import NavigationSelectionModal from "components/design/NavigationPanel/NavigationSelectionModal.svelte"
  import ScreenNameModal from "components/design/NavigationPanel/ScreenNameModal.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import { Modal } from "@budibase/bbui"

  let modal
  let navigationSelectionModal
  let screenNameModal
  let screenName = ""
  let url = ""
  let selectedScreens = []

  export function showModal() {
    modal.show()
  }
</script>

<Modal bind:this={modal}>
  <NewScreenModal
    {screenNameModal}
    {navigationSelectionModal}
    bind:selectedScreens
  />
</Modal>

<Modal bind:this={screenNameModal}>
  <ScreenNameModal
    bind:screenName
    bind:url
    {modal}
    {navigationSelectionModal}
  />
</Modal>
<Modal bind:this={navigationSelectionModal}>
  <NavigationSelectionModal
    bind:url
    bind:screenName
    {modal}
    bind:selectedScreens
    {screenNameModal}
  />
</Modal>
