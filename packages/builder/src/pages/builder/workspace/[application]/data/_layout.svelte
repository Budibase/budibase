<script>
  import { Layout } from "@budibase/bbui"
  import DatasourceNavigator from "@/components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { isActive, redirect, goto, params } from "@roxi/routify"
  import { datasources, builderStore } from "@/stores/builder"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { getHorizontalResizeActions } from "@/components/common/resizable"
  import { onMount, onDestroy, setContext } from "svelte"
  import { IntegrationTypes } from "@/constants/backend"

  let searchValue
  const MIN_PANEL_WIDTH = 260
  let maxWidth = Math.max(window.innerWidth / 3, MIN_PANEL_WIDTH)
  let panelWidth = MIN_PANEL_WIDTH

  // Load persisted panel width from localStorage
  const loadPanelWidth = () => {
    const saved = localStorage.getItem("datasource-panel-width")
    if (!saved) {
      return
    }

    const width = parseInt(saved, 10)
    if (!Number.isFinite(width)) {
      return
    }

    const clamped = Math.max(MIN_PANEL_WIDTH, Math.min(width, maxWidth))
    panelWidth = clamped
  }

  const updateMaxWidth = () => {
    maxWidth = Math.max(window.innerWidth / 3, MIN_PANEL_WIDTH)
  }

  let gridDispatch = null

  // Function to be called by child components to register grid dispatch
  const registerGridDispatch = dispatch => {
    gridDispatch = dispatch
  }

  // Make registerGridDispatch available to child components
  setContext("data-layout", { registerGridDispatch })

  const [resizable, resizableHandle] = getHorizontalResizeActions(
    panelWidth,
    width => {
      if (width) {
        localStorage.setItem("datasource-panel-width", width.toString())
        panelWidth = width
      }
    },
    () => {
      // Callback for when resize starts - close any open popovers
      if (gridDispatch) {
        gridDispatch("close-edit-column", {})
      }
    }
  )

  onMount(() => {
    loadPanelWidth()
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
      <div class="panel-container" style="width: {panelWidth}px;" use:resizable>
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
            <DatasourceNavigator
              searchTerm={searchValue}
              datasourceFilter={datasource =>
                datasource.source !== IntegrationTypes.REST}
            />
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

    <div class="content drawer-container">
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
    min-width: 262px;
    width: 260px;
    max-width: 33.33vw;
    height: 100%;
    overflow: visible;
    transition: width 300ms ease-out;
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
    z-index: 2;
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
    z-index: 1;
    flex-shrink: 0;
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
