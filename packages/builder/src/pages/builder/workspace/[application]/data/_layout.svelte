<script>
  import { Layout } from "@budibase/bbui"
  import DatasourceNavigator from "@/components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { isActive, redirect, goto, params } from "@roxi/routify"
  import { datasources, builderStore } from "@/stores/builder"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { getHorizontalResizeActions } from "@/components/common/resizable"
  import { onMount, onDestroy } from "svelte"

  let searchValue
  let maxWidth = window.innerWidth / 3

  const updateMaxWidth = () => {
    maxWidth = window.innerWidth / 3
  }

  const [resizable, resizableHandle] = getHorizontalResizeActions(
    260,
    width => {
      if (width > maxWidth) {
        const element = document.querySelector(".panel-container")
        if (element) {
          element.style.width = `${maxWidth}px`
        }
      }
    }
  )

  onMount(() => {
    window.addEventListener("resize", updateMaxWidth)
  })

  onDestroy(() => {
    window.removeEventListener("resize", updateMaxWidth)
  })

  $: {
    // If we ever don't have any data other than the users table, prompt the
    // user to add some
    // Don't redirect if setting up google sheets, or we lose the query parameter
    if (!$datasources.hasData && !$params["?continue_google_setup"]) {
      $redirect("./new")
    }
  }
</script>

<!-- routify:options index=1 -->
<div class="wrapper" class:resizing-panel={$builderStore.isResizingPanel}>
  <TopBar breadcrumbs={[{ text: "Data" }]} icon="database"></TopBar>
  <div class="data">
    {#if !$isActive("./new")}
      <div class="panel-container" use:resizable>
        <Panel borderRight={false} borderBottomHeader={false} resizable={true}>
          <span class="panel-title-content" slot="panel-title-content">
            <NavHeader
              title="Sources"
              placeholder="Search for sources"
              bind:value={searchValue}
              onAdd={() => $goto("./new")}
            />
          </span>
          <Layout paddingX="L" paddingY="none" gap="S">
            <DatasourceNavigator searchTerm={searchValue} />
          </Layout>
        </Panel>
        <div class="divider">
          <div
            class="dividerClickExtender"
            role="separator"
            use:resizableHandle
          />
        </div>
      </div>
    {/if}

    <div class="content">
      <slot />
    </div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
  }
  .data {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    height: 0;
  }
  .panel-container {
    display: flex;
    min-width: 260px;
    width: 260px;
    max-width: 33.33vw;
    height: 100%;
  }
  .content {
    padding: 28px 40px 40px 40px;
    overflow-y: auto;
    gap: var(--spacing-l);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1 1 auto;
    z-index: 1;
    position: relative;
  }

  .panel-title-content {
    display: contents;
  }

  .divider {
    position: relative;
    height: 100%;
    width: 2px;
    background: var(--spectrum-global-color-gray-200);
    transition: background 130ms ease-out;
    min-width: 2px;
    z-index: 2;
  }
  .divider:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: col-resize;
  }
  .dividerClickExtender {
    position: absolute;
    cursor: col-resize;
    height: 100%;
    width: 12px;
    left: -5px;
    top: 0;
  }
  .wrapper.resizing-panel {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>
