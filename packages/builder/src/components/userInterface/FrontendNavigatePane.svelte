<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { store, currentAsset } from "builderStore"
  import { FrontendTypes } from "constants"
  import api from "builderStore/api"
  import ComponentNavigationTree from "components/userInterface/ComponentNavigationTree/index.svelte"
  import Layout from "components/userInterface/Layout.svelte"
  import LayoutsList from "components/userInterface/LayoutsList.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import { Modal, Switcher } from "@budibase/bbui"

  const tabs = [
    {
      title: "Screens",
      key: "screens",
    },
    {
      title: "Layouts",
      key: "layouts",
    },
  ]

  let modal
  let routes = {}
  let tab = "screens"

  function reroute({ detail }) {
    if (!detail) return
    $goto(`./${detail.heading.key}`)
  }

  onMount(() => {
    store.actions.routing.fetch()
  })
</script>

<div class="title">
  <Switcher headings={tabs} bind:value={tab} on:change={reroute}>
    {#if tab === 'screens'}
      <i
        on:click={modal.show}
        data-cy="new-screen"
        class="ri-add-circle-fill" />
      <!-- <LayoutsList /> -->
      {#if $currentAsset}
        <div class="nav-items-container">
          <!-- <Layout layout={$currentAsset} /> -->
          <ComponentNavigationTree />
        </div>
      {/if}
      <Modal bind:this={modal}>
        <NewScreenModal />
      </Modal>
    {:else if tab === 'layouts'}
      <Layout />
    {/if}

  </Switcher>
</div>

<!-- {#if $store.currentFrontEndType === FrontendTypes.LAYOUT && $currentAsset} -->
<!-- <div class="nav-items-container"> -->
<!-- <Layout layout={$currentAsset} /> -->
<!-- <ComponentNavigationTree /> -->
<!-- </div> -->
<!-- <Modal bind:this={modal}> -->
<!-- <NewScreenModal /> -->
<!-- </Modal> -->
<!-- {/if} -->

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
