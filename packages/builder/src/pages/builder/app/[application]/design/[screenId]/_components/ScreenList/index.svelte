<script lang="ts">
  import { Layout } from "@budibase/bbui"
  import { contextMenuStore, sortedScreens } from "@/stores/builder"
  import ScreenNavItem from "./ScreenNavItem.svelte"
  import { goto } from "@roxi/routify"
  import { getVerticalResizeActions } from "@/components/common/resizable"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import type { ProjectApp, Screen } from "@budibase/types"
  import { projectAppStore } from "@/stores/builder/projectApps"
  import ProjectAppNavItem from "./ProjectAppNavItem.svelte"
  import ProjectAppModal from "../ProjectApp/ProjectAppModal.svelte"

  $: projectAppsEnabled = true

  const [resizable, resizableHandle] = getVerticalResizeActions()

  let searching = false
  let searchValue = ""
  let screensContainer: HTMLDivElement
  let scrolling = false

  let projectAppModal: ProjectAppModal
  let selectedProjectApp: ProjectApp | undefined

  $: filteredScreens = getFilteredScreens($sortedScreens, searchValue)

  const handleOpenSearch = async () => {
    screensContainer.scroll({ top: 0, behavior: "smooth" })
  }

  $: projectApps = $projectAppStore.projectApps

  $: {
    if (searching) {
      handleOpenSearch()
    }
  }

  const getFilteredScreens = (screens: Screen[], searchValue: string) => {
    return screens.filter(screen => {
      return !searchValue || screen.routing.route.includes(searchValue)
    })
  }

  const handleScroll = (e: any) => {
    scrolling = e.target.scrollTop !== 0
  }

  const onAdd = (e: Event) => {
    if (!projectAppsEnabled) {
      return $goto("../new")
    }

    const items = [
      {
        name: "Add app",
        keyBind: null,
        visible: true,
        disabled: false,
        callback: () => {
          projectAppModal.show()
        },
        isNew: true,
      },
      {
        name: "Add screen",
        keyBind: null,
        visible: true,
        callback: () => $goto("../new"),
      },
    ]

    const boundingBox = (e.currentTarget as HTMLElement).getBoundingClientRect()

    contextMenuStore.open("newProject", items, {
      x: boundingBox.x,
      y: boundingBox.y + boundingBox.height,
    })
  }

  function onEditProjectApp(projectApp: ProjectApp) {
    selectedProjectApp = projectApp
    projectAppModal.show()
  }
</script>

<div class="screens" class:searching use:resizable>
  <div class="header" class:scrolling>
    <NavHeader
      title="Screens"
      placeholder="Search for screens"
      bind:value={searchValue}
      bind:search={searching}
      {onAdd}
    />
  </div>
  <div on:scroll={handleScroll} bind:this={screensContainer} class="content">
    {#if projectAppsEnabled}
      {#each projectApps as projectApp}
        <ProjectAppNavItem
          {projectApp}
          on:edit={() => onEditProjectApp(projectApp)}
        />
      {/each}
    {:else if filteredScreens?.length}
      {#each filteredScreens as screen (screen._id)}
        <ScreenNavItem {screen} />
      {/each}
    {:else}
      <Layout paddingY="none" paddingX="L">
        <div class="no-results">
          There aren't any screens matching that route
        </div>
      </Layout>
    {/if}
  </div>

  <div
    role="separator"
    class="divider"
    class:disabled={searching}
    use:resizableHandle
  />
</div>

<ProjectAppModal
  bind:this={projectAppModal}
  projectApp={selectedProjectApp}
  on:hide={() => (selectedProjectApp = undefined)}
/>

<style>
  .screens {
    display: flex;
    flex-direction: column;
    min-height: 147px;
    max-height: calc(100% - 147px);
    position: relative;
    transition: height 300ms ease-out, max-height 300ms ease-out;
    height: 210px;
  }
  .screens.searching {
    max-height: 100%;
    height: 100% !important;
  }

  .header {
    flex-shrink: 0;
    position: relative;
    height: 50px;
    box-sizing: border-box;
    padding: 0 var(--spacing-l);
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 130ms ease-out;
  }
  .header.scrolling {
    border-bottom: var(--border-light);
  }

  .content {
    overflow: auto;
    flex-grow: 1;
  }

  .screens :global(.nav-item) {
    padding-right: 8px !important;
  }

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }

  .divider {
    position: absolute;
    bottom: 0;
    transform: translateY(50%);
    height: 16px;
    width: 100%;
  }
  .divider:after {
    content: "";
    position: absolute;
    background: var(--spectrum-global-color-gray-200);
    height: 2px;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    transition: background 130ms ease-out;
  }
  .divider:hover {
    cursor: row-resize;
  }
  .divider:hover:after {
    background: var(--spectrum-global-color-gray-300);
  }
  .divider.disabled {
    cursor: auto;
  }
  .divider.disabled:after {
    background: var(--spectrum-global-color-gray-200);
  }
</style>
