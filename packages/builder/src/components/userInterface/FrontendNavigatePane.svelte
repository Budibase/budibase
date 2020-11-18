<script>
  import { onMount } from "svelte"
  import { store, currentScreens } from "builderStore"
  import api from "builderStore/api"
  import ComponentsHierarchy from "components/userInterface/ComponentNavigationTree/index.svelte"
  import PageLayout from "components/userInterface/PageLayout.svelte"
  import PagesList from "components/userInterface/PagesList.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import { Modal } from "@budibase/bbui"

  let modal

  let routes = {}

  async function fetchRoutes() {
    // fetch the routing stuff here
    const response = await api.get("/api/routing")
    const json = await response.json()

    console.log(json)

    routes = json.routes
  }

  onMount(() => {
    fetchRoutes()
  })
</script>

<div class="title">
  <h1>Screens</h1>
  <i on:click={modal.show} data-cy="new-screen" class="ri-add-circle-fill" />
</div>
<PagesList />
<div class="nav-items-container">
  <PageLayout layout={$store.pages[$store.currentPageName]} />
  <ComponentsHierarchy {routes} />
</div>
<Modal bind:this={modal}>
  <NewScreenModal />
</Modal>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .title h1 {
    font-size: var(--font-size-m);
    font-weight: 500;
    margin: 0;
  }
  .title i {
    font-size: 20px;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
