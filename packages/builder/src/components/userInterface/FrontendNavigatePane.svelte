<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { store, currentAsset } from "builderStore"
  import ComponentNavigationTree from "components/userInterface/ComponentNavigationTree/index.svelte"
  import Layout from "components/userInterface/Layout.svelte"
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
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
  }
  .title i {
    font-size: 20px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>
