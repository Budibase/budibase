<script>
  import { onMount, setContext } from "svelte"
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
  import NewLayoutModal from "components/design/NavigationPanel/NewLayoutModal.svelte"
  import {
    Icon,
    Modal,
    Select,
    Search,
    Tabs,
    Tab,
    Layout as BBUILayout,
    notifications,
  } from "@budibase/bbui"

  export let showModal

  let scrollRef

  const scrollTo = bounds => {
    if (!bounds) {
      return
    }

    const sidebarWidth = 259
    const navItemHeight = 32
    const { scrollLeft, scrollTop, offsetHeight } = scrollRef

    let scrollBounds = scrollRef.getBoundingClientRect()
    let newOffsets = {}

    // Calculate left offset
    const offsetX = bounds.left + bounds.width + scrollLeft + 20
    if (offsetX > sidebarWidth) {
      newOffsets.left = offsetX - sidebarWidth
    } else {
      newOffsets.left = 0
    }
    if (newOffsets.left === scrollLeft) {
      delete newOffsets.left
    }

    // Calculate top offset
    const offsetY = bounds.top - scrollBounds?.top + scrollTop
    if (offsetY > scrollTop + offsetHeight - 2 * navItemHeight) {
      newOffsets.top = offsetY - offsetHeight + 2 * navItemHeight
    } else if (offsetY < scrollTop + navItemHeight) {
      newOffsets.top = offsetY - navItemHeight
    } else {
      delete newOffsets.top
    }

    // Skip if offset is unchanged
    if (newOffsets.left == null && newOffsets.top == null) {
      return
    }

    // Smoothly scroll to the offset
    scrollRef.scroll({
      ...newOffsets,
      behavior: "smooth",
    })
  }

  setContext("scroll", {
    scrollTo,
  })

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
  let newLayoutModal
  $: selected = tabs.find(t => t.key === $params.assetType)?.title || "Screens"

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

  onMount(async () => {
    try {
      await store.actions.routing.fetch()
    } catch (error) {
      notifications.error("Error fetching routes")
    }
  })
</script>

<div class="title">
  <Tabs {selected} on:select={navigate}>
    <Tab title="Screens">
      <div class="tab-content-padding">
        <BBUILayout noPadding gap="XS">
          <Select
            on:change={updateAccessRole}
            value={$selectedAccessRole}
            label="Filter by Access"
            getOptionLabel={role => role.name}
            getOptionValue={role => role._id}
            options={$roles}
          />
          <Search
            placeholder="Enter a route to search"
            label="Search Screens"
            bind:value={$screenSearchString}
          />
        </BBUILayout>
        <div class="nav-items-container" bind:this={scrollRef}>
          <ComponentNavigationTree />
        </div>
      </div>
    </Tab>
    <Tab title="Layouts">
      <div class="tab-content-padding">
        <div
          class="nav-items-container nav-items-container--layouts"
          bind:this={scrollRef}
        >
          <div class="layouts-container">
            {#each $store.layouts as layout, idx (layout._id)}
              <Layout {layout} border={idx > 0} />
            {/each}
          </div>
        </div>
        <Modal bind:this={newLayoutModal}>
          <NewLayoutModal />
        </Modal>
      </div>
    </Tab>
  </Tabs>
  <div class="add-button">
    <Icon
      hoverable
      name="AddCircle"
      on:click={selected === "Layouts" ? newLayoutModal.show() : showModal()}
    />
  </div>
</div>

<style>
  .title {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    position: relative;
    flex: 1 1 auto;
  }
  .title :global(.spectrum-Tabs-content),
  .title :global(.spectrum-Tabs-content > div),
  .title :global(.spectrum-Tabs-content > div > div) {
    height: 100%;
  }

  .add-button {
    position: absolute;
    top: var(--spacing-l);
    right: var(--spacing-xl);
  }

  .tab-content-padding {
    padding: 0 var(--spacing-xl);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }

  .nav-items-container {
    border-top: var(--border-light);
    margin: 0 calc(-1 * var(--spacing-xl));
    padding: var(--spacing-m) 0;
    flex: 1 1 auto;
    overflow: auto;
    height: 0;
    position: relative;
  }
  .nav-items-container--layouts {
    border-top: none;
    margin-top: calc(-1 * var(--spectrum-global-dimension-static-size-150));
  }

  .layouts-container {
    min-width: max-content;
  }
</style>
