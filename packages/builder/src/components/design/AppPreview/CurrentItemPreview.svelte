<script>
  import { onMount } from "svelte"
  import { store, currentAsset, selectedComponent } from "builderStore"
  import iframeTemplate from "./iframeTemplate"
  import { Screen } from "builderStore/store/screenTemplates/utils/Screen"
  import { FrontendTypes } from "../../../constants"

  let iframe
  let layout
  let screen

  // Create screen slot placeholder for use when a page is selected rather
  // than a screen
  const screenPlaceholder = new Screen()
    .name("Screen Placeholder")
    .route("*")
    .component("@budibase/standard-components/screenslot")
    .instanceName("Content Placeholder")
    .json()

  // Construct iframe template
  $: template = iframeTemplate.replace(
    /\{\{ CLIENT_LIB_PATH }}/,
    $store.clientLibPath
  )

  // Extract data to pass to the iframe
  $: {
    if ($store.currentFrontEndType === FrontendTypes.LAYOUT) {
      layout = $currentAsset
      screen = screenPlaceholder
    } else {
      screen = $currentAsset
      layout = $store.layouts.find(layout => layout._id === screen?.layoutId)
    }
  }
  $: selectedComponentId = $store.selectedComponentId ?? ""
  $: previewData = {
    appId: $store.appId,
    layout,
    screen,
    selectedComponentId,
    previewType: $store.currentFrontEndType,
  }

  // Saving pages and screens to the DB causes them to have _revs.
  // These revisions change every time a save happens and causes
  // these reactive statements to fire, even though the actual
  // definition hasn't changed.
  // By deleting all _rev properties we can avoid this and increase
  // performance.
  $: json = JSON.stringify(previewData)
  $: strippedJson = json.replaceAll(/"_rev":\s*"[^"]+"/g, `"_rev":""`)

  // Update the iframe with the builder info to render the correct preview
  const refreshContent = message => {
    if (iframe) {
      iframe.contentWindow.postMessage(message)
    }
  }

  // Refresh the preview when required
  $: refreshContent(strippedJson)

  onMount(() => {
    // Initialise the app when mounted
    iframe.contentWindow.addEventListener(
      "bb-ready",
      () => refreshContent(strippedJson),
      { once: true }
    )

    // Add listener to select components
    iframe.contentWindow.addEventListener("bb-select-component", data => {
      store.actions.components.select({ _id: data.detail })
    })
  })
</script>

<div class="component-container">
  <iframe
    style="height: 100%; width: 100%"
    title="componentPreview"
    bind:this={iframe}
    srcdoc={template} />
</div>

<style>
  .component-container {
    grid-row-start: middle;
    grid-column-start: middle;
    position: relative;
    overflow: hidden;
    margin: auto;
    height: 100%;
    background-color: white;
  }
  .component-container iframe {
    border: 0;
    left: 0;
    top: 0;
    width: 100%;
  }
</style>
