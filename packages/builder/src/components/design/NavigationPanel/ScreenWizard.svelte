<script>
  import NavigationSelectionModal from "components/design/NavigationPanel/NavigationSelectionModal.svelte"
  import ScreenDetailsModal from "components/design/NavigationPanel/ScreenDetailsModal.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import { Modal } from "@budibase/bbui"

  let newScreenModal
  let navigationSelectionModal
  let screenDetailsModal
  let screenName = ""
  let url = ""
  let selectedScreens = []

  export const showModal = () => {
    newScreenModal.show()
  }

  const chooseModal = index => {
    /*
    0 = newScreenModal
    1 = screenDetailsModal
    2 = navigationSelectionModal
    */
    if (index === 0) {
      newScreenModal.show()
    } else if (index === 1) {
      screenDetailsModal.show()
    } else if (index === 2) {
      navigationSelectionModal.show()
    }
  }
</script>

<Modal bind:this={newScreenModal}>
  <NewScreenModal bind:selectedScreens {chooseModal} />
</Modal>

<Modal bind:this={screenDetailsModal}>
  <ScreenDetailsModal bind:screenName bind:url {chooseModal} />
</Modal>
<Modal bind:this={navigationSelectionModal}>
  <NavigationSelectionModal
    bind:url
    bind:screenName
    bind:selectedScreens
    {chooseModal}
  />
</Modal>
