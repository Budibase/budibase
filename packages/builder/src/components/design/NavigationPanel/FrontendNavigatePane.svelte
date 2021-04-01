<script>
  import { onMount } from "svelte"
  import { goto, params } from "@sveltech/routify"
  import {
    store,
    allScreens,
    selectedAccessRole,
    screenSearchString,
  } from "builderStore"
  import { roles } from 'stores/backend/'
  import { FrontendTypes } from "constants"
  import ComponentNavigationTree from "components/design/NavigationPanel/ComponentNavigationTree/index.svelte"
  import Layout from "components/design/NavigationPanel/Layout.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import NewLayoutModal from "components/design/NavigationPanel/NewLayoutModal.svelte"
  import { Modal, Switcher, Select, Input } from "@budibase/bbui"

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
  $: tab = $params.assetType

  const navigate = ({ detail }) => {
    if (!detail) {
      return
    }
    $goto(`../${detail.heading.key}`)
  }

  const updateAccessRole = event => {
    const role = event.target.value

    // Select a valid screen with this new role - otherwise we'll not be
    // able to change role at all because ComponentNavigationTree will kick us
    // back the current role again because the same screen ID is still selected
    const firstValidScreenId = $allScreens.find(
      screen => screen.routing.roleId === role
    )?._id
    if (firstValidScreenId) {
      store.actions.screens.select(firstValidScreenId)
    }

    // Otherwise clear the selected screen ID so that the first new valid screen
    // can be selected by ComponentNavigationTree
    else {
      store.update(state => {
        state.selectedScreenId = null
        return state
      })
    }

    selectedAccessRole.set(role)
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
          on:change={updateAccessRole}
          value={$selectedAccessRole}
          label="Filter by Access">
          {#each $roles as role}
            <option value={role._id}>{role.name}</option>
          {/each}
        </Select>
        <div class="search-screens">
          <Input
            extraThin
            placeholder="Enter a route to search"
            label="Search Screens"
            bind:value={$screenSearchString} />
          <i
            class="ri-close-line"
            on:click={() => ($screenSearchString = null)} />
        </div>
      </div>
      <div class="nav-items-container">
        <ComponentNavigationTree />
      </div>
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    margin-bottom: var(--spacing-m);
    gap: var(--spacing-m);
  }

  .search-screens {
    position: relative;
  }
  .search-screens i {
    right: 2px;
    bottom: 2px;
    position: absolute;
    box-sizing: border-box;
    padding: var(--spacing-s);
    border-left: 1px solid var(--grey-4);
    background-color: var(--grey-2);
    border-top-right-radius: var(--border-radius-m);
    border-bottom-right-radius: var(--border-radius-m);
    color: var(--grey-7);
    font-size: 14px;
    line-height: 15px;
    top: auto;
  }
</style>
