<script>
  import { onMount } from "svelte"
  import { store, currentAsset } from "builderStore"
  import api from "builderStore/api"
  import ComponentNavigationTree from "components/userInterface/ComponentNavigationTree/index.svelte"
  import Layout from "components/userInterface/Layout.svelte"
  import LayoutsList from "components/userInterface/LayoutsList.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import { Modal } from "@budibase/bbui"

  let modal

  let routes = {}

  onMount(() => {
    store.actions.routing.fetch()
  })
</script>

<div class="title">
  <h1>Screens</h1>
  <i on:click={modal.show} data-cy="new-screen" class="ri-add-circle-fill" />
</div>
<LayoutsList />

{#if $store.currentFrontEndType === "layout" && $currentAsset}
<div class="nav-items-container">
  <Layout layout={$currentAsset} />
  <ComponentNavigationTree />
</div>
<Modal bind:this={modal}>
  <NewScreenModal />
</Modal>
{/if}

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
