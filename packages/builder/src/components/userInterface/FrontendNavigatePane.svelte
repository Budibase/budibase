<script>
  import { onMount } from "svelte"
  import { goto, isActive, leftover, url } from "@sveltech/routify"
  import { store, currentAsset } from "builderStore"
  import { FrontendTypes } from "constants"
  import api from "builderStore/api"
  import ComponentNavigationTree from "components/userInterface/ComponentNavigationTree/index.svelte"
  import Layout from "components/userInterface/Layout.svelte"
  import LayoutsList from "components/userInterface/LayoutsList.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import { Modal, Switcher, Button, Spacer } from "@budibase/bbui"

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

  function navigate({ detail }) {
    if (!detail) return
    $goto(`./${detail.heading.key}`)
  }

  onMount(() => {
    store.actions.routing.fetch()
  })
</script>

<div class="title">
  <Switcher headings={tabs} bind:value={tab} on:change={navigate}>
    {#if tab === 'screens'}
      <i
        on:click={modal.show}
        data-cy="new-screen"
        class="ri-add-circle-fill" />
      {#if $currentAsset}
        <div class="nav-items-container">
          <ComponentNavigationTree />
        </div>
      {/if}
      <Modal bind:this={modal}>
        <NewScreenModal />
      </Modal>
    {:else if tab === 'layouts'}
      {#each $store.layouts as layout}
        <Layout {layout} />
      {/each}
    {/if}
  </Switcher>
</div>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .title i {
    font-size: 20px;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
