<script>
  import { store } from "builderStore"
  import ComponentsHierarchy from "components/userInterface/ComponentsHierarchy.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import { Button, Spacer, Modal } from "@budibase/bbui"

  let modal
</script>

<PagesList />

<Spacer medium />
<Button primary wide on:click={modal.show}>Create New Screen</Button>
<Spacer medium />
<PageLayout layout={$store.pages[$store.currentPageName]} />

<div class="nav-items-container">
  <ComponentsHierarchy screens={$store.screens} />
</div>

<Modal bind:this={modal}>
  <NewScreenModal />
</Modal>
