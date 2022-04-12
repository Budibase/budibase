<script>
  import {
    store,
    currentAsset,
    selectedComponent,
    allScreens,
  } from "builderStore"
  import { Detail, Layout, Button, Icon } from "@budibase/bbui"

  import CurrentItemPreview from "components/design/AppPreview"
  import PropertiesPanel from "components/design/PropertiesPanel/PropertiesPanel.svelte"
  import ComponentSelectionList from "components/design/AppPreview/ComponentSelectionList.svelte"
  import FrontendNavigatePane from "components/design/NavigationPanel/FrontendNavigatePane.svelte"
  import { goto, leftover, params } from "@roxi/routify"
  import { FrontendTypes } from "constants"
  import { findComponent, findComponentPath } from "builderStore/componentUtils"
  import { get } from "svelte/store"
  import AppThemeSelect from "components/design/AppPreview/AppThemeSelect.svelte"
  import ThemeEditor from "components/design/AppPreview/ThemeEditor.svelte"
  import DevicePreviewSelect from "components/design/AppPreview/DevicePreviewSelect.svelte"
  import Logo from "assets/bb-space-man.svg"
  import ScreenWizard from "components/design/NavigationPanel/ScreenWizard.svelte"

  // Cache previous values so we don't update the URL more than necessary
  let previousType
  let previousAsset
  let previousComponentId
  let hydrationComplete = false

  // Manage the layout modal flow from here
  let showModal

  // Hydrate state from URL params
  $: hydrateStateFromURL($params, $leftover)

  // Keep URL in sync with state
  $: updateURLFromState(
    $store.currentFrontEndType,
    $currentAsset,
    $store.selectedComponentId
  )

  const hydrateStateFromURL = (params, leftover) => {
    if (hydrationComplete) {
      return
    } else {
      hydrationComplete = true
    }

    // Do nothing if no asset type, as that means we've left the page
    if (!params.assetType) {
      return
    }

    const state = get(store)
    const selectedAsset = get(currentAsset)

    // Hydrate asset type
    let assetType = params.assetType
    if (![FrontendTypes.LAYOUT, FrontendTypes.SCREEN].includes(assetType)) {
      assetType = FrontendTypes.SCREEN
    }
    if (assetType !== state.currentFrontEndType) {
      store.update(state => {
        state.currentFrontEndType = assetType
        return state
      })
    }

    // Hydrate asset
    const assetId = decodeURI(params.asset)
    let asset
    if (assetId) {
      let assetList
      let actions

      // Determine screens or layouts based on the URL
      if (assetType === FrontendTypes.SCREEN) {
        assetList = get(allScreens)
        actions = store.actions.screens
      } else {
        assetList = state.layouts
        actions = store.actions.layouts
      }

      // Find and select the current asset
      asset = assetList.find(asset => asset._id === assetId)
      if (asset && asset._id !== selectedAsset?._id) {
        actions.select(assetId)
      }
    }

    // Hydrate component ID if one is present in the URL
    const selectedComponentId = leftover.split("/").pop()
    if (asset && selectedComponentId) {
      const component = findComponent(asset.props, selectedComponentId)
      if (component && component._id !== state.selectedComponentId) {
        store.actions.components.select(component)
      }
    }
  }

  // Updates the route params in the URL to the specified values
  const updateURLFromState = (assetType, asset, componentId) => {
    // Check we have different params than last invocation
    if (
      assetType === previousType &&
      asset === previousAsset &&
      componentId === previousComponentId
    ) {
      return
    } else {
      previousType = assetType
      previousAsset = asset
      previousComponentId = componentId
    }

    // Extract current URL params
    const currentParams = get(params)
    const currentLeftover = get(leftover)
    const paramAssetType = currentParams.assetType
    const paramAssetId = currentParams.asset
    const paramComponentId = currentLeftover.split("/").pop()

    // Only update params if the params actually changed
    if (
      assetType !== paramAssetType ||
      asset?._id !== paramAssetId ||
      componentId !== paramComponentId
    ) {
      // Build and navigate to a valid URL
      let url = "../"
      if ([FrontendTypes.SCREEN, FrontendTypes.LAYOUT].includes(assetType)) {
        url += `${assetType}`
        if (asset?._id) {
          url += `/${asset._id}`
          if (componentId) {
            const componentPath = findComponentPath(asset?.props, componentId)
            const componentURL = componentPath
              .slice(1)
              .map(comp => comp._id)
              .join("/")
            url += `/${componentURL}`
          }
        }
      }
      $goto(url)
    }
  }
</script>

<!-- routify:options index=1 -->
<div class="root">
  <div class="ui-nav">
    <FrontendNavigatePane {showModal} />
  </div>

  <div class="preview-pane">
    {#if $currentAsset}
      <div class="preview-header">
        <ComponentSelectionList />
        {#if $store.clientFeatures.devicePreview}
          <DevicePreviewSelect />
        {/if}
        {#if $store.clientFeatures.customThemes}
          <ThemeEditor />
        {:else if $store.clientFeatures.spectrumThemes}
          <AppThemeSelect />
        {/if}
      </div>
      <div class="preview-content">
        {#key $store.version}
          <CurrentItemPreview />
        {/key}
      </div>
    {:else}
      <div class="centered">
        <div class="main">
          <Layout gap="S" justifyItems="center">
            <img class="img-size" alt="logo" src={Logo} />
            <div class="new-screen-text">
              <Detail size="M">LET’S BRING THIS APP TO LIFE</Detail>
            </div>
            <Button on:click={() => showModal()} size="M" cta>
              <div class="new-screen-button">
                <div class="background-icon" style="color: white;">
                  <Icon name="Add" />
                </div>
                Add Screen
              </div></Button
            >
          </Layout>
        </div>
      </div>
    {/if}
  </div>

  {#if $selectedComponent != null}
    <div class="components-pane">
      <PropertiesPanel />
    </div>
  {/if}
</div>

<slot />

<ScreenWizard bind:showModal />

<style>
  .root {
    display: grid;
    grid-template-columns: 260px 1fr 260px;
    align-items: stretch;
    flex: 1 1 auto;
    height: 0;
  }
  .new-screen-text {
    width: 160px;
    text-align: center;
    color: #2c2c2c;
    font-weight: 600;
  }

  .new-screen-button {
    margin-left: 5px;
    height: 20px;
    width: 100px;
    display: flex;
    align-items: center;
  }

  .background-icon {
    margin-top: 4px;
    margin-right: 4px;
  }

  .img-size {
    width: 160px;
    height: 160px;
  }
  .ui-nav {
    grid-column: 1;
    background-color: var(--background);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    border-right: var(--border-light);
  }

  .preview-pane {
    grid-column: 2;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
    padding: var(--spacing-xl) 40px;
  }
  .preview-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
  }
  .preview-header > :global(*) {
    flex: 0 0 auto;
  }
  .preview-header > :global(*:first-child) {
    flex: 1 1 auto;
  }

  .preview-content {
    flex: 1 1 auto;
  }

  .components-pane {
    grid-column: 3;
    background-color: var(--background);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-left: var(--border-light);
    overflow-x: hidden;
  }

  .centered {
    width: calc(100% - 350px);
    height: calc(100% - 100px);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .main {
    width: 300px;
  }
</style>
