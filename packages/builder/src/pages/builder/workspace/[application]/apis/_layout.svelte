<script lang="ts">
  import { Layout } from "@budibase/bbui"
  import DatasourceNavigator from "@/components/backend/DatasourceNavigator/DatasourceNavigator.svelte"
  import Panel from "@/components/design/Panel.svelte"
  import { isActive, redirect } from "@roxi/routify"
  import { datasources, builderStore } from "@/stores/builder"
  import NavHeader from "@/components/common/NavHeader.svelte"
  import TopBar from "@/components/common/TopBar.svelte"
  import { getHorizontalResizeActions } from "@/components/common/resizable"
  import { IntegrationTypes } from "@/constants/backend"
  import type { Datasource, UIInternalDatasource } from "@budibase/types"
  import { onMount } from "svelte"
  import APIModal from "./_components/APIModal.svelte"

  let searchValue: string
  let panelWidth = 260
  let apiModal: APIModal

  const loadPanelWidth = () => {
    const saved = localStorage.getItem("api-panel-width")
    if (saved) {
      const width = parseInt(saved, 10)
      if (width && width > 100 && width < window.innerWidth) {
        panelWidth = width
      }
    }
  }

  type SortableDatasource = Pick<Datasource | UIInternalDatasource, "name">

  const sortByDatasourceName = (a: SortableDatasource, b: SortableDatasource) =>
    (a.name || "").localeCompare(b.name || "", undefined, {
      sensitivity: "base",
    })

  const datasourceFilter = (datasource: any) =>
    datasource.source === IntegrationTypes.REST

  const [resizable, resizableHandle] = getHorizontalResizeActions(
    panelWidth,
    (width: number) => {
      if (width) {
        localStorage.setItem("api-panel-width", width.toString())
        panelWidth = width
      }
    }
  )

  onMount(() => {
    loadPanelWidth()
  })

  $: restDatasources = ($datasources.list || []).filter(
    datasource => datasource.source === IntegrationTypes.REST
  )
  $: hasRestDatasources = restDatasources.length > 0

  const APIS_BASE_ROUTE = "/builder/workspace/:application/apis"

  $: shouldRedirectToNew =
    !hasRestDatasources && !$isActive("./new") && $isActive(APIS_BASE_ROUTE)

  $: if (shouldRedirectToNew) {
    $redirect("./new")
  }
</script>

<APIModal bind:this={apiModal} />

<!-- routify:options index=1 -->
<div class="wrapper" class:resizing-panel={$builderStore.isResizingPanel}>
  <TopBar icon="webhooks-logo" breadcrumbs={[{ text: "APIs" }]}></TopBar>
  <div class="data">
    {#if !$isActive("./new")}
      <div class="panel-container" style="width: {panelWidth}px;" use:resizable>
        <Panel borderRight={false} borderBottomHeader={false} resizable={true}>
          <span class="panel-title-content" slot="panel-title-content">
            <NavHeader
              title="APIs"
              placeholder="Search APIs"
              bind:value={searchValue}
              onAdd={() => {
                apiModal.show()
              }}
            />
          </span>
          <Layout paddingX="L" paddingY="none" gap="S">
            <DatasourceNavigator
              searchTerm={searchValue}
              {datasourceFilter}
              datasourceSort={sortByDatasourceName}
              showAppUsers={false}
              showManageRoles={false}
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
