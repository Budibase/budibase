<script>
  import { store } from "builderStore"
  import ComponentsHierarchy from "components/userInterface/ComponentsHierarchy.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import { Button, Spacer, Modal, Heading } from "@budibase/bbui"

  let modal
</script>

<Heading small>Screens</Heading>
<PagesList />

<Button primary wide on:click={modal.show}>Create New Screen</Button>
<div class="nav-items-container">
  <PageLayout layout={$store.pages[$store.currentPageName]} />
  <ComponentsHierarchy screens={$store.screens} />
</div>

<Modal bind:this={modal}>
  <NewScreenModal />
</Modal>
