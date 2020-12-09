<script>
  import { onMount } from "svelte"
  import { goto, params, url } from "@sveltech/routify"
  import {
    store,
    currentAsset,
    backendUiStore,
    selectedAccessRole,
  } from "builderStore"
  import { FrontendTypes } from "constants"
  import ComponentNavigationTree from "components/userInterface/ComponentNavigationTree/index.svelte"
  import Layout from "components/userInterface/Layout.svelte"
  import NewScreenModal from "components/userInterface/NewScreenModal.svelte"
  import NewLayoutModal from "components/userInterface/NewLayoutModal.svelte"
  import { Modal, Switcher, Select } from "@budibase/bbui"

  const tabs = [
    {
      title: "Screens",
      key: "screen",
    },
    {
      title: "Layouts",
      key: "layout",
    },
  ]

  let modal
  let routes = {}
  let tab = $params.assetType

  function navigate({ detail }) {
    if (!detail) return
    $goto(`../${detail.heading.key}`)
  }

  onMount(() => {
    store.actions.routing.fetch()
  })
</script>

<div class="title">
  <Switcher headings={tabs} bind:value={tab} on:change={navigate}>
    {#if tab === FrontendTypes.SCREEN}
      <i
        on:click={modal.show}
        data-cy="new-screen"
        class="ri-add-circle-fill" />

      <div class="role-select">
        <Select
          extraThin
          secondary
          bind:value={$selectedAccessRole}
          label="Filter by Access">
          {#each $backendUiStore.roles as role}
            <option value={role._id}>{role.name}</option>
          {/each}
        </Select>
      </div>

      {#if $currentAsset}
        <div class="nav-items-container">
          <ComponentNavigationTree />
        </div>
      {/if}
      <Modal bind:this={modal}>
        <NewScreenModal />
      </Modal>
    {:else if tab === FrontendTypes.LAYOUT}
      <i
        on:click={modal.show}
        data-cy="new-layout"
        class="ri-add-circle-fill" />
      {#each $store.layouts as layout, idx (layout._id)}
        <Layout {layout} border={idx > 0} />
      {/each}
      <Modal bind:this={modal}>
        <NewLayoutModal />
      </Modal>
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

  .role-select {
    margin-bottom: var(--spacing-m);
  }
</style>
