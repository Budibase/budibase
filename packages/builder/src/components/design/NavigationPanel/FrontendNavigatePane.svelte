<script>
  import { onMount } from "svelte"
  import { goto, params } from "@roxi/routify"
  import {
    store,
    allScreens,
    selectedAccessRole,
    screenSearchString,
  } from "builderStore"
  import { roles } from "stores/backend"
  import ComponentNavigationTree from "components/design/NavigationPanel/ComponentNavigationTree/index.svelte"
  import Layout from "components/design/NavigationPanel/Layout.svelte"
  import NewScreenModal from "components/design/NavigationPanel/NewScreenModal.svelte"
  import NewLayoutModal from "components/design/NavigationPanel/NewLayoutModal.svelte"
  import { Modal, Select, Input, Tabs, Tab } from "@budibase/bbui"

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
  $: selected = tabs.find(t => t.key === $params.assetType).title

  const navigate = ({ detail }) => {
    const { key } = tabs.find(t => t.title === detail)
    $goto(`../${key}`)
  }

  const updateAccessRole = event => {
    const role = event.detail

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
  <Tabs {selected} on:select={navigate}>
    <Tab title="Screens">
      <div class="tab-content-padding">
        <div class="role-select">
          <Select
            on:change={updateAccessRole}
            value={$selectedAccessRole}
            label="Filter by Access"
            getOptionLabel={role => role.name}
            getOptionValue={role => role._id}
            options={$roles} />
          <div class="search-screens">
            <Input
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
      </div>
    </Tab>
    <Tab title="Layouts">
      <div class="tab-content-padding">
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
      </div>
    </Tab>
  </Tabs>
  <i on:click={modal.show} data-cy="new-screen" class="ri-add-circle-fill" />
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
    top: var(--spacing-l);
    right: var(--spacing-l);
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

  .tab-content-padding {
    padding: 0 var(--spacing-s);
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
